import { Phase } from '../specification'
import { minPhaseFrames } from './minPhaseFrames'

export function tooShortPhases(phases: Phase[], fps: number): Phase[] {
  return phases.filter(phase => phase.to - phase.from < minPhaseFrames(fps))
}
