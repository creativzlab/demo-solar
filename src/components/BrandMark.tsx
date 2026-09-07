type BrandMarkProps = {
  inverse?: boolean;
  hideIcon?: boolean;
};

export function BrandMark({ inverse = false, hideIcon = false }: BrandMarkProps) {
  return (
    <span className={`brand ${inverse ? "brand--inverse" : ""}`} aria-label="Demanda Solar Infinita">
      {!hideIcon && (
        <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
          <path d="M24 5 29.5 16.5 42 18l-9 8.5L35.5 39 24 33 12.5 39 15 26.5 6 18l12.5-1.5L24 5Z" />
          <circle cx="24" cy="24" r="6.5" />
        </svg>
      )}
      <span>
        <strong>Demanda Solar</strong>
        <small>Infinita</small>
      </span>
    </span>
  );
}
