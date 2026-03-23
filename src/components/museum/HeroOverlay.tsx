import { useMuseumStore } from '@/store/museumStore';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect, type ReactNode } from 'react';

const PARTICLE_COUNT = 40;

interface Particle {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
}

function useParticles(): Particle[] {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 1.5,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 6,
      drift: (Math.random() - 0.5) * 30,
      opacity: 0.3 + Math.random() * 0.3,
    }))
  );
  return particles;
}

export function HeroOverlay() {
  const enterGallery = useMuseumStore((s) => s.enterGallery);
  const setShowBooking = useMuseumStore((s) => s.setShowBooking);
  const particles = useParticles();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const smoothPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);

  // Smooth parallax
  useEffect(() => {
    const animate = () => {
      smoothPos.current.x += (mousePos.x - smoothPos.current.x) * 0.08;
      smoothPos.current.y += (mousePos.y - smoothPos.current.y) * 0.08;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    setMousePos({
      x: ((e.clientX - cx) / cx),
      y: ((e.clientY - cy) / cy),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none"
      onMouseMove={handleMouseMove}
      style={{ pointerEvents: 'auto' }}
    >
      {/* Radial glow behind sculpture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 45%, hsla(var(--museum-gold), 0.06) 0%, transparent 70%)',
        }}
      />

      {/* Ambient gold particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              bottom: `-5%`,
              width: p.size,
              height: p.size,
              background: 'hsl(var(--museum-gold))',
              opacity: p.opacity,
              animation: `particleFloat ${p.duration}s ${p.delay}s infinite linear`,
              '--drift': `${p.drift}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Text content */}
      <div className="text-center pointer-events-auto relative z-10">
        {/* Shimmer title */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-display text-6xl md:text-8xl font-light text-museum-white tracking-tight mb-3 shimmer-text"
        >
          THE GALLERY
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="font-ui text-[10px] text-museum-text-secondary tracking-[0.3em] uppercase mb-14"
        >
          A Digital Exhibition
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex gap-5 justify-center"
        >
          <MagneticButton onClick={enterGallery} data-cursor="cta">Enter Gallery</MagneticButton>
          <MagneticButton variant="outline" onClick={() => setShowBooking(true)} data-cursor="cta">Book Viewing</MagneticButton>
        </motion.div>
      </div>
    </motion.div>
  );
}

function MagneticButton({
  children,
  onClick,
  variant = 'filled',
  ...props
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'filled' | 'outline';
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setOffset({ x: (e.clientX - cx) * 0.12, y: (e.clientY - cy) * 0.12 });
  };

  const base =
    'px-8 py-3 font-ui text-[10px] tracking-[0.2em] uppercase backdrop-blur-md transition-colors duration-200';
  const variants = {
    filled:
      'bg-museum-white/10 text-museum-white border border-museum-gold/20 hover:bg-museum-gold/15 hover:border-museum-gold/40',
    outline:
      'bg-transparent text-museum-white/60 border border-museum-white/10 hover:border-museum-gold/30 hover:text-museum-white/80',
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 280, damping: 18 }}
      className={`${base} ${variants[variant]}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
