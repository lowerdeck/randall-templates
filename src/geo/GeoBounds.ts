import { isPlainObject } from 'ytil'

export interface GeoBounds {
  west:  number
  south: number
  east:  number
  north: number
}

export namespace GeoBounds {

  export function is(arg: unknown): arg is GeoBounds {
    if (!isPlainObject(arg)) { return false }
    return ['west', 'south', 'east', 'north'].every(key => {
      const value = arg[key]
      return typeof value === 'number' && Number.isFinite(value)
    })
  }

}
