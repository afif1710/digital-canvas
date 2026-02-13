import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence } from 'framer-motion';
import { useMuseumStore } from '@/store/museumStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { PROJECTS, getAlcoveProgress } from '@/data/projects';
import { HeroOverlay } from '@/components/museum/HeroOverlay';
import { CaseStudyPanel } from '@/components/museum/CaseStudyPanel';
import { BookingModal } from '@/components/museum/BookingModal';
import { LoadingScreen } from '@/components/museum/LoadingScreen';
import { MobileFallback } from '@/components/museum/MobileFallback';
import MuseumScene from '@/components/museum/MuseumScene';

const SNAP_DEBOUNCE = 150;
const alcoveProgresses = PROJECTS.map((_, i) => getAlcoveProgress(i));

const Index = () => {
  const isMobile = useIsMobile();
  const cameraState = useMuseumStore((s) => s.cameraState);
  const showCaseStudy = useMuseumStore((s) => s.showCaseStudy);
  const showBooking = useMuseumStore((s) => s.showBooking);
  const isLoaded = useMuseumStore((s) => s.isLoaded);
  const corridorProgress = useMuseumStore((s) => s.corridorProgress);
  const setCorridorProgress = useMuseumStore((s) => s.setCorridorProgress);
  const setIsMobile = useMuseumStore((s) => s.setIsMobile);
  const setReducedMotion = useMuseumStore((s) => s.setReducedMotion);
  const zoomToArtwork = useMuseumStore((s) => s.zoomToArtwork);
  const exitCaseStudy = useMuseumStore((s) => s.exitCaseStudy);
  const enterGallery = useMuseumStore((s) => s.enterGallery);
  const glideActive = useMuseumStore((s) => s.glideActive);
  const storedProgress = useMuseumStore((s) => s.storedProgress);

  const snapTimer = useRef<number>(0);

  useEffect(() => { setIsMobile(isMobile); }, [isMobile, setIsMobile]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [setReducedMotion]);

  // When exiting case study, sync scroll to storedProgress
  const prevShowCaseStudy = useRef(showCaseStudy);
  useEffect(() => {
    if (prevShowCaseStudy.current && !showCaseStudy && cameraState === 'corridor') {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0) {
        window.scrollTo({ top: storedProgress * max, behavior: 'auto' });
      }
    }
    prevShowCaseStudy.current = showCaseStudy;
  }, [showCaseStudy, cameraState, storedProgress]);

  // Scroll → corridor progress + snap (ignore during glide)
  useEffect(() => {
    if (cameraState !== 'corridor') return;
    const handleScroll = () => {
      if (useMuseumStore.getState().glideActive) {
        // User scrolled during glide — interrupt it
        useMuseumStore.getState().stopGlide();
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      setCorridorProgress(p);

      clearTimeout(snapTimer.current);
      snapTimer.current = window.setTimeout(() => {
        let nearest = alcoveProgresses[0];
        let minDist = Math.abs(p - nearest);
        for (const ap of alcoveProgresses) {
          const d = Math.abs(p - ap);
          if (d < minDist) { minDist = d; nearest = ap; }
        }
        if (minDist < 0.06 && minDist > 0.005) {
          window.scrollTo({ top: nearest * max, behavior: 'smooth' });
        }
      }, SNAP_DEBOUNCE);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(snapTimer.current);
    };
  }, [cameraState, setCorridorProgress]);

  // Lock body scroll
  useEffect(() => {
    if (cameraState !== 'corridor' || showCaseStudy || showBooking) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [cameraState, showCaseStudy, showBooking]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showCaseStudy) { exitCaseStudy(); return; }
        if (showBooking) { useMuseumStore.getState().setShowBooking(false); return; }
      }
      if (e.key === 'Enter' && cameraState === 'entrance') { enterGallery(); return; }
      if (e.key === 'Enter' && cameraState === 'corridor') {
        let nearestIdx = 0;
        let minDist = Infinity;
        alcoveProgresses.forEach((ap, i) => {
          const d = Math.abs(corridorProgress - ap);
          if (d < minDist) { minDist = d; nearestIdx = i; }
        });
        if (minDist < 0.06) {
          zoomToArtwork(PROJECTS[nearestIdx].id, nearestIdx);
        }
        return;
      }
      if (cameraState === 'corridor' && !showCaseStudy && !showBooking) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); window.scrollBy(0, 200); }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); window.scrollBy(0, -200); }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [cameraState, showCaseStudy, showBooking, corridorProgress, exitCaseStudy, enterGallery, zoomToArtwork]);

  if (isMobile) return (
    <>
      <MobileFallback />
      <BookingModal />
    </>
  );

  return (
    <div
      className="relative"
      style={{
        height: cameraState === 'corridor' ? '1200vh' : '100vh',
        background: 'hsl(var(--museum-bg))',
      }}
    >
      <AnimatePresence>{!isLoaded && <LoadingScreen />}</AnimatePresence>

      <div className="fixed inset-0">
        <Canvas
          shadows
          camera={{ fov: 50, near: 0.1, far: 200, position: [0, 2.2, 8] }}
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
      <BookingModal />

      {/* Scroll hint */}
      {cameraState === 'corridor' && !showCaseStudy && !glideActive && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10 text-museum-white/25 text-[10px] tracking-[0.35em] uppercase animate-pulse pointer-events-none">
          Scroll to explore
        </div>
      )}
    </div>
  );
};

export default Index;
