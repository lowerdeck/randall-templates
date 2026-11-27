import { schemas } from '../schemas'
import { AnimProperty, WellKnownTimingFunction } from '../specification'
import { cubicBezier, normalizeTimings, parseTiming } from '../timing'

describe("parseTiming", () => {

  it("accepts named timings", () => {
    expect(parseTiming('ease-in-out-cubic')).toEqual(WellKnownTimingFunction.EaseInOutCubic)
  })

  it("canonicalizes cubic-bezier strings", () => {
    expect(parseTiming('cubic-bezier(0.34,1.56,  0.64 ,1)')).toEqual('cubic-bezier(0.34, 1.56, 0.64, 1)')
  })

  it("allows y values outside 0–1 for overshoot", () => {
    expect(parseTiming('cubic-bezier(0.5, -0.6, 0.5, 1.6)')).toEqual('cubic-bezier(0.5, -0.6, 0.5, 1.6)')
  })

  it("turns legacy arrays into cubic-bezier strings", () => {
    expect(parseTiming([0.34, 1.56, 0.64, 1])).toEqual('cubic-bezier(0.34, 1.56, 0.64, 1)')
  })

  it("rejects invalid timings", () => {
    expect(parseTiming('bouncy')).toBeNull()
    expect(parseTiming('cubic-bezier(0.1, 0.2, 0.3)')).toBeNull()
    expect(parseTiming('cubic-bezier(0.1, 0.2, , 0.3)')).toBeNull()
    expect(parseTiming('cubic-bezier(a, 0.2, 0.3, 0.4)')).toBeNull()
    expect(parseTiming('cubic-bezier(1.2, 0, 0.5, 1)')).toBeNull()
    expect(parseTiming('cubic-bezier(0.5, 0, -0.1, 1)')).toBeNull()
    expect(parseTiming([0.1, 0.2, 0.3])).toBeNull()
    expect(parseTiming(null)).toBeNull()
  })

})

describe("cubicBezier", () => {

  it("matches CSS's ease", () => {
    const ease = cubicBezier([0.25, 0.1, 0.25, 1])
    expect(ease(0.5)).toBeCloseTo(0.8024033877, 6)
  })

  it("is linear for a straight curve", () => {
    const linear = cubicBezier([0.25, 0.25, 0.75, 0.75])
    for (const x of [0.1, 0.3, 0.5, 0.9]) {
      expect(linear(x)).toBeCloseTo(x, 6)
    }
  })

  it("overshoots", () => {
    const back = cubicBezier([0.34, 1.56, 0.64, 1])
    expect(back(0)).toEqual(0)
    expect(back(1)).toEqual(1)
    expect(Math.max(...[0.4, 0.5, 0.6, 0.7].map(back))).toBeGreaterThan(1)
  })

  // The same values are checked in the renderer's timing_function.rs, so that both render the same.
  it("gives the values the renderer gives", () => {
    const back = cubicBezier([0.34, 1.56, 0.64, 1])
    expect(back(0.25)).toBeCloseTo(0.816289, 4)
    expect(back(0.5)).toBeCloseTo(1.087401, 4)
    expect(back(0.75)).toBeCloseTo(1.059647, 4)
  })

})

describe("animations schema", () => {

  const animations = (timing: unknown) => ({
    phases: [],
    tracks: [{
      component_id: 'title',
      prop:         AnimProperty.Opacity,
      keyframes:    [{frame: 0, value: 0, timing: 'linear'}, {frame: 10, value: 1, timing}],
    }],
  })

  it("round-trips cubic-bezier timings", () => {
    const timing = 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    const parsed = schemas.animations.parse(animations(timing))
    expect(parsed.tracks[0].keyframes[1].timing).toEqual(timing)
    expect(schemas.animations.parse(JSON.parse(JSON.stringify(parsed)))).toEqual(parsed)
  })

  it("loads legacy arrays as cubic-bezier strings", () => {
    const parsed = schemas.animations.parse(animations([0.34, 1.56, 0.64, 1]))
    expect(parsed.tracks[0].keyframes[1].timing).toEqual('cubic-bezier(0.34, 1.56, 0.64, 1)')
  })

  it("points at an invalid timing", () => {
    const result = schemas.animations.safeParse(animations('cubic-bezier(2, 0, 0, 1)'))
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toEqual(['tracks', 0, 'keyframes', 1, 'timing'])
  })

})

describe("normalizeTimings", () => {

  it("converts legacy arrays", () => {
    const normalized = normalizeTimings({
      phases: [],
      tracks: [{component_id: 'a', prop: AnimProperty.Scale, keyframes: [{frame: 0, value: 1, timing: [0, 0, 1, 1] as any}]}],
    })
    expect(normalized.tracks[0].keyframes[0].timing).toEqual('cubic-bezier(0, 0, 1, 1)')
  })

})
