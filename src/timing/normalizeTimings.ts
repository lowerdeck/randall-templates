import { AnimationsSpec } from '../specification'
import { parseTiming } from './parseTiming'

/** Brings the keyframe timings of animations that come from storage into their canonical form. */
export function normalizeTimings(animations: AnimationsSpec): AnimationsSpec {
  return {
    ...animations,
    tracks: animations.tracks.map(track => ({
      ...track,
      keyframes: track.keyframes.map(keyframe => ({
        ...keyframe,
        timing: parseTiming(keyframe.timing) ?? keyframe.timing,
      })),
    })),
  }
}
