/**
 * The fewest frames a phase may span. Each phase is output as a separate clip, and playout systems choke on very
 * short ones (Cuez won't transcode a clip under half a second).
 */
export function minPhaseFrames(fps: number): number {
  return Math.ceil(MIN_PHASE_SECONDS * fps)
}

export const MIN_PHASE_SECONDS = 0.5
