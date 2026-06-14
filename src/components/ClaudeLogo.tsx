/**
 * 仿 Claude 的赤陶橙星形（sunburst）logo。
 * 由若干自中心向外、中间略宽的花瓣组成。
 */
export function ClaudeLogo({ size = 24, className }: { size?: number; className?: string }) {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden
      fill="currentColor"
    >
      {petals.map((deg) => (
        <path
          key={deg}
          d="M50 50 Q 53.5 26 50 7 Q 46.5 26 50 50 Z"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
    </svg>
  );
}
