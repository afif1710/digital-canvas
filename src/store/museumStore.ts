import { create } from 'zustand';

export type CameraState = 'entrance' | 'corridor' | 'zoomed';

interface MuseumStore {
  cameraState: CameraState;
  corridorProgress: number;
  activeArtwork: string | null;
  activeArtworkIndex: number;
  showCaseStudy: boolean;
  showBooking: boolean;
  showcaseLighting: boolean;
  isLoaded: boolean;
  isMobile: boolean;
  reducedMotion: boolean;

  // Auto-glide state
  glideActive: boolean;
  glideStartTime: number;
  glideFrom: number;
  glideTo: number;
  glideDuration: number;

  // Stored progress for case study restore
  storedProgress: number;

  // Particle burst
  particleBurstPosition: [number, number, number] | null;

  enterGallery: () => void;
  setCorridorProgress: (p: number) => void;
  zoomToArtwork: (id: string, index: number) => void;
  exitCaseStudy: () => void;
  setIsLoaded: (v: boolean) => void;
  setIsMobile: (v: boolean) => void;
  setReducedMotion: (v: boolean) => void;
  setShowBooking: (v: boolean) => void;
  toggleShowcaseLighting: () => void;
  startGlide: (from: number, to: number, duration: number) => void;
  stopGlide: () => void;
  triggerParticleBurst: (pos: [number, number, number]) => void;
  clearParticleBurst: () => void;
}

export const useMuseumStore = create<MuseumStore>((set) => ({
  cameraState: 'entrance',
  corridorProgress: 0,
  activeArtwork: null,
  activeArtworkIndex: 0,
  showCaseStudy: false,
  showBooking: false,
  showcaseLighting: true,
  isLoaded: false,
  isMobile: false,
  reducedMotion: false,
  glideActive: false,
  glideStartTime: 0,
  glideFrom: 0,
  glideTo: 0,
  glideDuration: 1.6,
  storedProgress: 0,
  particleBurstPosition: null,

  enterGallery: () => set({
    cameraState: 'corridor',
    glideActive: true,
    glideStartTime: performance.now() / 1000,
    glideFrom: -0.1, // maps to z=8 (entrance position) so camera doesn't stall
    glideTo: -1, // sentinel: will be replaced with first alcove progress
    glideDuration: 2.0,
  }),
  setCorridorProgress: (corridorProgress) => set({ corridorProgress }),
  zoomToArtwork: (id, index) => set((s) => ({
    cameraState: 'zoomed',
    activeArtwork: id,
    activeArtworkIndex: index,
    showCaseStudy: true,
    storedProgress: s.corridorProgress,
  })),
  exitCaseStudy: () => set((s) => ({
    cameraState: 'corridor',
    activeArtwork: null,
    showCaseStudy: false,
    // corridorProgress restored to storedProgress
    corridorProgress: s.storedProgress,
  })),
  setIsLoaded: (isLoaded) => set({ isLoaded }),
  setIsMobile: (isMobile) => set({ isMobile }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setShowBooking: (showBooking) => set({ showBooking }),
  toggleShowcaseLighting: () => set((s) => ({ showcaseLighting: !s.showcaseLighting })),
  startGlide: (from, to, duration) => set({
    glideActive: true,
    glideStartTime: performance.now() / 1000,
    glideFrom: from,
    glideTo: to,
    glideDuration: duration,
  }),
  stopGlide: () => set({ glideActive: false }),
  triggerParticleBurst: (pos) => set({ particleBurstPosition: pos }),
  clearParticleBurst: () => set({ particleBurstPosition: null }),
}));
