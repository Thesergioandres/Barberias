export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton animate-pulse rounded-2xl ${className}`} />;
}
