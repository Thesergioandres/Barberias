type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  busy = false
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="overlay-surface fixed inset-0 z-50 flex items-center justify-center backdrop-blur">
      <div className="app-card w-full max-w-md">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description ? <p className="mt-2 text-sm text-muted">{description}</p> : null}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button className="btn-ghost" type="button" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </button>
          <button className="btn-primary" type="button" onClick={onConfirm} disabled={busy}>
            {busy ? 'Guardando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
