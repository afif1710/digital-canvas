

# Fix: Enter Gallery Glide + Room Navigation

## Root Cause Analysis

The "Enter Gallery" glide and room navigation dots are **both broken by the same bug**: the scroll event handler in `Index.tsx` immediately interrupts any active glide.

Here is the sequence of events when the user clicks "Enter Gallery":

1. `enterGallery()` sets `cameraState: 'corridor'` and `glideActive: true`
2. The page height changes from `100vh` to `1200vh` (because of the corridor state)
3. This height change triggers the browser's `scroll` event
4. The scroll handler (line 62-64 in Index.tsx) sees `glideActive === true` and calls `stopGlide()` -- thinking the user scrolled manually
5. The glide ends immediately, camera stalls wherever it was

The same bug affects the **RoomNav** dots: `CameraController` calls `window.scrollTo()` to sync scroll position during a glide, which triggers the scroll handler, which calls `stopGlide()`.

## Fix (3 files, small changes)

### 1. Add a `programmaticScroll` flag to the store

In `museumStore.ts`, add a boolean `_programmaticScroll` that the glide system sets before calling `window.scrollTo`. The scroll handler checks this flag and skips the "interrupt glide" logic when it is true.

### 2. Update scroll handler in `Index.tsx`

Instead of always calling `stopGlide()` when a scroll event fires during glide, check the `_programmaticScroll` flag first. Only interrupt the glide for genuine user scrolls (wheel/touch).

### 3. Update `CameraController.tsx` glide scroll sync

Before the `window.scrollTo()` call inside the glide block, set `_programmaticScroll = true`. After the call, reset it. This prevents the scroll handler from killing the glide.

## Technical Details

**museumStore.ts changes:**
- Add `_programmaticScroll: boolean` (default `false`)
- Add `setProgrammaticScroll(v: boolean)` action

**Index.tsx scroll handler change (lines 61-65):**
```
// Before (broken):
if (useMuseumStore.getState().glideActive) {
  useMuseumStore.getState().stopGlide();
}

// After (fixed):
if (useMuseumStore.getState().glideActive) {
  if (useMuseumStore.getState()._programmaticScroll) return;
  useMuseumStore.getState().stopGlide();
}
```

**CameraController.tsx glide sync (lines 68-72):**
```
// Before:
window.scrollTo({ top: p * max, behavior: 'auto' });

// After:
store.setProgrammaticScroll(true);
window.scrollTo({ top: p * max, behavior: 'auto' });
requestAnimationFrame(() => store.setProgrammaticScroll(false));
```

## Scope

- 3 files modified, approximately 10 lines changed total
- No new dependencies, no visual changes, no new components
- Fixes both Enter Gallery stall and RoomNav dot navigation

