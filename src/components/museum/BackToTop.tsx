import { useState, useEffect } from 'react';

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setShow(max > 0 && window.scrollY / max > 0.4);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-8 z-50 w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 hover:scale-110"
      style={{
        borderColor: 'hsl(var(--museum-gold))',
        background: 'hsla(var(--museum-bg), 0.8)',
        backdropFilter: 'blur(8px)',
      }}
      aria-label="Back to top"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="hsl(var(--museum-gold))" strokeWidth="1.5" strokeLinecap="round">
        <path d="M7 12V2M2 6l5-4 5 4" />
      </svg>
    </button>
  );
}
