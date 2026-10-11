"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOutAdmin } from "@/app/admin/actions";

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  "keydown",
  "pointerdown",
  "scroll",
  "touchstart",
];

export default function AdminSessionGuard({
  idleTimeoutMs,
}: {
  idleTimeoutMs: number;
}) {
  const lastActivityRef = useRef(0);
  const router = useRouter();

  useEffect(() => {
    let logoutTimer: ReturnType<typeof setTimeout>;
    let loggingOut = false;

    const logOut = () => {
      if (loggingOut) return;
      loggingOut = true;
      void signOutAdmin().catch(() => {
        router.replace("/admin/login");
        router.refresh();
      });
    };

    const scheduleLogout = () => {
      clearTimeout(logoutTimer);
      const remaining = Math.max(
        0,
        idleTimeoutMs - (Date.now() - lastActivityRef.current),
      );
      logoutTimer = setTimeout(logOut, remaining);
    };

    const recordActivity = () => {
      lastActivityRef.current = Date.now();
      scheduleLogout();
    };

    const checkVisibility = () => {
      if (
        document.visibilityState === "visible" &&
        Date.now() - lastActivityRef.current >= idleTimeoutMs
      ) {
        logOut();
      }
    };

    lastActivityRef.current = Date.now();

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, recordActivity, { passive: true });
    });
    document.addEventListener("visibilitychange", checkVisibility);

    const heartbeatMs = Math.min(5 * 60 * 1000, idleTimeoutMs / 3);
    const heartbeat = window.setInterval(async () => {
      if (Date.now() - lastActivityRef.current >= idleTimeoutMs) {
        logOut();
        return;
      }

      try {
        const response = await fetch("/admin/session", {
          cache: "no-store",
          credentials: "same-origin",
        });

        if (!response.ok || response.redirected) {
          logOut();
        }
      } catch {
        // A temporary network failure should not destroy a valid session.
      }
    }, heartbeatMs);

    scheduleLogout();

    return () => {
      clearTimeout(logoutTimer);
      window.clearInterval(heartbeat);
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, recordActivity);
      });
      document.removeEventListener("visibilitychange", checkVisibility);
    };
  }, [idleTimeoutMs, router]);

  return null;
}
