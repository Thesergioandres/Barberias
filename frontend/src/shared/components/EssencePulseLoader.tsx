import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../animations/gsapConfig';
import { EssenceMicroSymbol } from './EssenceMicroSymbol';

export function EssencePulseLoader() {
  const glowRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    if (!glowRef.current) return;
    gsap.fromTo(
      glowRef.current,
      { scale: 1, opacity: 0.3 },
      {
        scale: 1.4,
        opacity: 0.7,
        duration: 1.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      }
    );
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0F1E]">
      <div className="relative flex items-center justify-center">
        <div
          ref={glowRef}
          className="absolute h-44 w-44 rounded-full"
          style={{
            background: 'radial-gradient(circle, var(--primary) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(26px)'
          }}
        />
        <EssenceMicroSymbol size={96} className="relative" />
      </div>
    </div>
  );
}
