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
  enterGallery: () => void;
  setCorridorProgress: (p: number) => void;
  zoomToArtwork: (id: string, index: number) => void;
  exitCaseStudy: () => void;
  setIsLoaded: (v: boolean) => void;
  setIsMobile: (v: boolean) => void;
  setReducedMotion: (v: boolean) => void;
  setShowBooking: (v: boolean) => void;
  toggleShowcaseLighting: () => void;
}

export const useMuseumStore = create<MuseumStore>((set) => ({
  cameraState: 'entrance',
  corridorProgress: 0,
  activeArtwork: null,
  activeArtworkIndex: 0,
  showCaseStudy: false,
  showBooking: false,
  showcaseLighting: false,
  isLoaded: false,
  isMobile: false,
  reducedMotion: false,
  enterGallery: () => set({ cameraState: 'corridor' }),
  setCorridorProgress: (corridorProgress) => set({ corridorProgress }),
  zoomToArtwork: (id, index) => set({ cameraState: 'zoomed', activeArtwork: id, activeArtworkIndex: index, showCaseStudy: true }),
  exitCaseStudy: () => set({ cameraState: 'corridor', activeArtwork: null, showCaseStudy: false }),
  setIsLoaded: (isLoaded) => set({ isLoaded }),
  setIsMobile: (isMobile) => set({ isMobile }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setShowBooking: (showBooking) => set({ showBooking }),
  toggleShowcaseLighting: () => set((s) => ({ showcaseLighting: !s.showcaseLighting })),
}));
