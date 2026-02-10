

# 3D Digital Museum — Phase 1 (Minimal Core)

## Overview
Build the foundational 3D museum experience: an entrance hall, a short corridor with one alcove, and a click-to-zoom case study transition. This establishes the cinematic camera movement, PBR lighting, and interaction patterns that the full 8-alcove build will replicate.

---

## 1. Entrance Hall (Hero Foyer)
- A small 3D room with a floor plane, two pillars/arch, and a soft environment skybox
- A centerpiece placeholder sculpture (procedural geometry — e.g., a torus knot or abstract shape) with PBR materials (roughness, metalness, normal variation)
- Gallery-style lighting: warm key light, cool rim light, ambient fill
- Contact shadows beneath the sculpture, subtle SSAO via post-processing
- DOM overlay: museum title in large serif type + two glass-style CTA buttons ("Enter Gallery" / "Book Viewing") with subtle magnetic pointer-follow effect

## 2. Corridor with One Alcove
- A corridor modeled as simple geometry (walls, floor, ceiling) extending from the foyer
- Camera movement along a spline path, driven by scroll on desktop
- One alcove containing a 3D framed artwork: a textured image plane inside a brass/wood PBR frame mesh with slight bevel depth
- As camera approaches the alcove: wall light brightens, subtle vignette tightens — animated over ~0.4s
- Gentle scroll snap to the alcove position

## 3. Artwork Interaction
- **Hover**: subtle parallax between image and frame layers, soft spotlight follows cursor, slight tilt (2–3°)
- **Click → Zoom**: camera follows a spline toward the frame over ~2s with easing. A small particle burst (~60 pooled particles) in colors derived from the artwork
- The frame transitions into a full case study view — a DOM-overlay panel with: hero image, title, role, challenge, solution, outcomes, and 2 KPIs (all placeholder content)
- **Back** button smoothly reverses the camera spline

## 4. Visual Design System
- Color palette: deep charcoal, museum off-white, warm brass accents — no neon
- Natural materials throughout: brushed metal frames, matte canvas textures, wood accents
- Typography: small-caps for captions/labels, high-contrast serif headings, clean sans body text — mimicking museum plaques

## 5. Performance & Responsive Fallbacks
- Lazy-load 3D scene; show a loading indicator while assets prepare
- On mobile: skip 3D entirely, show a static hero image with the museum title and a DOM-based project card that opens the case study content
- Respect `prefers-reduced-motion`: replace camera flights with simple crossfades
- Keep post-processing minimal: SSAO + vignette only, no bloom by default

## 6. Accessibility & Keyboard Navigation
- Arrow keys to move along corridor, Enter to zoom into artwork, Escape to exit case study
- ARIA labels on interactive elements
- All case study content in standard DOM (screen-reader accessible)

## 7. State Management
- Zustand store tracking: current camera position on spline, active artwork/case study, performance tier (high/low/mobile), reduced-motion preference

---

## What This Sets Up for Future Phases
- Phase 2: Replicate to 8 alcoves with scroll navigation + MDX content files
- Phase 3: Polish — audio opt-in, advanced particle effects, full LOD system, performance tuning

