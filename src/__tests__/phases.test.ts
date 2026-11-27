import { minPhaseFrames, tooShortPhases } from '../phases'
import { Phase, PhaseType } from '../specification'

describe("minPhaseFrames", () => {

  it("requires half a second for a stable phase, rounded up", () => {
    expect(minPhaseFrames({type: PhaseType.Stable}, 25)).toBe(13)
    expect(minPhaseFrames({type: PhaseType.Stable}, 50)).toBe(25)
  })

  it("requires a single frame for other phases", () => {
    expect(minPhaseFrames({type: PhaseType.BuildIn}, 25)).toBe(1)
    expect(minPhaseFrames({type: PhaseType.Transition}, 25)).toBe(1)
    expect(minPhaseFrames({type: PhaseType.BuildOut}, 25)).toBe(1)
  })

})

describe("tooShortPhases", () => {

  function phase(name: string, type: PhaseType, from: number, to: number): Phase {
    return {name, type, from, to}
  }

  it("lists the stable phases shorter than the minimum", () => {
    const phases = [
      phase('in', PhaseType.BuildIn, 0, 2),
      phase('stable', PhaseType.Stable, 2, 14),
      phase('out', PhaseType.BuildOut, 14, 16),
    ]
    expect(tooShortPhases(phases, 25).map(it => it.name)).toEqual(['stable'])
  })

  it("accepts stable phases of the minimum length", () => {
    expect(tooShortPhases([phase('stable', PhaseType.Stable, 0, 13)], 25)).toEqual([])
  })

})
