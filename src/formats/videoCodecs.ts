import { OutputFiletype } from './OutputFiletype'

/** The video encoders (`ffmpeg -encoders`) the renderer supports, with the containers they fit in, the first being the default. */
export const videoCodecs: VideoCodec[] = [
  {id: 'prores', name: 'Apple ProRes 4444', containers: [OutputFiletype.QuickTime], alpha: true, lossless: false},
  {id: 'qtrle', name: 'QuickTime Animation', containers: [OutputFiletype.QuickTime], alpha: true, lossless: true},
  {id: 'png', name: 'PNG', containers: [OutputFiletype.QuickTime, OutputFiletype.Matroska], alpha: true, lossless: true},
  {id: 'ffv1', name: 'FFV1', containers: [OutputFiletype.Matroska], alpha: true, lossless: true},
  {id: 'utvideo', name: 'Ut Video', containers: [OutputFiletype.Matroska], alpha: true, lossless: true},
  {id: 'libx264', name: 'H.264', containers: [OutputFiletype.MP4, OutputFiletype.QuickTime, OutputFiletype.Matroska], alpha: false, lossless: false},
  {id: 'libx265', name: 'H.265 / HEVC', containers: [OutputFiletype.MP4, OutputFiletype.QuickTime, OutputFiletype.Matroska], alpha: false, lossless: false},
  {id: 'libsvtav1', name: 'AV1', containers: [OutputFiletype.MP4, OutputFiletype.WebM, OutputFiletype.Matroska], alpha: false, lossless: false},
  {id: 'libvpx-vp9', name: 'VP9', containers: [OutputFiletype.WebM, OutputFiletype.Matroska], alpha: true, lossless: false},
  {id: 'libvpx', name: 'VP8', containers: [OutputFiletype.WebM, OutputFiletype.Matroska], alpha: true, lossless: false},
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
  containers: OutputFiletype[]
  alpha:      boolean
  lossless:   boolean
}

const DEFAULT_CODECS: Partial<Record<OutputFiletype, string>> = {
  [OutputFiletype.QuickTime]: 'prores',
  [OutputFiletype.MP4]:       'libx264',
  [OutputFiletype.WebM]:      'libvpx-vp9',
  [OutputFiletype.Matroska]:  'ffv1',
}
