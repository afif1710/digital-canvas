import { create } from 'zustand';

export type CameraState = 'entrance' | 'corridor' | 'zoomed';

interface MuseumStore {
  cameraState: CameraState;
  corridorProgress: number;
  activeArtwork: string | null;
  showCaseStudy: boolean;
  isLoaded: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
  enterGallery: () => void;
  setCorridorProgress: (p: number) => void;
  zoomToArtwork: (id: string) => void;
  exitCaseStudy: () => void;
  setIsLoaded: (v: boolean) => void;
  setIsMobile: (v: boolean) => void;
  setReducedMotion: (v: boolean) => void;
}

export const useMuseumStore = create<MuseumStore>((set) => ({
  cameraState: 'entrance',
  corridorProgress: 0,
  activeArtwork: null,
  showCaseStudy: false,
  isLoaded: false,
  isMobile: false,
  reducedMotion: false,
  enterGallery: () => set({ cameraState: 'corridor' }),
  setCorridorProgress: (corridorProgress) => set({ corridorProgress }),
  zoomToArtwork: (id) => set({ cameraState: 'zoomed', activeArtwork: id, showCaseStudy: true }),
  exitCaseStudy: () => set({ cameraState: 'corridor', activeArtwork: null, showCaseStudy: false }),
  setIsLoaded: (isLoaded) => set({ isLoaded }),
  setIsMobile: (isMobile) => set({ isMobile }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}));
