export enum OutputFiletype {
  PNG = 'png',
  JPEG = 'jpeg',
  WebP = 'webp',
  AVIF = 'avif',
  QuickTime = 'mov',
  MP4 = 'mp4',
  WebM = 'webm',
  Matroska = 'mkv',
}

export type OutputKind = 'image' | 'video'

export function outputFiletypeKind(fileType: OutputFiletype): OutputKind {
  return IMAGE_FILETYPES.includes(fileType) ? 'image' : 'video'
}

export const IMAGE_FILETYPES = [OutputFiletype.PNG, OutputFiletype.JPEG, OutputFiletype.WebP, OutputFiletype.AVIF]
export const VIDEO_FILETYPES = [OutputFiletype.QuickTime, OutputFiletype.MP4, OutputFiletype.WebM, OutputFiletype.Matroska]
