import { useMuseumStore } from '@/store/museumStore';
import { PROJECTS } from '@/data/projects';
import { motion } from 'framer-motion';

export function CaseStudyPanel() {
  const exitCaseStudy = useMuseumStore((s) => s.exitCaseStudy);
  const activeArtworkIndex = useMuseumStore((s) => s.activeArtworkIndex);
  const project = PROJECTS[activeArtworkIndex];

  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 1.2 }}
      className="fixed inset-0 z-20 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-museum-bg/70 backdrop-blur-sm" />
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="relative z-10 max-w-2xl w-full mx-4 p-8 md:p-10 bg-museum-charcoal/90 border border-museum-white/10 backdrop-blur-md overflow-y-auto max-h-[90vh]"
      >
        <button
          onClick={exitCaseStudy}
          className="absolute top-4 right-5 text-museum-white/40 hover:text-museum-white text-xs tracking-[0.2em] uppercase transition-colors"
          aria-label="Close case study"
        >
          ✕ Close
        </button>

        {/* Hero image */}
        <div className="w-full h-48 bg-museum-wall mb-6 overflow-hidden">
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        <p className="text-museum-brass text-[10px] tracking-[0.35em] uppercase mb-2">
          {project.role}
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-museum-white mb-6">
          {project.title}
        </h2>

        <div className="space-y-5 text-museum-white/65 text-sm leading-relaxed">
          <Section title="Challenge">{project.challenge}</Section>
          <Section title="Solution">{project.solution}</Section>
          <Section title="Outcomes">{project.outcomes}</Section>
        </div>

        <div className="flex gap-10 mt-8 pt-6 border-t border-museum-white/10">
          {project.kpis.map((kpi) => (
            <div key={kpi.label}>
              <p className="text-museum-brass text-3xl font-serif">{kpi.value}</p>
              <p className="text-museum-white/40 text-[10px] tracking-[0.25em] uppercase mt-1">
                {kpi.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-museum-white text-[10px] tracking-[0.25em] uppercase mb-1.5">{title}</h3>
      <p>{children}</p>
    </div>
  );
}
