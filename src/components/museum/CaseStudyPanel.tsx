import { useMuseumStore } from '@/store/museumStore';
import { ARTWORKS } from '@/data/artworks';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

function useCountUp(target: string, active: boolean) {
  const [val, setVal] = useState('0');
  const num = parseFloat(target.replace(/[^0-9.-]/g, ''));
  const prefix = target.match(/^([^0-9]*)/)?.[1] || '';
  const suffix = target.match(/([^0-9.]*)$/)?.[1] || '';
  
  useEffect(() => {
    if (!active || isNaN(num)) { setVal(target); return; }
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(num * eased);
      setVal(`${prefix}${current}${suffix}`);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, num, prefix, suffix]);

  return isNaN(num) ? target : val;
}

function StatItem({ label, value, active }: { label: string; value: string; active: boolean }) {
  const display = useCountUp(value, active);
  return (
    <div>
      <p className="text-museum-gold text-3xl font-display">{display}</p>
      <p className="font-ui text-[10px] tracking-[0.25em] uppercase text-museum-white/40 mt-1">
        {label}
      </p>
    </div>
  );
}

function AvailabilityBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; glow: string }> = {
    available: { bg: 'hsla(140, 60%, 40%, 0.15)', text: 'hsl(140, 60%, 55%)', glow: '0 0 12px hsla(140, 60%, 40%, 0.3)' },
    sold: { bg: 'hsla(0, 0%, 40%, 0.15)', text: 'hsl(0, 0%, 55%)', glow: 'none' },
    'on-loan': { bg: 'hsla(var(--museum-gold), 0.15)', text: 'hsl(var(--museum-gold))', glow: '0 0 12px hsla(var(--museum-gold), 0.2)' },
  };
  const s = styles[status] || styles.available;
  return (
    <span
      className="px-3 py-1 rounded-full font-ui text-[9px] tracking-[0.2em] uppercase"
      style={{ background: s.bg, color: s.text, boxShadow: s.glow }}
    >
      {status.replace('-', ' ')}
    </span>
  );
}

