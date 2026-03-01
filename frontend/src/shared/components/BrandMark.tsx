export function BrandMark({ size = 44 }: { size?: number }) {
  return <div className="brand-logo" style={{ width: size, height: size }} aria-hidden="true" />;
}
