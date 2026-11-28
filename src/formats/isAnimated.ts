import { AnimationsSpec } from '../specification'

/** Whether the template outputs videos rather than a single image. */
export function isAnimated(animations: AnimationsSpec) {
  return animations.tracks.length > 0 || (animations.widget_tracks?.length ?? 0) > 0
}
