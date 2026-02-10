import { useState } from 'react';

const PROJECT = {
  title: 'Meridian Rebrand',
  role: 'Lead Designer & Art Director',
  challenge:
    'Meridian, a luxury watchmaker, needed a complete brand overhaul to appeal to a younger demographic while maintaining its heritage appeal.',
  solution:
    'We developed a visual identity that bridges classic craftsmanship with contemporary minimalism, using a refined color palette and bespoke typography.',
  outcomes:
    'The rebrand led to a 40% increase in brand awareness among 25–35 year-olds and a 28% uplift in direct-to-consumer sales within 6 months.',
  kpis: [
    { label: 'Brand Awareness', value: '+40%' },
    { label: 'DTC Sales', value: '+28%' },
  ],
};

export function MobileFallback() {
  const [showCase, setShowCase] = useState(false);

  return (
    <div className="min-h-screen bg-museum-bg text-museum-white">
      {/* Hero */}
      <div className="flex items-center justify-center min-h-[55vh] px-6">
        <div className="text-center">
          <h1 className="font-serif text-5xl tracking-tight mb-3">THE GALLERY</h1>
          <p className="text-museum-white/40 text-[10px] tracking-[0.35em] uppercase">
            A Digital Exhibition
          </p>
        </div>
      </div>

      {/* Project card */}
      <div className="px-5 pb-12">
        <button
          onClick={() => setShowCase(true)}
          className="w-full text-left border border-museum-white/10 p-5 hover:border-museum-brass/30 transition-colors"
          aria-label="View Meridian Rebrand case study"
        >
          <div className="w-full h-40 bg-museum-wall mb-4" aria-hidden="true" />
          <p className="text-museum-brass text-[10px] tracking-[0.35em] uppercase mb-1">
            Case Study
          </p>
          <h2 className="font-serif text-2xl">{PROJECT.title}</h2>
        </button>
      </div>

      {/* Case study full page */}
      {showCase && (
        <div className="fixed inset-0 z-50 bg-museum-bg overflow-y-auto">
          <div className="p-6 max-w-lg mx-auto">
            <button
              onClick={() => setShowCase(false)}
              className="text-museum-white/40 text-xs tracking-[0.2em] uppercase mb-8 hover:text-museum-white transition-colors"
            >
              ← Back
            </button>
            <div className="w-full h-48 bg-museum-wall mb-6" aria-hidden="true" />
            <p className="text-museum-brass text-[10px] tracking-[0.35em] uppercase mb-2">
              {PROJECT.role}
            </p>
            <h2 className="font-serif text-3xl mb-6">{PROJECT.title}</h2>
            <div className="space-y-5 text-museum-white/65 text-sm leading-relaxed">
              <div>
                <h3 className="text-museum-white text-[10px] tracking-[0.25em] uppercase mb-1">
                  Challenge
                </h3>
                <p>{PROJECT.challenge}</p>
              </div>
              <div>
                <h3 className="text-museum-white text-[10px] tracking-[0.25em] uppercase mb-1">
                  Solution
                </h3>
                <p>{PROJECT.solution}</p>
              </div>
              <div>
                <h3 className="text-museum-white text-[10px] tracking-[0.25em] uppercase mb-1">
                  Outcomes
                </h3>
                <p>{PROJECT.outcomes}</p>
              </div>
            </div>
            <div className="flex gap-8 mt-8 pt-6 border-t border-museum-white/10">
              {PROJECT.kpis.map((kpi) => (
                <div key={kpi.label}>
                  <p className="text-museum-brass text-3xl font-serif">{kpi.value}</p>
                  <p className="text-museum-white/40 text-[10px] tracking-[0.25em] uppercase mt-1">
                    {kpi.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
