import { Phase, PhaseType } from '../specification'

/**
 * The fewest frames a phase may span. A stable phase is held or looped by playout systems, which choke on very short
 * clips (Cuez won't transcode one under half a second).
 */
export function minPhaseFrames(phase: Pick<Phase, 'type'>, fps: number): number {
  if (phase.type !== PhaseType.Stable) { return 1 }
  return Math.ceil(MIN_STABLE_PHASE_SECONDS * fps)
}

export const MIN_STABLE_PHASE_SECONDS = 0.5
