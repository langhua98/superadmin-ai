"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function ClaudeLogo({ size = 24, className, animate = false }: {
  size?: number;
  className?: string;
  animate?: boolean;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);

  useGSAP(() => {
    if (!animate || !svgRef.current) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // 入场：从 0 旋转 360° + 淡入缩放
      gsap.fromTo(svgRef.current,
        { rotation: -30, scale: 0.6, autoAlpha: 0, transformOrigin: "50% 50%" },
        { rotation: 0, scale: 1, autoAlpha: 1, duration: 0.7, ease: "back.out(1.6)" },
      );
    });
  }, { scope: svgRef });

  return (
    <svg
      ref={svgRef}
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
