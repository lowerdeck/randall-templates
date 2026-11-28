import { AnimationsSpec, Phase, Still } from '../specification'
import { isAnimated } from './isAnimated'
import { OutputFormat } from './OutputFormat'
import { isFullOutputEnabled, isOutputEnabled } from './outputEnabled'

/**
 * What a template outputs. An animated template outputs a video per phase, in the phase's own format or the video
 * format, and a template without animations a single image. Stills are output in their own format or the image format.
 * Each output says whether it's enabled.
 */
export function templateOutputs(animations: AnimationsSpec, defaults: OutputDefaults): TemplateOutputs {
  const stills = (animations.stills ?? []).map(still => ({
    still,
    format:  stillFormat(still) ?? defaults.image,
    enabled: isOutputEnabled(still),
  }))
  const full = isFullOutputEnabled(animations)

  if (!isAnimated(animations)) {
    return {main: defaults.image, full, phases: [], stills}
  }

  const phases = animations.phases.map(phase => ({
    phase,
    format:  phaseFormat(phase) ?? defaults.video,
    enabled: isOutputEnabled(phase),
  }))
  return {main: defaults.video, full, phases, stills}
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
  /** Whether the template as a whole is output. */
  full:   boolean
  phases: Array<{phase: Phase, format: OutputFormat, enabled: boolean}>
  stills: Array<{still: Still, format: OutputFormat, enabled: boolean}>
}
