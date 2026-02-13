import { useMuseumStore } from '@/store/museumStore';
import { motion } from 'framer-motion';
import { useRef, useState, type ReactNode } from 'react';

export function HeroOverlay() {
  const enterGallery = useMuseumStore((s) => s.enterGallery);
  const setShowBooking = useMuseumStore((s) => s.setShowBooking);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none"
    >
      <div className="text-center pointer-events-auto">
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-serif text-6xl md:text-8xl text-museum-white tracking-tight mb-3"
        >
          THE GALLERY
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-museum-white/50 text-xs tracking-[0.3em] uppercase mb-14"
        >
          A Digital Exhibition
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex gap-5 justify-center"
        >
          <MagneticButton onClick={enterGallery}>Enter Gallery</MagneticButton>
          <MagneticButton variant="outline" onClick={() => setShowBooking(true)}>Book Viewing</MagneticButton>
        </motion.div>
      </div>
    </motion.div>
  );
}

function MagneticButton({
  children,
  onClick,
  variant = 'filled',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'filled' | 'outline';
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
    'px-8 py-3 text-xs tracking-[0.2em] uppercase backdrop-blur-md transition-colors duration-200';
  const variants = {
    filled:
      'bg-museum-white/10 text-museum-white border border-museum-white/20 hover:bg-museum-white/20',
    outline:
      'bg-transparent text-museum-white/60 border border-museum-white/10 hover:border-museum-white/30 hover:text-museum-white/80',
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
    >
      {children}
    </motion.button>
  );
}
