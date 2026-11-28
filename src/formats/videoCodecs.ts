import { OutputFiletype } from './OutputFiletype'

/**
 * Video encoders available on the renderer (`ffmpeg -encoders`, video row `V...`),
 * grouped by category.
 */
export const videoCodecs: Record<VideoCodecCategory, VideoCodec[]> = {
  recommended: [
    {id: 'prores', name: 'Apple ProRes'},
    {id: 'dnxhd', name: 'VC3/DNxHD'},
    {id: 'cfhd', name: 'GoPro CineForm HD'},
    {id: 'ffv1', name: 'FFmpeg video codec #1'},
  ],
  common_modern: [
    {id: 'libaom-av1', name: 'libaom AV1 (codec av1)'},
    {id: 'librav1e', name: 'librav1e AV1 (codec av1)'},
    {id: 'libsvtav1', name: 'SVT-AV1(Scalable Video Technology for AV1) encoder (codec av1)'},
    {id: 'av1_nvenc', name: 'NVIDIA NVENC av1 encoder (codec av1)'},
    {id: 'av1_qsv', name: 'AV1 (Intel Quick Sync Video acceleration) (codec av1)'},
    {id: 'av1_vaapi', name: 'AV1 (VAAPI) (codec av1)'},
    {id: 'libx264', name: 'libx264 H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10 (codec h264)'},
    {id: 'libx264rgb', name: 'libx264 H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10 RGB (codec h264)'},
    {id: 'h264_nvenc', name: 'NVIDIA NVENC H.264 encoder (codec h264)'},
    {id: 'h264_qsv', name: 'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10 (Intel Quick Sync Video acceleration) (codec h264)'},
    {id: 'h264_v4l2m2m', name: 'V4L2 mem2mem H.264 encoder wrapper (codec h264)'},
    {id: 'h264_vaapi', name: 'H.264/AVC (VAAPI) (codec h264)'},
    {id: 'libx265', name: 'libx265 H.265 / HEVC (codec hevc)'},
    {id: 'hevc_nvenc', name: 'NVIDIA NVENC hevc encoder (codec hevc)'},
    {id: 'hevc_qsv', name: 'HEVC (Intel Quick Sync Video acceleration) (codec hevc)'},
    {id: 'hevc_v4l2m2m', name: 'V4L2 mem2mem HEVC encoder wrapper (codec hevc)'},
    {id: 'hevc_vaapi', name: 'H.265/HEVC (VAAPI) (codec hevc)'},
    {id: 'libvpx', name: 'libvpx VP8 (codec vp8)'},
    {id: 'vp8_v4l2m2m', name: 'V4L2 mem2mem VP8 encoder wrapper (codec vp8)'},
    {id: 'vp8_vaapi', name: 'VP8 (VAAPI) (codec vp8)'},
    {id: 'libvpx-vp9', name: 'libvpx VP9 (codec vp9)'},
    {id: 'vp9_vaapi', name: 'VP9 (VAAPI) (codec vp9)'},
    {id: 'vp9_qsv', name: 'VP9 video (Intel Quick Sync Video acceleration) (codec vp9)'},
    {id: 'prores', name: 'Apple ProRes'},
    {id: 'prores_aw', name: 'Apple ProRes (codec prores)'},
    {id: 'prores_ks', name: 'Apple ProRes (iCodec Pro) (codec prores)'},
  ],
  lossless_intermediate: [
    {id: 'ffv1', name: 'FFmpeg video codec #1'},
    {id: 'huffyuv', name: 'Huffyuv / HuffYUV'},
    {id: 'ffvhuff', name: 'Huffyuv FFmpeg variant'},
    {id: 'utvideo', name: 'Ut Video'},
    {id: 'magicyuv', name: 'MagicYUV video'},
    {id: 'dnxhd', name: 'VC3/DNxHD'},
    {id: 'cfhd', name: 'GoPro CineForm HD'},
    {id: 'hap', name: 'Vidvox Hap'},
    {id: 'qtrle', name: 'QuickTime Animation (RLE) video'},
    {id: 'rawvideo', name: 'raw video'},
  ],
  legacy_mpeg: [
    {id: 'mpeg1video', name: 'MPEG-1 video'},
    {id: 'mpeg2video', name: 'MPEG-2 video'},
    {id: 'mpeg2_qsv', name: 'MPEG-2 video (Intel Quick Sync Video acceleration) (codec mpeg2video)'},
    {id: 'mpeg2_vaapi', name: 'MPEG-2 (VAAPI) (codec mpeg2video)'},
    {id: 'mpeg4', name: 'MPEG-4 part 2'},
    {id: 'libxvid', name: 'libxvidcore MPEG-4 part 2 (codec mpeg4)'},
    {id: 'mpeg4_v4l2m2m', name: 'V4L2 mem2mem MPEG4 encoder wrapper (codec mpeg4)'},
    {id: 'msmpeg4v2', name: 'MPEG-4 part 2 Microsoft variant version 2'},
    {id: 'msmpeg4', name: 'MPEG-4 part 2 Microsoft variant version 3 (codec msmpeg4v3)'},
    {id: 'h261', name: 'H.261'},
    {id: 'h263', name: 'H.263 / H.263-1996'},
    {id: 'h263_v4l2m2m', name: 'V4L2 mem2mem H.263 encoder wrapper (codec h263)'},
    {id: 'h263p', name: 'H.263+ / H.263-1998 / H.263 version 2'},
    {id: 'flv', name: 'FLV / Sorenson Spark / Sorenson H.263 (Flash Video) (codec flv1)'},
    {id: 'wmv1', name: 'Windows Media Video 7'},
    {id: 'wmv2', name: 'Windows Media Video 8'},
    {id: 'svq1', name: 'Sorenson Vector Quantizer 1 / Sorenson Video 1 / SVQ1'},
    {id: 'rv10', name: 'RealVideo 1.0'},
    {id: 'rv20', name: 'RealVideo 2.0'},
    {id: 'libtheora', name: 'libtheora Theora (codec theora)'},
  ],
  image_sequence: [
    {id: 'alias_pix', name: 'Alias/Wavefront PIX image'},
    {id: 'apng', name: 'APNG (Animated Portable Network Graphics) image'},
    {id: 'bmp', name: 'BMP (Windows and OS/2 bitmap)'},
    {id: 'dpx', name: 'DPX (Digital Picture Exchange) image'},
    {id: 'exr', name: 'OpenEXR image'},
    {id: 'fits', name: 'Flexible Image Transport System'},
    {id: 'gif', name: 'GIF (Graphics Interchange Format)'},
    {id: 'hdr', name: 'HDR (Radiance RGBE format) image'},
    {id: 'jpeg2000', name: 'JPEG 2000'},
    {id: 'libopenjpeg', name: 'OpenJPEG JPEG 2000 (codec jpeg2000)'},
    {id: 'jpegls', name: 'JPEG-LS'},
    {id: 'libjxl', name: 'libjxl JPEG XL (codec jpegxl)'},
    {id: 'ljpeg', name: 'Lossless JPEG'},
    {id: 'mjpeg', name: 'MJPEG (Motion JPEG)'},
    {id: 'mjpeg_qsv', name: 'MJPEG (Intel Quick Sync Video acceleration) (codec mjpeg)'},
    {id: 'mjpeg_vaapi', name: 'MJPEG (VAAPI) (codec mjpeg)'},
    {id: 'pam', name: 'PAM (Portable AnyMap) image'},
    {id: 'pbm', name: 'PBM (Portable BitMap) image'},
    {id: 'pcx', name: 'PC Paintbrush PCX image'},
    {id: 'pfm', name: 'PFM (Portable FloatMap) image'},
    {id: 'pgm', name: 'PGM (Portable GrayMap) image'},
    {id: 'pgmyuv', name: 'PGMYUV (Portable GrayMap YUV) image'},
    {id: 'phm', name: 'PHM (Portable HalfFloatMap) image'},
    {id: 'png', name: 'PNG (Portable Network Graphics) image'},
    {id: 'ppm', name: 'PPM (Portable PixelMap) image'},
    {id: 'qoi', name: 'QOI (Quite OK Image format) image'},
    {id: 'sgi', name: 'SGI image'},
    {id: 'sunrast', name: 'Sun Rasterfile image'},
    {id: 'targa', name: 'Truevision Targa image'},
    {id: 'tiff', name: 'TIFF image'},
    {id: 'wbmp', name: 'WBMP (Wireless Application Protocol Bitmap) image'},
    {id: 'libwebp', name: 'libwebp WebP image (codec webp)'},
    {id: 'libwebp_anim', name: 'libwebp WebP image (codec webp)'},
    {id: 'xbm', name: 'XBM (X BitMap) image'},
    {id: 'xwd', name: 'XWD (X Window Dump) image'},
  ],
  niche_retro: [
    {id: 'a64multi', name: 'Multicolor charset for Commodore 64 (codec a64_multi)'},
    {id: 'a64multi5', name: 'Multicolor charset for Commodore 64, extended with 5th color (colram) (codec a64_multi5)'},
    {id: 'amv', name: 'AMV Video'},
    {id: 'asv1', name: 'ASUS V1'},
    {id: 'asv2', name: 'ASUS V2'},
    {id: 'avrp', name: 'Avid 1:1 10-bit RGB Packer'},
    {id: 'avui', name: 'Avid Meridien Uncompressed'},
    {id: 'ayuv', name: 'Uncompressed packed MS 4:4:4:4'},
    {id: 'bitpacked', name: 'Bitpacked'},
    {id: 'cinepak', name: 'Cinepak'},
    {id: 'cljr', name: 'Cirrus Logic AccuPak'},
    {id: 'vc2', name: 'SMPTE VC-2 (codec dirac)'},
    {id: 'dvvideo', name: 'DV (Digital Video)'},
    {id: 'flashsv', name: 'Flash Screen Video'},
    {id: 'flashsv2', name: 'Flash Screen Video Version 2'},
    {id: 'msrle', name: 'Microsoft RLE'},
    {id: 'msvideo1', name: 'Microsoft Video-1'},
    {id: 'r10k', name: 'AJA Kona 10-bit RGB Codec'},
    {id: 'r210', name: 'Uncompressed RGB 10-bit'},
    {id: 'roqvideo', name: 'id RoQ video (codec roq)'},
    {id: 'rpza', name: 'QuickTime video (RPZA)'},
    {id: 'smc', name: 'QuickTime Graphics (SMC)'},
    {id: 'snow', name: 'Snow'},
    {id: 'speedhq', name: 'NewTek SpeedHQ'},
    {id: 'v210', name: 'Uncompressed 4:2:2 10-bit'},
    {id: 'v308', name: 'Uncompressed packed 4:4:4'},
    {id: 'v408', name: 'Uncompressed packed QT 4:4:4:4'},
    {id: 'v410', name: 'Uncompressed 4:4:4 10-bit'},
    {id: 'vbn', name: 'Vizrt Binary Image'},
    {id: 'vnull', name: 'null video'},
    {id: 'wrapped_avframe', name: 'AVFrame to AVPacket passthrough'},
    {id: 'xface', name: 'X-face image'},
    {id: 'y41p', name: 'Uncompressed YUV 4:1:1 12-bit'},
    {id: 'yuv4', name: 'Uncompressed packed 4:2:0'},
    {id: 'zlib', name: 'LCL (LossLess Codec Library) ZLIB'},
    {id: 'zmbv', name: 'Zip Motion Blocks Video'},
  ],
}

