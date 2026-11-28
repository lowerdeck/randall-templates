import { OutputFiletype, outputFiletypeKind, OutputKind } from './OutputFiletype'
import { defaultVideoCodec, videoCodecContainers } from './videoCodecs'

/**
 * A format to output a phase, still or template in. Serialized as a string, which is understood by the renderer:
 *
 * - `png`
 * - `jpeg(<quality>)`
 * - `webp` (lossless), or `webp(<quality>)`
 * - `avif(<quality>)`
 * - `<codec>.<container>`, like `prores.mov` or `libx264.mp4`
 */
export class OutputFormat {

  private constructor(
    public readonly fileType: OutputFiletype,
    public readonly quality: number | null = null,
    public readonly codec: string | null = null,
  ) {}

  public static parse(raw: string): OutputFormat {
    const format = OutputFormat.tryParse(raw)
    if (format == null) {
      throw new Error(`Invalid output format: ${raw}`)
    }
    return format
  }

  public static tryParse(raw: string): OutputFormat | null {
    if (raw === OutputFiletype.PNG) { return OutputFormat.png() }
    if (raw === OutputFiletype.JPEG) { return OutputFormat.jpeg() }
    if (raw === OutputFiletype.WebP) { return OutputFormat.webp() }
    if (raw === OutputFiletype.AVIF) { return OutputFormat.avif() }

    const qualityMatch = raw.match(/^(jpeg|webp|avif)\((\d+)\)$/)
    if (qualityMatch != null) {
      const quality = parseInt(qualityMatch[2], 10)
      if (quality < MIN_QUALITY || quality > MAX_QUALITY) { return null }
      return new OutputFormat(qualityMatch[1] as OutputFiletype, quality)
    }

    if (isContainer(raw)) {
      return OutputFormat.video(defaultVideoCodec(raw), raw)
    }

    const videoMatch = raw.match(/^([\w-]+)\.(\w+)$/)
    if (videoMatch != null && isContainer(videoMatch[2])) {
      return OutputFormat.video(videoMatch[1], videoMatch[2])
    }

    return null
  }

  public static png() {
    return new OutputFormat(OutputFiletype.PNG)
  }

  public static jpeg(quality: number = DEFAULT_QUALITY) {
    return new OutputFormat(OutputFiletype.JPEG, quality)
  }

  /** Lossless without a quality. */
  public static webp(quality: number | null = null) {
    return new OutputFormat(OutputFiletype.WebP, quality)
  }

  public static avif(quality: number = DEFAULT_QUALITY) {
    return new OutputFormat(OutputFiletype.AVIF, quality)
  }

  /** In the given container, or the first one the codec fits in. */
  public static video(codec: string, container?: OutputFiletype) {
    const fileType = container ?? videoCodecContainers(codec)[0]
    if (outputFiletypeKind(fileType) !== 'video') {
      throw new TypeError(`Not a video container: ${fileType}`)
    }
    return new OutputFormat(fileType, null, codec)
  }

  public get kind(): OutputKind {
    return outputFiletypeKind(this.fileType)
  }

  public get isImage() {
    return this.kind === 'image'
  }

  public get isVideo() {
    return this.kind === 'video'
  }

  /** Only known for images. */
  public get lossless() {
    if (this.fileType === OutputFiletype.PNG) { return true }
    if (this.fileType === OutputFiletype.WebP) { return this.quality == null }
    return false
  }

  public get extension(): string {
    return this.fileType === OutputFiletype.JPEG ? 'jpg' : this.fileType
  }

  public get mimeType(): string {
    return MIME_TYPES[this.fileType]
  }

  public equals(other: OutputFormat | null | undefined) {
    return other != null && other.toString() === this.toString()
  }

  public toString() {
    if (this.codec != null) {
      return `${this.codec}.${this.fileType}`
    } else if (this.quality != null) {
      return `${this.fileType}(${this.quality})`
    } else {
      return this.fileType
    }
  }

  public [Symbol.toPrimitive](hint: 'string' | 'number' | 'default') {
    if (hint === 'number') { return null }
    return this.toString()
  }

}

export const MIN_QUALITY = 1
export const MAX_QUALITY = 100
export const DEFAULT_QUALITY = 85

const MIME_TYPES: Record<OutputFiletype, string> = {
  [OutputFiletype.PNG]:       'image/png',
  [OutputFiletype.JPEG]:      'image/jpeg',
  [OutputFiletype.WebP]:      'image/webp',
  [OutputFiletype.AVIF]:      'image/avif',
  [OutputFiletype.QuickTime]: 'video/quicktime',
  [OutputFiletype.MP4]:       'video/mp4',
  [OutputFiletype.WebM]:      'video/webm',
  [OutputFiletype.Matroska]:  'video/x-matroska',
}

function isContainer(raw: string): raw is OutputFiletype {
  return (Object.values(OutputFiletype) as string[]).includes(raw) && outputFiletypeKind(raw as OutputFiletype) === 'video'
}
