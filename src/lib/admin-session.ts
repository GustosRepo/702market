const encoder = new TextEncoder();

export const ADMIN_SESSION_COOKIE = "marketella_admin_session";

function positiveNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getAdminSessionPolicy() {
  return {
    idleTimeoutMs:
      positiveNumber(process.env.ADMIN_IDLE_TIMEOUT_MINUTES, 30) * 60 * 1000,
    absoluteTimeoutMs:
      positiveNumber(process.env.ADMIN_MAX_SESSION_HOURS, 12) * 60 * 60 * 1000,
  };
}

function getSigningSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

export function hasAdminSessionSecret() {
  return getSigningSecret().length >= 32;
}

async function getSigningKey() {
  const secret = getSigningSecret();

  if (secret.length < 32) {
    return null;
  }

  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign", "verify"],
  );
}

function toBase64Url(bytes: ArrayBuffer) {
  return Buffer.from(bytes).toString("base64url");
}

function fromBase64Url(value: string) {
  try {
    return Buffer.from(value, "base64url");
  } catch {
    return null;
  }
}

export async function createAdminSessionValue(
  issuedAt = Date.now(),
  lastActiveAt = issuedAt,
) {
  const key = await getSigningKey();

  if (!key) {
    return null;
  }

  const payload = `${issuedAt}.${lastActiveAt}`;
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return `${payload}.${toBase64Url(signature)}`;
}

export type AdminSessionValidation =
  | { valid: true; issuedAt: number; lastActiveAt: number }
  | { valid: false; reason: "missing" | "invalid" | "idle" | "absolute" };

export async function validateAdminSessionValue(
  value: string | undefined,
  now = Date.now(),
): Promise<AdminSessionValidation> {
  if (!value) {
    return { valid: false, reason: "missing" };
  }

  const [issuedAtValue, lastActiveAtValue, signatureValue, ...extra] = value.split(".");
  const issuedAt = Number(issuedAtValue);
  const lastActiveAt = Number(lastActiveAtValue);
  const signature = fromBase64Url(signatureValue || "");
  const key = await getSigningKey();

  if (
    extra.length ||
    !key ||
    !signature ||
    !Number.isSafeInteger(issuedAt) ||
    !Number.isSafeInteger(lastActiveAt) ||
    issuedAt > lastActiveAt ||
    lastActiveAt > now + 60_000
  ) {
    return { valid: false, reason: "invalid" };
  }

  const payload = `${issuedAt}.${lastActiveAt}`;
  const verified = await crypto.subtle.verify(
    "HMAC",
    key,
    signature,
    encoder.encode(payload),
  );

  if (!verified) {
    return { valid: false, reason: "invalid" };
  }

  const policy = getAdminSessionPolicy();

  if (now - issuedAt >= policy.absoluteTimeoutMs) {
    return { valid: false, reason: "absolute" };
  }

  if (now - lastActiveAt >= policy.idleTimeoutMs) {
    return { valid: false, reason: "idle" };
  }

  return { valid: true, issuedAt, lastActiveAt };
}

export function getAdminSessionCookieOptions(issuedAt = Date.now()) {
  const { absoluteTimeoutMs } = getAdminSessionPolicy();
  const remainingSeconds = Math.max(
    0,
    Math.floor((issuedAt + absoluteTimeoutMs - Date.now()) / 1000),
  );

  return {
    httpOnly: true,
    maxAge: remainingSeconds,
    path: "/admin",
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function getExpiredAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    maxAge: 0,
    path: "/admin",
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
  };
}