export const videoCodecList: VideoCodec[] = Object.values(videoCodecs).flat()

export function videoCodec(id: string): VideoCodec | null {
  return videoCodecList.find(it => it.id === id) ?? null
}

/** The containers a codec fits in, the first being the default. Codecs not listed go in a QuickTime file. */
export function videoCodecContainers(id: string): OutputFiletype[] {
  return CODEC_CONTAINERS[id] ?? [OutputFiletype.QuickTime]
}

export function defaultVideoCodec(container: OutputFiletype): string {
  return DEFAULT_CODECS[container] ?? 'prores'
}

export interface VideoCodec {
  id:   string
  name: string
}

export type VideoCodecCategory = 'recommended' | 'common_modern' | 'lossless_intermediate' | 'legacy_mpeg' | 'image_sequence' | 'niche_retro'

const MP4_MOV_MKV = [OutputFiletype.MP4, OutputFiletype.QuickTime, OutputFiletype.Matroska]
const WEBM_MKV = [OutputFiletype.WebM, OutputFiletype.Matroska]
const MP4_WEBM_MKV = [OutputFiletype.MP4, OutputFiletype.WebM, OutputFiletype.Matroska]

const CODEC_CONTAINERS: Record<string, OutputFiletype[]> = {
  'libx264':    MP4_MOV_MKV,
  'libx264rgb': MP4_MOV_MKV,
  'h264_nvenc': MP4_MOV_MKV,
  'h264_qsv':   MP4_MOV_MKV,
  'h264_vaapi': MP4_MOV_MKV,
  'libx265':    MP4_MOV_MKV,
  'hevc_nvenc': MP4_MOV_MKV,
  'hevc_qsv':   MP4_MOV_MKV,
  'hevc_vaapi': MP4_MOV_MKV,
  'libaom-av1': MP4_WEBM_MKV,
  'librav1e':   MP4_WEBM_MKV,
  'libsvtav1':  MP4_WEBM_MKV,
  'av1_nvenc':  MP4_WEBM_MKV,
  'av1_qsv':    MP4_WEBM_MKV,
  'av1_vaapi':  MP4_WEBM_MKV,
  'libvpx':     WEBM_MKV,
  'vp8_vaapi':  WEBM_MKV,
  'libvpx-vp9': WEBM_MKV,
  'vp9_vaapi':  WEBM_MKV,
  'vp9_qsv':    WEBM_MKV,
  'ffv1':       [OutputFiletype.Matroska, OutputFiletype.QuickTime],
  'utvideo':    [OutputFiletype.Matroska, OutputFiletype.QuickTime],
  'png':        [OutputFiletype.QuickTime, OutputFiletype.Matroska],
}

const DEFAULT_CODECS: Partial<Record<OutputFiletype, string>> = {
  [OutputFiletype.QuickTime]: 'prores',
  [OutputFiletype.MP4]:       'libx264',
  [OutputFiletype.WebM]:      'libvpx-vp9',
  [OutputFiletype.Matroska]:  'ffv1',
}
