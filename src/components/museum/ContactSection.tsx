import { useState, useRef, useEffect } from 'react';
import { GALLERY_CONFIG } from '@/config/gallery.config';

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setLoading(true);
    // Simulate send — CLIENT: integrate EmailJS or backend here
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-32 px-6"
      style={{ background: 'hsl(var(--museum-bg))' }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2
          className="font-display text-3xl md:text-5xl font-light text-museum-white mb-4 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          Let's Create Something Remarkable
        </h2>
        <p
          className="font-ui text-[10px] tracking-[0.3em] uppercase mb-16 transition-all duration-700 delay-100"
          style={{
            color: 'hsl(var(--museum-gold))',
            opacity: visible ? 1 : 0,
          }}
        >
          Commission · Acquisition · Collaboration
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {[
              { label: 'Name', value: name, set: setName, type: 'text' },
              { label: 'Email', value: email, set: setEmail, type: 'email' },
            ].map((field) => (
              <div key={field.label} className="relative">
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  placeholder={field.label}
                  required
                  className="w-full bg-transparent border-0 border-b border-museum-white/10 text-museum-white font-body text-sm py-3 px-0 focus:outline-none focus:border-museum-gold placeholder:text-museum-white/20 transition-colors"
                />
              </div>
            ))}
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message"
                required
                rows={4}
                className="w-full bg-transparent border-0 border-b border-museum-white/10 text-museum-white font-body text-sm py-3 px-0 focus:outline-none focus:border-museum-gold placeholder:text-museum-white/20 transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 font-ui text-[11px] tracking-[0.2em] uppercase transition-all duration-200 disabled:opacity-50"
              style={{
                background: 'hsl(var(--museum-gold))',
                color: 'hsl(var(--museum-bg))',
              }}
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-museum-bg/30 border-t-museum-bg rounded-full animate-spin" />
              ) : (
                'Send Message'
              )}
            </button>

            {GALLERY_CONFIG.bookingUrl && (
              <a
                href={GALLERY_CONFIG.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center font-ui text-[10px] tracking-[0.2em] uppercase text-museum-gold/60 hover:text-museum-gold mt-4 transition-colors"
              >
                Or Schedule a Viewing →
              </a>
            )}
          </form>
        ) : (
          <div className="py-12">
            {/* Gold checkmark */}
            <svg
              className="mx-auto mb-6"
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
            >
              <circle cx="24" cy="24" r="22" stroke="hsl(var(--museum-gold))" strokeWidth="1.5" opacity="0.4" />
              <path
                d="M14 24L22 32L34 18"
                stroke="hsl(var(--museum-gold))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-[draw_0.6s_ease-out_forwards]"
                style={{
                  strokeDasharray: 40,
                  strokeDashoffset: 0,
                }}
              />
            </svg>
            <p className="font-display text-2xl text-museum-white mb-2">Inquiry Received</p>
            <p className="text-museum-white/40 text-sm font-body">
              We'll be in touch within 48 hours.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
