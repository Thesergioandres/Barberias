import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../animations/gsapConfig';
import { EssenceMicroSymbol } from './EssenceMicroSymbol';

type EssenceMiniLoaderProps = {
  size?: number;
};

export function EssenceMiniLoader({ size = 18 }: EssenceMiniLoaderProps) {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const auraRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    if (ringRef.current) {
      gsap.to(ringRef.current, {
        rotation: 360,
        duration: 1.2,
        ease: 'none',
        repeat: -1
      });
    }

    if (auraRef.current) {
      gsap.fromTo(
        auraRef.current,
        { opacity: 0.35, scale: 1 },
        {
          opacity: 0.7,
          scale: 1.2,
          duration: 0.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        }
      );
    }
  });

  const ringStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderWidth: Math.max(2, Math.round(size / 9))
  };

  const auraStyle = {
    width: `${Math.round(size * 1.6)}px`,
    height: `${Math.round(size * 1.6)}px`
  };

  return (
    <span className="relative inline-flex items-center justify-center">
      <span
        ref={auraRef}
        className="absolute rounded-full"
        style={{
          ...auraStyle,
          background: 'radial-gradient(circle, var(--primary) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(8px)'
        }}
      />
      <span
        ref={ringRef}
        className="relative rounded-full border border-[color:var(--primary)]"
        style={ringStyle}
      />
      <span className="absolute">
        <EssenceMicroSymbol size={Math.round(size * 0.9)} />
      </span>
    </span>
  );
}
