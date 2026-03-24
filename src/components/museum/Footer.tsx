import { GALLERY_CONFIG } from '@/config/gallery.config';

const socialIcons: Record<string, string> = {
  instagram: 'M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 2 .2 2.7.5.7.3 1.3.6 1.9 1.2.6.6 1 1.2 1.2 1.9.3.7.5 1.5.5 2.7.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 2-.5 2.7-.3.7-.6 1.3-1.2 1.9-.6.6-1.2 1-1.9 1.2-.7.3-1.5.5-2.7.5-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-2-.2-2.7-.5-.7-.3-1.3-.6-1.9-1.2-.6-.6-1-1.2-1.2-1.9-.3-.7-.5-1.5-.5-2.7C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-2 .5-2.7.3-.7.6-1.3 1.2-1.9.6-.6 1.2-1 1.9-1.2.7-.3 1.5-.5 2.7-.5C9.6 2.2 10 2.2 12 2.2zm0 2.1c-3.1 0-3.5 0-4.7.1-1.1 0-1.7.2-2.1.4-.5.2-.9.5-1.3.9-.4.4-.7.8-.9 1.3-.2.4-.4 1-.4 2.1-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c0 1.1.2 1.7.4 2.1.2.5.5.9.9 1.3.4.4.8.7 1.3.9.4.2 1 .4 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1 0 1.7-.2 2.1-.4.5-.2.9-.5 1.3-.9.4-.4.7-.8.9-1.3.2-.4.4-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c0-1.1-.2-1.7-.4-2.1-.2-.5-.5-.9-.9-1.3-.4-.4-.8-.7-1.3-.9-.4-.2-1-.4-2.1-.4-1.2-.1-1.6-.1-4.7-.1zm0 3.6a5.1 5.1 0 110 10.2 5.1 5.1 0 010-10.2zm0 8.4a3.3 3.3 0 100-6.6 3.3 3.3 0 000 6.6zm6.5-8.6a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z',
  linkedin: 'M20.4 2H3.6A1.6 1.6 0 002 3.6v16.8A1.6 1.6 0 003.6 22h16.8a1.6 1.6 0 001.6-1.6V3.6A1.6 1.6 0 0020.4 2zM8.3 18.3H5.7V9.7h2.6v8.6zM7 8.6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm11.3 9.7h-2.6v-4.2c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2v4.3h-2.6V9.7h2.5v1.2h0a2.8 2.8 0 012.5-1.4c2.7 0 3.2 1.8 3.2 4v4.8z',
  twitter: 'M18.2 5.3a4.5 4.5 0 01-1.3.4A2.3 2.3 0 0015.3 5a2.3 2.3 0 00-2.3 2.3v.5A6.5 6.5 0 015.5 5.8s-3.5 8 4.5 11.5a7.1 7.1 0 01-5.3 1.5c8 4.5 17.5 0 17.5-10a2.3 2.3 0 000-.4 4.6 4.6 0 001.2-1.2 4.5 4.5 0 01-1.3.4 2.3 2.3 0 001-1.3 4.5 4.5 0 01-1.5.5z',
  behance: 'M22 7h-7v1.5h7V7zm-3.5 4.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm0 5.6a2.1 2.1 0 110-4.2 2.1 2.1 0 010 4.2zM9 11.5c0-1.5-1.2-2.5-3-2.5H2v9h4c1.9 0 3.3-1.1 3.3-2.8 0-1.1-.6-2-1.5-2.4.7-.4 1.2-1.2 1.2-2.3zm-4.5-.5h1.3c.6 0 1 .4 1 1s-.4 1-1 1H4.5V11zm1.5 6H4.5v-2.5H6c.8 0 1.3.5 1.3 1.2 0 .8-.5 1.3-1.3 1.3z',
};

export function GalleryFooter() {
  return (
    <footer
      className="relative py-16 px-6 border-t"
      style={{
        background: 'hsl(var(--museum-bg))',
        borderColor: 'hsla(var(--museum-gold), 0.15)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left: name + tagline */}
          <div className="text-center md:text-left">
            <p className="font-display text-lg text-museum-white">{GALLERY_CONFIG.name}</p>
            <p className="font-ui text-[9px] tracking-[0.3em] uppercase text-museum-white/30 mt-1">
              {GALLERY_CONFIG.tagline}
            </p>
          </div>

          {/* Center: social icons */}
          <div className="flex items-center gap-5">
            {Object.entries(GALLERY_CONFIG.socialLinks).map(([platform, url]) => {
              const path = socialIcons[platform];
              if (!url || !path) return null;
              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  aria-label={platform}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-museum-white/30 group-hover:text-museum-gold group-hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <path d={path} />
                  </svg>
                </a>
              );
            })}
          </div>

          {/* Right: badge */}
          <div
            className="px-4 py-1.5 rounded-full font-ui text-[9px] tracking-[0.2em] uppercase"
            style={{
              border: '1px solid hsla(var(--museum-gold), 0.3)',
              color: 'hsl(var(--museum-gold))',
            }}
          >
            Available for Commissions
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-2" style={{ borderColor: 'hsla(var(--museum-white), 0.05)' }}>
          <p className="font-ui text-[10px] text-museum-text-secondary">
            © {new Date().getFullYear()} {GALLERY_CONFIG.name}. All rights reserved.
          </p>
          <p className="font-ui text-[10px] text-museum-text-secondary/50">
            Built with intention
          </p>
        </div>
      </div>
    </footer>
  );
}
