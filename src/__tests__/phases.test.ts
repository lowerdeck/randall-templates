import { minPhaseFrames, tooShortPhases } from '../phases'
import { Phase, PhaseType } from '../specification'

describe("minPhaseFrames", () => {

  it("requires half a second, rounded up", () => {
    expect(minPhaseFrames(25)).toBe(13)
    expect(minPhaseFrames(50)).toBe(25)
  })

})

describe("tooShortPhases", () => {

  function phase(name: string, type: PhaseType, from: number, to: number): Phase {
    return {name, type, from, to}
  }

  it("lists the phases shorter than the minimum, of any type", () => {
    const phases = [
      phase('in', PhaseType.BuildIn, 0, 12),
      phase('stable', PhaseType.Stable, 12, 30),
      phase('out', PhaseType.BuildOut, 30, 32),
    ]
    expect(tooShortPhases(phases, 25).map(it => it.name)).toEqual(['in', 'out'])
  })

  it("accepts phases of the minimum length", () => {
    expect(tooShortPhases([phase('stable', PhaseType.Stable, 0, 13)], 25)).toEqual([])
  })

})
