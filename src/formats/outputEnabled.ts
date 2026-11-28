import { AnimationsSpec, Phase, Still } from '../specification'

/** Whether a phase or still is output when rendering. */
export function isOutputEnabled(output: Phase | Still) {
  return output.enabled !== false
}

/** Whether the animation as a whole is output. Unless set, only for templates without phases, as it was before. */
export function isFullOutputEnabled(animations: AnimationsSpec) {
  return animations.full ?? animations.phases.length === 0
}
