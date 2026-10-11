"use client";

import { useRef, useState, useTransition } from "react";

type ConfirmTone = "default" | "danger";

type ConfirmCopy = {
  title: string;
  message: string;
  confirmLabel: string;
  tone?: ConfirmTone;
};

type AdminConfirmActionProps = ConfirmCopy & {
  action: (formData: FormData) => void | Promise<void>;
  fields: Record<string, string>;
  triggerLabel: string;
};

type AdminConfirmButtonProps = ConfirmCopy & {
  onConfirm: () => void;
  triggerLabel: string;
};

function DialogContent({
  title,
  message,
  confirmLabel,
  tone = "default",
  pending,
  error,
  onCancel,
  onConfirm,
}: ConfirmCopy & {
  pending: boolean;
  error?: string;
  onCancel: () => void;
  onConfirm?: () => void;
}) {
  return (
    <div className="admin-modal-panel">
      <button className="admin-modal-close" aria-label="Close confirmation" disabled={pending} onClick={onCancel} type="button">×</button>
      <p className="eyebrow">Please confirm</p>
      <h2>{title}</h2>
      <p>{message}</p>
      {error ? <p className="admin-modal-error" role="alert">{error}</p> : null}
      <div className="admin-modal-actions">
        <button className="button button-dark" disabled={pending} onClick={onCancel} type="button">Cancel</button>
        <button className={`button ${tone === "danger" ? "admin-danger-button" : "button-accent"}`} disabled={pending} onClick={onConfirm} type={onConfirm ? "button" : "submit"}>
          {pending ? "Working..." : confirmLabel}
        </button>
      </div>
    </div>
  );
}

export function AdminConfirmAction({
  action,
  fields,
  triggerLabel,
  title,
  message,
  confirmLabel,
  tone,
}: AdminConfirmActionProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function close() {
    if (!pending) dialogRef.current?.close();
  }

  function submit(formData: FormData) {
    setError("");
    startTransition(async () => {
      try {
        await action(formData);
        dialogRef.current?.close();
      } catch {
        setError("That action could not be completed. Please try again.");
      }
    });
  }

  return (
    <>
      <button className={`text-button ${tone === "danger" ? "text-button-danger" : ""}`} onClick={() => dialogRef.current?.showModal()} type="button">
        {triggerLabel}
      </button>
      <dialog className="admin-modal" onClick={(event) => event.target === event.currentTarget && close()} ref={dialogRef}>
        <form action={submit}>
          {Object.entries(fields).map(([name, value]) => <input key={name} name={name} type="hidden" value={value} />)}
          <DialogContent title={title} message={message} confirmLabel={confirmLabel} tone={tone} pending={pending} error={error} onCancel={close} />
        </form>
      </dialog>
    </>
  );
}

export function AdminConfirmButton({
  onConfirm,
  triggerLabel,
  title,
  message,
  confirmLabel,
  tone,
}: AdminConfirmButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function confirm() {
    onConfirm();
    dialogRef.current?.close();
  }

  return (
    <>
      <button className={`text-button ${tone === "danger" ? "text-button-danger" : ""}`} onClick={() => dialogRef.current?.showModal()} type="button">
        {triggerLabel}
      </button>
      <dialog className="admin-modal" onClick={(event) => event.target === event.currentTarget && dialogRef.current?.close()} ref={dialogRef}>
        <div>
          <DialogContent title={title} message={message} confirmLabel={confirmLabel} tone={tone} pending={false} onCancel={() => dialogRef.current?.close()} onConfirm={confirm} />
        </div>
      </dialog>
    </>
  );
}
