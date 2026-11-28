import { OutputFiletype } from './OutputFiletype'

/** The video encoders (`ffmpeg -encoders`) the renderer supports, with the containers they fit in, the first being the default. */
export const videoCodecs: VideoCodec[] = [
  {id: 'prores', name: 'Apple ProRes 4444', category: 'editing', containers: [OutputFiletype.QuickTime], alpha: true, lossless: false},
  {id: 'qtrle', name: 'QuickTime Animation', category: 'editing', containers: [OutputFiletype.QuickTime], alpha: true, lossless: true},
  {id: 'png', name: 'PNG', category: 'editing', containers: [OutputFiletype.QuickTime, OutputFiletype.Matroska], alpha: true, lossless: true},
  {id: 'ffv1', name: 'FFV1', category: 'editing', containers: [OutputFiletype.Matroska], alpha: true, lossless: true},
  {id: 'utvideo', name: 'Ut Video', category: 'editing', containers: [OutputFiletype.Matroska], alpha: true, lossless: true},

  {id: 'libx264', name: 'H.264', category: 'delivery', containers: [OutputFiletype.MP4, OutputFiletype.QuickTime, OutputFiletype.Matroska], alpha: false, lossless: false},
  {id: 'libx265', name: 'H.265 / HEVC', category: 'delivery', containers: [OutputFiletype.MP4, OutputFiletype.QuickTime, OutputFiletype.Matroska], alpha: false, lossless: false},
  {id: 'libsvtav1', name: 'AV1', category: 'delivery', containers: [OutputFiletype.MP4, OutputFiletype.WebM, OutputFiletype.Matroska], alpha: false, lossless: false},
  {id: 'libvpx-vp9', name: 'VP9', category: 'delivery', containers: [OutputFiletype.WebM, OutputFiletype.Matroska], alpha: true, lossless: false},
  {id: 'libvpx', name: 'VP8', category: 'delivery', containers: [OutputFiletype.WebM, OutputFiletype.Matroska], alpha: true, lossless: false},
]

export function videoCodec(id: string): VideoCodec | null {
  return videoCodecs.find(it => it.id === id) ?? null
}

export function defaultVideoCodec(container: OutputFiletype): string {
  return DEFAULT_CODECS[container] ?? 'prores'
}

export interface VideoCodec {
  id:         string
  name:       string
  category:   VideoCodecCategory
  containers: OutputFiletype[]
  alpha:      boolean
  lossless:   boolean
}

export type VideoCodecCategory = 'editing' | 'delivery'

const DEFAULT_CODECS: Partial<Record<OutputFiletype, string>> = {
  [OutputFiletype.QuickTime]: 'prores',
  [OutputFiletype.MP4]:       'libx264',
  [OutputFiletype.WebM]:      'libvpx-vp9',
  [OutputFiletype.Matroska]:  'ffv1',
}
