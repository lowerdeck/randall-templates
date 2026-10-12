import { isPlainObject } from 'ytil'

export interface GeoPoint {
  lat: number
  lng: number
}

export namespace GeoPoint {

  export function is(arg: unknown): arg is GeoPoint {
    if (!isPlainObject(arg)) { return false }
    return isFiniteNumber(arg.lat) && isFiniteNumber(arg.lng)
  }

  // Parses "lat, lng" strings, as typically copied from Google Maps.
  export function parse(text: string): GeoPoint | null {
    const match = text.trim().match(/^(-?\d+(?:\.\d+)?)\s*[,;\s]\s*(-?\d+(?:\.\d+)?)$/)
    if (match == null) { return null }

    const lat = parseFloat(match[1])
    const lng = parseFloat(match[2])
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) { return null }
    return {lat, lng}
  }

}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}
