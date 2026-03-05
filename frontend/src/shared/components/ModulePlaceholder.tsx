export function ModulePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="app-card">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </div>
  );
}
