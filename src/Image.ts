import { isPlainObject } from 'ytil'

export interface Image {
  type: string
  binary: ImageBinary
}

export namespace Image {
  export function is(arg: unknown): arg is Image {
    if (!isPlainObject(arg)) { return false }
    if (!('type' in arg) || typeof arg.type !== 'string') { return false }
    if (!('binary' in arg) || !(arg.binary instanceof Uint8Array)) { return false }

    return true
  }
}

export type ImageBinary = Uint8Array<ArrayBuffer>