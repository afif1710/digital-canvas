import { useEffect, useRef, useState } from 'react';

type CursorVariant = 'default' | 'link' | 'artwork' | 'cta';

export function LuxuryCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [visible, setVisible] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.body.style.cursor = 'none';

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const el = target.closest('a, button, [data-cursor="link"]');
      const art = target.closest('[data-cursor="artwork"]');
      const cta = target.closest('[data-cursor="cta"]');
      if (cta) setVariant('cta');
      else if (art) setVariant('artwork');
      else if (el) setVariant('link');
      else setVariant('default');
    };

    const animate = () => {
      const lerp = 0.10;
      ringPos.current.x += (pos.current.x - ringPos.current.x) * lerp;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * lerp;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 5}px, ${pos.current.y - 5}px)`;
      }
      if (ringRef.current) {
        const size = variant === 'cta' ? 50 : variant === 'link' ? 40 : variant === 'artwork' ? 40 : 28;
        const offset = size / 2;
        ringRef.current.style.transform = `translate(${ringPos.current.x - offset}px, ${ringPos.current.y - offset}px)`;
        ringRef.current.style.width = `${size}px`;
        ringRef.current.style.height = `${size}px`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover', onOver);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(rafRef.current);
    };
  }, [visible, variant]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  const ringBg = variant === 'artwork'
    ? 'hsla(var(--museum-gold), 0.3)'
    : 'transparent';

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.15s' }}
    >
      {/* Dot */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 rounded-full"
        style={{
          width: 10,
          height: 10,
          background: 'hsl(var(--museum-gold))',
          willChange: 'transform',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="absolute top-0 left-0 rounded-full flex items-center justify-center"
        style={{
          border: '1px solid hsla(var(--museum-gold), 0.2)',
          background: ringBg,
          willChange: 'transform, width, height',
          transition: 'width 0.25s ease, height 0.25s ease, background 0.25s ease',
        }}
      >
        {variant === 'artwork' && (
          <span
            className="font-ui text-museum-white uppercase"
            style={{ fontSize: 8, letterSpacing: '0.15em' }}
          >
            VIEW
          </span>
        )}
      </div>
    </div>
  );
}
