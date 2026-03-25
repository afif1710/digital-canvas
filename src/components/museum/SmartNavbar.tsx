import { useState, useEffect, useRef } from 'react';
import { useMuseumStore } from '@/store/museumStore';
import { GALLERY_CONFIG } from '@/config/gallery.config';
import { motion, AnimatePresence } from 'framer-motion';

export function SmartNavbar() {
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScroll = useRef(0);
  const cameraState = useMuseumStore((s) => s.cameraState);
  const setShowBooking = useMuseumStore((s) => s.setShowBooking);
  const setActiveOverlay = useMuseumStore((s) => s.setActiveOverlay);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y < 80) {
        setVisible(false);
      } else if (y < lastScroll.current) {
        setVisible(true); // scrolling up
      } else {
        setVisible(false); // scrolling down
      }
      lastScroll.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Only show in corridor state
  if (cameraState !== 'corridor') return null;


  const navItems = [
    { label: 'Gallery', action: () => { setActiveOverlay(null); const el = document.querySelector('#gallery'); if (el) el.scrollIntoView({ behavior: 'smooth' }); } },
    { label: 'About', action: () => setActiveOverlay('about') },
    { label: 'Contact', action: () => setActiveOverlay('contact') },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: visible ? 0 : -100 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          background: 'hsla(var(--museum-bg), 0.75)',
          borderColor: 'hsla(var(--museum-gold), 0.2)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Brand */}
          <span className="font-display text-lg text-museum-white tracking-tight">
            {GALLERY_CONFIG.name}
          </span>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => { setMobileOpen(false); item.action(); }}
                className="font-ui text-[10px] tracking-[0.2em] uppercase text-museum-white/60 hover:text-museum-gold transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-museum-gold group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* Book viewing CTA */}
          <button
            onClick={() => setShowBooking(true)}
            className="hidden md:block font-ui text-[10px] tracking-[0.2em] uppercase px-5 py-2 border text-museum-white hover:bg-museum-gold hover:text-museum-bg transition-all duration-200"
            style={{ borderColor: 'hsl(var(--museum-gold))' }}
          >
            Book Viewing
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="w-5 h-[1.5px] bg-museum-white block"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-5 h-[1.5px] bg-museum-white block"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="w-5 h-[1.5px] bg-museum-white block"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center"
            style={{ background: 'hsla(var(--museum-bg), 0.95)' }}
          >
            <div className="flex flex-col items-center gap-8">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => { setMobileOpen(false); item.action(); }}
                  className="font-display text-3xl text-museum-white hover:text-museum-gold transition-colors"
                >
                  {item.label}
                </motion.button>
              ))}
              <motion.button
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => { setMobileOpen(false); setShowBooking(true); }}
                className="font-ui text-xs tracking-[0.2em] uppercase px-8 py-3 border text-museum-gold mt-4"
                style={{ borderColor: 'hsl(var(--museum-gold))' }}
              >
                Book Viewing
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
