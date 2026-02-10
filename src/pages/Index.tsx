import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence } from 'framer-motion';
import { useMuseumStore } from '@/store/museumStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { HeroOverlay } from '@/components/museum/HeroOverlay';
import { CaseStudyPanel } from '@/components/museum/CaseStudyPanel';
import { LoadingScreen } from '@/components/museum/LoadingScreen';
import { MobileFallback } from '@/components/museum/MobileFallback';
import MuseumScene from '@/components/museum/MuseumScene';

const Index = () => {
  const isMobile = useIsMobile();
  const cameraState = useMuseumStore((s) => s.cameraState);
  const showCaseStudy = useMuseumStore((s) => s.showCaseStudy);
  const isLoaded = useMuseumStore((s) => s.isLoaded);
  const corridorProgress = useMuseumStore((s) => s.corridorProgress);
  const setCorridorProgress = useMuseumStore((s) => s.setCorridorProgress);
  const setIsMobile = useMuseumStore((s) => s.setIsMobile);
  const setReducedMotion = useMuseumStore((s) => s.setReducedMotion);
  const zoomToArtwork = useMuseumStore((s) => s.zoomToArtwork);
  const exitCaseStudy = useMuseumStore((s) => s.exitCaseStudy);
  const enterGallery = useMuseumStore((s) => s.enterGallery);

  // Sync mobile detection
  useEffect(() => {
    setIsMobile(isMobile);
  }, [isMobile, setIsMobile]);

  // Detect reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [setReducedMotion]);

  // Scroll → corridor camera progress
  useEffect(() => {
    if (cameraState !== 'corridor') return;
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      setCorridorProgress(Math.min(1, Math.max(0, window.scrollY / max)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [cameraState, setCorridorProgress]);

  // Lock body scroll when not in corridor mode
  useEffect(() => {
    if (cameraState !== 'corridor' || showCaseStudy) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [cameraState, showCaseStudy]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showCaseStudy) {
        exitCaseStudy();
        return;
      }
      if (e.key === 'Enter' && cameraState === 'entrance') {
        enterGallery();
        return;
      }
      if (e.key === 'Enter' && cameraState === 'corridor' && Math.abs(corridorProgress - 0.6) < 0.15) {
        zoomToArtwork('project-01');
        return;
      }
      if (cameraState === 'corridor' && !showCaseStudy) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          window.scrollBy(0, 120);
        }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          window.scrollBy(0, -120);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [cameraState, showCaseStudy, corridorProgress, exitCaseStudy, enterGallery, zoomToArtwork]);

  if (isMobile) return <MobileFallback />;

  return (
    <div
      className="relative"
      style={{
        height: cameraState === 'corridor' ? '400vh' : '100vh',
        background: 'hsl(0 0% 4%)',
      }}
    >
      <AnimatePresence>{!isLoaded && <LoadingScreen />}</AnimatePresence>

      <div className="fixed inset-0">
        <Canvas
          shadows
          camera={{ fov: 50, near: 0.1, far: 100, position: [0, 1.6, 5] }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <MuseumScene />
          </Suspense>
        </Canvas>
      </div>

      <AnimatePresence>{cameraState === 'entrance' && isLoaded && <HeroOverlay />}</AnimatePresence>

      <AnimatePresence>{showCaseStudy && <CaseStudyPanel />}</AnimatePresence>

      {/* Scroll hint */}
      {cameraState === 'corridor' && !showCaseStudy && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10 text-museum-white/25 text-[10px] tracking-[0.35em] uppercase animate-pulse pointer-events-none">
          Scroll to explore
        </div>
      )}
    </div>
  );
};

export default Index;
