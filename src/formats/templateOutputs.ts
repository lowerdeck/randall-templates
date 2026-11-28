import { AnimationsSpec, Phase, Still } from '../specification'
import { isAnimated } from './isAnimated'
import { OutputFormat } from './OutputFormat'

/**
 * What a template outputs. An animated template outputs a video per phase, in the phase's own format or the video
 * format, and a template without animations a single image. Stills are output in their own format or the image format.
 */
export function templateOutputs(animations: AnimationsSpec, defaults: OutputDefaults): TemplateOutputs {
  const stills = (animations.stills ?? []).map(still => ({
    still,
    format: stillFormat(still) ?? defaults.image,
  }))

  if (!isAnimated(animations)) {
    return {main: defaults.image, phases: [], stills}
  }

  const phases = animations.phases.map(phase => ({
    phase,
    format: phaseFormat(phase) ?? defaults.video,
  }))
  return {main: defaults.video, phases, stills}
}

/** The phase's own format, ignoring one that's not a video format. */
export function phaseFormat(phase: Phase): OutputFormat | null {
  const format = phase.format == null ? null : OutputFormat.tryParse(phase.format)
  return format?.isVideo ? format : null
}

/** The still's own format, ignoring one that's not an image format. */
export function stillFormat(still: Still): OutputFormat | null {
  const format = still.format == null ? null : OutputFormat.tryParse(still.format)
  return format?.isImage ? format : null
}

export interface OutputDefaults {
  image: OutputFormat
  video: OutputFormat
}

export interface TemplateOutputs {
  /** The format of the template as a whole: that of a template without phases, or of a preview. */
  main:   OutputFormat
  phases: Array<{phase: Phase, format: OutputFormat}>
  stills: Array<{still: Still, format: OutputFormat}>
}
