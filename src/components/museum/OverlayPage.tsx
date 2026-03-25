import { motion, AnimatePresence } from 'framer-motion';
import { useMuseumStore } from '@/store/museumStore';
import { AboutSection } from './AboutSection';
import { ContactSection } from './ContactSection';
import { GalleryFooter } from './Footer';

export function OverlayPage() {
  const activeOverlay = useMuseumStore((s) => s.activeOverlay);
  const setActiveOverlay = useMuseumStore((s) => s.setActiveOverlay);

  return (
    <AnimatePresence>
      {activeOverlay && (
        <motion.div
          key={activeOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[70] overflow-y-auto"
          style={{ background: 'hsl(var(--museum-bg))' }}
        >
          {/* Close button */}
          <button
            onClick={() => setActiveOverlay(null)}
            className="fixed top-5 right-6 z-[80] w-10 h-10 flex items-center justify-center border border-museum-gold/30 bg-museum-bg/80 text-museum-gold backdrop-blur-sm hover:border-museum-gold hover:text-museum-white transition-colors"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          </button>

          {activeOverlay === 'about' && (
            <>
              <AboutSection />
              <GalleryFooter />
            </>
          )}
          {activeOverlay === 'contact' && (
            <>
              <ContactSection />
              <GalleryFooter />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
