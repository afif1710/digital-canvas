import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-museum-bg"
    >
      <div className="text-center">
        <div className="w-8 h-8 border border-museum-white/15 border-t-museum-brass rounded-full animate-spin mx-auto mb-5" />
        <p className="text-museum-white/35 text-[10px] tracking-[0.35em] uppercase">
          Loading Exhibition
        </p>
      </div>
    </motion.div>
  );
}
