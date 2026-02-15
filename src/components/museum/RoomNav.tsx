import { motion } from 'framer-motion';
import { useMuseumStore } from '@/store/museumStore';
import { getAlcoveProgress } from '@/data/projects';

const ROOMS = [
  { label: 'Entrance', progress: 0 },
  { label: 'Alcove 1', progress: getAlcoveProgress(0) },
  { label: 'Alcove 2', progress: getAlcoveProgress(1) },
  { label: 'Room A', progress: getAlcoveProgress(2) },
  { label: 'Alcove 4', progress: getAlcoveProgress(3) },
  { label: 'Alcove 5', progress: getAlcoveProgress(4) },
  { label: 'Room B', progress: getAlcoveProgress(5) },
  { label: 'Alcove 7', progress: getAlcoveProgress(6) },
  { label: 'Alcove 8', progress: getAlcoveProgress(7) },
];

export function RoomNav() {
  const corridorProgress = useMuseumStore((s) => s.corridorProgress);
  const startGlide = useMuseumStore((s) => s.startGlide);
  const glideActive = useMuseumStore((s) => s.glideActive);

  const navigateTo = (progress: number) => {
    if (glideActive) return;
    startGlide(corridorProgress, progress, 1.4);
  };

  // Find nearest room
  let nearestIdx = 0;
  let minDist = Infinity;
  ROOMS.forEach((r, i) => {
    const d = Math.abs(corridorProgress - r.progress);
    if (d < minDist) { minDist = d; nearestIdx = i; }
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-end gap-1"
    >
      {ROOMS.map((room, i) => {
        const isActive = i === nearestIdx && minDist < 0.04;
        const isRoom = room.label.startsWith('Room');
        return (
          <button
            key={room.label}
            onClick={() => navigateTo(room.progress)}
            className={`
              group flex items-center gap-2 transition-all duration-300
              ${isRoom ? 'mr-0' : 'mr-2'}
            `}
          >
            <span className={`
              text-[9px] tracking-[0.2em] uppercase transition-opacity duration-300
              ${isActive ? 'opacity-80' : 'opacity-0 group-hover:opacity-60'}
              ${isRoom ? 'text-amber-400/80' : 'text-white/60'}
            `}>
              {room.label}
            </span>
            <span className={`
              block rounded-full transition-all duration-300
              ${isActive
                ? (isRoom ? 'w-3 h-3 bg-amber-400/70' : 'w-2.5 h-2.5 bg-white/60')
                : (isRoom ? 'w-2 h-2 bg-amber-400/25 group-hover:bg-amber-400/50' : 'w-1.5 h-1.5 bg-white/20 group-hover:bg-white/40')
              }
            `} />
          </button>
        );
      })}
    </motion.div>
  );
}
