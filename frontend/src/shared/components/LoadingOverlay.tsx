export function LoadingOverlay({ label = 'Construyendo tu negocio...' }: { label?: string }) {
  return (
    <div className="overlay-surface fixed inset-0 z-50 flex items-center justify-center backdrop-blur">
      <div className="app-card text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
        <p className="text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}
