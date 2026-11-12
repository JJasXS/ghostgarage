import { describe, expect, it } from 'vitest'
import { calculatePrice, formatMYR, getEffectiveSpecs } from '@/utils/pricing'
import { DEFAULT_CONFIGURATION } from '@/data/defaults'

describe('pricing engine', () => {
  it('calculates Ghost GT base total', () => {
    const config = {
      ...DEFAULT_CONFIGURATION,
      vehicleId: 'ghost-gt' as const,
      paintId: 'midnight-black' as const,
      paintFinish: 'gloss' as const,
      wheelStyle: 'classic-five' as const,
      wheelFinish: 'silver' as const,
      wheelSize: 18 as const,
      body: {
        kit: 'standard' as const,
        frontSplitter: false,
        rearDiffuser: false,
        sideSkirts: false,
        rearSpoiler: false,
        carbonRoof: false,
      },
      performance: 'standard' as const,
    }
    const price = calculatePrice(config)
    expect(price.base).toBe(250_000)
    expect(price.total).toBe(250_000)
  })

  it('adds paint, wheels, body, and performance', () => {
    const config = {
      ...DEFAULT_CONFIGURATION,
      vehicleId: 'ghost-r' as const,
      paintId: 'racing-red' as const,
      paintFinish: 'metallic' as const,
      wheelStyle: 'aero-disc' as const,
      wheelFinish: 'bronze' as const,
      wheelSize: 20 as const,
      body: {
        kit: 'track' as const,
        frontSplitter: true,
        rearDiffuser: true,
        sideSkirts: false,
        rearSpoiler: true,
        carbonRoof: false,
      },
      performance: 'track' as const,
    }
    const price = calculatePrice(config)
    expect(price.base).toBe(350_000)
    expect(price.paint).toBe(6500)
    expect(price.paintFinish).toBe(5000)
    expect(price.wheels).toBe(12000 + 3500 + 7500)
    expect(price.bodyKit).toBe(28000)
    expect(price.bodyExtras).toBe(4500 + 5500 + 6200)
    expect(price.performance).toBe(45000)
    expect(price.total).toBe(
      350_000 + 6500 + 5000 + 23000 + 28000 + 16200 + 45000,
    )
  })

  it('formats MYR currency', () => {
    expect(formatMYR(250000)).toContain('250')
    expect(formatMYR(250000)).toMatch(/RM|MYR/)
  })

  it('applies performance modifiers to specs', () => {
    const sport = getEffectiveSpecs({
      ...DEFAULT_CONFIGURATION,
      vehicleId: 'ghost-gt',
      performance: 'sport',
    })
    expect(sport.horsepower).toBe(510)
    expect(sport.acceleration).toBe(3.9)
  })
})
