import { useState, useRef, useEffect } from 'react';
import { useMuseumStore } from '@/store/museumStore';
import { ARTWORKS } from '@/data/artworks';
import { motion } from 'framer-motion';
import { GALLERY_CONFIG } from '@/config/gallery.config';

export function MobileFallback() {
  const setShowBooking = useMuseumStore((s) => s.setShowBooking);
  const zoomToArtwork = useMuseumStore((s) => s.zoomToArtwork);
  const showCaseStudy = useMuseumStore((s) => s.showCaseStudy);
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...new Set(ARTWORKS.map((a) => a.category))];
  const filtered = filter === 'All' ? ARTWORKS : ARTWORKS.filter((a) => a.category === filter);

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--museum-bg))' }}>
      {/* Hero */}
      <div className="flex items-center justify-center min-h-[50vh] px-6">
        <div className="text-center">
          <h1 className="font-display text-[clamp(2.5rem,10vw,5rem)] text-museum-white tracking-tight mb-3 shimmer-text">
            {GALLERY_CONFIG.name}
          </h1>
          <p className="font-ui text-[10px] text-museum-text-secondary tracking-[0.35em] uppercase mb-10">
            {GALLERY_CONFIG.tagline}
          </p>
          <button
            onClick={() => setShowBooking(true)}
            className="px-8 py-3 border font-ui text-[10px] tracking-[0.2em] uppercase text-museum-white hover:bg-museum-gold/10 transition-colors"
            style={{ borderColor: 'hsl(var(--museum-gold))' }}
          >
            Book Viewing
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div className="px-4 mb-6 flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className="px-4 py-1.5 rounded-full font-ui text-[9px] tracking-[0.15em] uppercase whitespace-nowrap transition-all shrink-0"
            style={{
              background: filter === cat ? 'hsl(var(--museum-gold))' : 'transparent',
              color: filter === cat ? 'hsl(var(--museum-bg))' : 'hsl(var(--museum-gold))',
              border: `1px solid ${filter === cat ? 'hsl(var(--museum-gold))' : 'hsla(var(--museum-gold), 0.3)'}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Artwork cards */}
      <div className="px-4 pb-12 space-y-4">
        {filtered.map((artwork, i) => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            index={i}
            onClick={() => zoomToArtwork(String(artwork.id), ARTWORKS.indexOf(artwork))}
          />
        ))}
      </div>

      {/* Show case study as bottom sheet on mobile */}
      {showCaseStudy && <MobileCaseStudy />}
    </div>
  );
}

function ArtworkCard({ artwork, index, onClick }: { artwork: typeof ARTWORKS[0]; index: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      className="w-full text-left border p-0 overflow-hidden transition-all cursor-pointer"
      style={{
        borderColor: 'hsla(var(--museum-gold), 0.15)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `all 0.5s ease ${index * 0.08}s`,
      }}
    >
      <div className="w-full aspect-[16/10] overflow-hidden" style={{ background: 'hsl(var(--museum-wall))' }}>
        <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="p-4">
        <p className="font-ui text-[9px] tracking-[0.3em] uppercase text-museum-gold mb-1">{artwork.category}</p>
        <h3 className="font-display text-xl text-museum-white">{artwork.title}</h3>
        <p className="text-museum-white/40 text-xs font-body mt-1">{artwork.medium} · {artwork.year}</p>
      </div>
    </motion.div>
  );
}

function MobileCaseStudy() {
  const exitCaseStudy = useMuseumStore((s) => s.exitCaseStudy);
  const activeArtworkIndex = useMuseumStore((s) => s.activeArtworkIndex);
  const artwork = ARTWORKS[activeArtworkIndex];
  if (!artwork) return null;

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: 'hsl(var(--museum-bg))', borderRadius: '20px 20px 0 0', marginTop: '5vh' }}
    >
      {/* Handle bar */}
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-10 h-1 rounded-full bg-museum-white/20" />
      </div>
      <div className="p-5 max-w-lg mx-auto">
        <button
          onClick={exitCaseStudy}
          className="text-museum-white/40 text-xs tracking-[0.2em] uppercase mb-6 hover:text-museum-white transition-colors"
        >
          ← Back
        </button>
        <img src={artwork.image} alt={artwork.title} className="w-full h-48 object-cover mb-6" />
        <p className="text-museum-gold font-ui text-[10px] tracking-[0.35em] uppercase mb-2">{artwork.role}</p>
        <h2 className="font-display text-3xl text-museum-white mb-6">{artwork.title}</h2>
        <div className="space-y-5 text-museum-white/65 text-sm leading-relaxed font-body">
          <div>
            <h3 className="text-museum-white font-ui text-[10px] tracking-[0.25em] uppercase mb-1">Challenge</h3>
            <p>{artwork.challenge}</p>
          </div>
          <div>
            <h3 className="text-museum-white font-ui text-[10px] tracking-[0.25em] uppercase mb-1">Solution</h3>
            <p>{artwork.solution}</p>
          </div>
          <div>
            <h3 className="text-museum-white font-ui text-[10px] tracking-[0.25em] uppercase mb-1">Outcomes</h3>
            <p>{artwork.outcomes}</p>
          </div>
        </div>
        <div className="flex gap-8 mt-8 pt-6 border-t" style={{ borderColor: 'hsla(var(--museum-gold), 0.15)' }}>
          {artwork.stats.map((s) => (
            <div key={s.label}>
              <p className="text-museum-gold text-3xl font-display">{s.value}</p>
              <p className="text-museum-white/40 font-ui text-[10px] tracking-[0.25em] uppercase mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