export function CaseStudyPanel() {
  const exitCaseStudy = useMuseumStore((s) => s.exitCaseStudy);
  const activeArtworkIndex = useMuseumStore((s) => s.activeArtworkIndex);
  const zoomToArtwork = useMuseumStore((s) => s.zoomToArtwork);
  const artwork = ARTWORKS[activeArtworkIndex];
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [statsActive, setStatsActive] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStatsActive(false);
    setShowInquiry(false);
    setInquirySubmitted(false);
    setFullscreen(false);
    const t = setTimeout(() => setStatsActive(true), 600);
    return () => clearTimeout(t);
  }, [activeArtworkIndex]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreen) { setFullscreen(false); return; }
      if (e.key === 'ArrowLeft') navigatePrev();
      if (e.key === 'ArrowRight') navigateNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeArtworkIndex, fullscreen]);

  if (!artwork) return null;

  const navigatePrev = () => {
    const prev = (activeArtworkIndex - 1 + ARTWORKS.length) % ARTWORKS.length;
    zoomToArtwork(String(ARTWORKS[prev].id), prev);
  };

  const navigateNext = () => {
    const next = (activeArtworkIndex + 1) % ARTWORKS.length;
    zoomToArtwork(String(ARTWORKS[next].id), next);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // CLIENT: integrate EmailJS here
    await new Promise((r) => setTimeout(r, 800));
    setInquirySubmitted(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-20 flex items-center justify-center"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(8, 8, 8, 0.92)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
          onClick={exitCaseStudy}
        />

        {/* Prev/Next arrows */}
        <button
          onClick={navigatePrev}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center text-museum-white/30 hover:text-museum-gold transition-colors"
          aria-label="Previous artwork"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 4l-6 6 6 6" /></svg>
        </button>
        <button
          onClick={navigateNext}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center text-museum-white/30 hover:text-museum-gold transition-colors"
          aria-label="Next artwork"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 4l6 6-6 6" /></svg>
        </button>

        {/* Modal */}
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="relative z-10 max-w-2xl w-full mx-4 overflow-y-auto max-h-[90vh]"
          style={{ background: 'hsla(var(--museum-charcoal), 0.95)' }}
        >
          {/* Close */}
          <button
            onClick={exitCaseStudy}
            className="absolute top-4 right-5 z-20 text-museum-gold hover:text-museum-white text-lg transition-colors"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Hero image with Ken Burns */}
          <div className="w-full h-56 md:h-72 overflow-hidden relative">
            <motion.img
              src={artwork.image}
              alt={artwork.title}
              initial={{ scale: 1 }}
              animate={{ scale: 1.04 }}
              transition={{ duration: 4, ease: 'easeOut' }}
              className="w-full h-full object-cover"
            />
            {/* Fullscreen button */}
            <button
              onClick={() => setFullscreen(true)}
              className="absolute bottom-3 right-3 px-3 py-1 font-ui text-[9px] tracking-[0.15em] uppercase text-museum-white/50 border border-museum-white/20 hover:border-museum-gold hover:text-museum-gold transition-all"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            >
              Fullscreen
            </button>
          </div>

          <div className="p-8 md:p-10">
            {/* Category tag */}
            <p className="font-ui text-[10px] tracking-[0.35em] uppercase text-museum-gold mb-2">
              {artwork.role}
            </p>

            {/* Title */}
            <h2 className="font-display text-3xl md:text-[42px] font-light text-museum-white mb-6 leading-tight">
              {artwork.title}
            </h2>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b" style={{ borderColor: 'hsla(var(--museum-gold), 0.15)' }}>
              {[
                { label: 'Medium', value: artwork.medium },
                { label: 'Year', value: String(artwork.year) },
                { label: 'Dimensions', value: artwork.dimensions },
                { label: 'Edition', value: artwork.edition },
              ].map((item) => (
                <div key={item.label}>
                  <p className="font-ui text-[9px] tracking-[0.25em] uppercase text-museum-white/30 mb-0.5">{item.label}</p>
                  <p className="text-museum-white/70 text-sm font-body">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Availability */}
            <div className="mb-6">
              <AvailabilityBadge status={artwork.availability} />
            </div>

            {/* Sections */}
            <div className="space-y-5 text-museum-white/65 text-sm leading-relaxed">
              <Section title="Challenge">{artwork.challenge}</Section>
              <div className="h-px" style={{ background: 'hsla(var(--museum-gold), 0.1)' }} />
              <Section title="Solution">{artwork.solution}</Section>
              <div className="h-px" style={{ background: 'hsla(var(--museum-gold), 0.1)' }} />
              <Section title="Outcomes">{artwork.outcomes}</Section>
            </div>

            {/* Stats */}
            <div className="flex gap-10 mt-8 pt-6 border-t" style={{ borderColor: 'hsla(var(--museum-gold), 0.15)' }}>
              {artwork.stats.map((kpi) => (
                <StatItem key={kpi.label} label={kpi.label} value={kpi.value} active={statsActive} />
              ))}
            </div>

            {/* Inquiry CTA */}
            <div className="mt-8">
              {!showInquiry && !inquirySubmitted && (
                <button
                  onClick={() => setShowInquiry(true)}
                  className="w-full py-3 font-ui text-[10px] tracking-[0.2em] uppercase border text-museum-white hover:bg-museum-gold/10 transition-all"
                  style={{ borderColor: 'hsl(var(--museum-gold))' }}
                >
                  Request Inquiry
                </button>
              )}

              <AnimatePresence>
                {showInquiry && !inquirySubmitted && (
                  <motion.form
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={handleInquirySubmit}
                    className="space-y-4 overflow-hidden"
                  >
                    <input
                      placeholder="Name"
                      required
                      className="w-full bg-transparent border-0 border-b border-museum-white/10 text-museum-white font-body text-sm py-2 focus:outline-none focus:border-museum-gold placeholder:text-museum-white/20"
                    />
                    <input
                      placeholder="Email"
                      type="email"
                      required
                      className="w-full bg-transparent border-0 border-b border-museum-white/10 text-museum-white font-body text-sm py-2 focus:outline-none focus:border-museum-gold placeholder:text-museum-white/20"
                    />
                    <textarea
                      placeholder="Message"
                      rows={3}
                      required
                      className="w-full bg-transparent border-0 border-b border-museum-white/10 text-museum-white font-body text-sm py-2 focus:outline-none focus:border-museum-gold placeholder:text-museum-white/20 resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 font-ui text-[10px] tracking-[0.2em] uppercase transition-all"
                      style={{ background: 'hsl(var(--museum-gold))', color: 'hsl(var(--museum-bg))' }}
                    >
                      Submit Inquiry
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {inquirySubmitted && (
                <div className="text-center py-4">
                  <svg className="mx-auto mb-3" width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="14" stroke="hsl(var(--museum-gold))" strokeWidth="1.5" opacity="0.5" />
                    <path d="M10 16l4 4 8-8" stroke="hsl(var(--museum-gold))" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <p className="text-museum-gold font-ui text-xs tracking-[0.15em] uppercase">Inquiry Received</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer"
            style={{ background: 'rgba(0,0,0,0.95)' }}
            onClick={() => setFullscreen(false)}
          >
            <img
              src={artwork.image}
              alt={artwork.title}
              className="max-w-[95vw] max-h-[95vh] object-contain"
            />
            <p className="absolute bottom-6 text-museum-white/30 font-ui text-[10px] tracking-[0.2em] uppercase">
              Press ESC to close
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-museum-white font-ui text-[10px] tracking-[0.25em] uppercase mb-1.5">{title}</h3>
      <p>{children}</p>
    </div>
  );
}
