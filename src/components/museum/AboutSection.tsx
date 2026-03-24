import { useRef, useEffect, useState } from 'react';
import { GALLERY_CONFIG } from '@/config/gallery.config';

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const bioLines = GALLERY_CONFIG.artistBio.split('. ').filter(Boolean);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-32 px-6"
      style={{ background: 'hsl(var(--museum-bg))' }}
    >
      {/* Top divider */}
      <div className="max-w-5xl mx-auto mb-16">
        <div className="h-px w-full" style={{ background: 'hsla(var(--museum-gold), 0.4)' }} />
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        {/* Portrait placeholder */}
        <div
          className="aspect-[4/5] w-full overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--museum-charcoal)), hsl(var(--museum-wall)))',
          }}
        >
          {/* CLIENT: Replace with artist portrait image */}
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-ui text-[10px] tracking-[0.3em] uppercase text-museum-white/20">
              Artist Portrait
            </span>
          </div>
        </div>

        {/* Bio text */}
        <div>
          <p
            className="font-ui text-[10px] tracking-[0.35em] uppercase mb-3 transition-all duration-700"
            style={{
              color: 'hsl(var(--museum-gold))',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            {GALLERY_CONFIG.artistDisciplines.join(' · ')}
          </p>

          <h2
            className="font-display text-4xl md:text-5xl font-light text-museum-white mb-8 transition-all duration-700 delay-100"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            {GALLERY_CONFIG.artistName}
          </h2>

          <div className="space-y-4">
            {bioLines.map((line, i) => (
              <p
                key={i}
                className="text-museum-white/60 text-sm leading-relaxed font-body transition-all duration-500"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(16px)',
                  transitionDelay: `${200 + i * 120}ms`,
                }}
              >
                {line.trim()}.
              </p>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-10 pt-8 border-t" style={{ borderColor: 'hsla(var(--museum-gold), 0.2)' }}>
            {GALLERY_CONFIG.artistStats.map((stat, i) => (
              <div
                key={stat.label}
                className="transition-all duration-500"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(16px)',
                  transitionDelay: `${600 + i * 100}ms`,
                }}
              >
                <p className="text-museum-gold text-3xl font-display">{stat.value}</p>
                <p className="font-ui text-[10px] tracking-[0.25em] uppercase text-museum-white/40 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quote */}
      <div
        className="max-w-3xl mx-auto mt-20 text-center transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transitionDelay: '900ms',
        }}
      >
        <p className="font-display text-2xl md:text-3xl italic font-light text-museum-white/80 leading-relaxed">
          {GALLERY_CONFIG.artistQuote}
        </p>
      </div>

      {/* Bottom divider */}
      <div className="max-w-5xl mx-auto mt-16">
        <div className="h-px w-full" style={{ background: 'hsla(var(--museum-gold), 0.4)' }} />
      </div>
    </section>
  );
}
