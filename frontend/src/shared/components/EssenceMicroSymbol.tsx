type EssenceMicroSymbolProps = {
  size?: number;
  className?: string;
};

export function EssenceMicroSymbol({ size = 96, className }: EssenceMicroSymbolProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 120 140"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M28 12h64l-8 14H42v26h34l-8 14H42v26h42l-8 14H28V12z"
        stroke="var(--primary)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
