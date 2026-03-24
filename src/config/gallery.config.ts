// CLIENT: Update gallery branding and links here
export const GALLERY_CONFIG = {
  name: "THE GALLERY",
  tagline: "A DIGITAL EXHIBITION",
  accentColor: "#C9A84C",
  artistName: "Alexandra Chen",
  artistDisciplines: ["Visual Identity", "Art Direction", "Brand Strategy"],
  artistBio:
    "With over a decade of experience bridging fine art and commercial design, Alexandra creates visual narratives that transcend traditional boundaries. Her work has been featured in galleries across three continents and recognized by the Art Directors Club, D&AD, and Communication Arts.",
  artistQuote:
    '"Every brand has a soul. My work is about making it visible."',
  artistStats: [
    { label: "Exhibitions", value: "47" },
    { label: "Years Active", value: "12" },
    { label: "Commissions", value: "200+" },
  ],
  socialLinks: {
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
    behance: "https://behance.net",
  },
  // CLIENT: Drop in a Calendly or booking URL here to enable external booking
  bookingUrl: "",
  // AMBIENT SOUND: drop .mp3 into /public/audio/gallery-ambient.mp3 to enable
  ambientSoundUrl: "",
};

export const CATEGORIES = [
  "All",
  "Branding",
  "Photography",
  "Digital",
  "UI/UX",
  "Packaging",
] as const;

export type Category = (typeof CATEGORIES)[number];
