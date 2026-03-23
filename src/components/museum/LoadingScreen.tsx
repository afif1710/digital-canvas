import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const TITLE = 'THE GALLERY';
const SUBTITLE = 'A DIGITAL EXHIBITION';
const MIN_DURATION = 1800;
const LETTER_DELAY = 0.06;

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, Math.round((elapsed / MIN_DURATION) * 100));
      setProgress(p);
      if (p >= 100) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Show subtitle after all letters have appeared
  useEffect(() => {
    const delay = TITLE.length * LETTER_DELAY * 1000 + 400;
    const t = setTimeout(() => setShowSubtitle(true), delay);
    return () => clearTimeout(t);
  }, []);

  // Start exit after min duration
  useEffect(() => {
    const t = setTimeout(() => setExiting(true), MIN_DURATION + 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: 'hsl(var(--museum-bg))' }}
        >
          {/* Staggered title letters */}
          <div className="flex justify-center mb-4" aria-label="The Gallery">
            {TITLE.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * LETTER_DELAY, ease: 'easeOut' }}
                className="font-display text-[6vw] font-light tracking-tight text-museum-white"
                style={{ display: 'inline-block', minWidth: char === ' ' ? '0.3em' : undefined }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: showSubtitle ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            className="font-ui text-[10px] tracking-[0.3em] uppercase text-museum-text-secondary mb-16"
          >
            {SUBTITLE}
          </motion.p>

          {/* Progress bar */}
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-48 flex flex-col items-center gap-3">
            <div className="w-full h-px bg-museum-white/10 overflow-hidden rounded-full">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'hsl(var(--museum-gold))' }}
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <span className="font-ui text-[9px] tracking-[0.25em] text-museum-text-secondary tabular-nums">
              {progress}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
