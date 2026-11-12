import { describe, expect, it } from 'vitest'
import {
  decodeConfiguration,
  encodeConfiguration,
  isValidConfiguration,
} from '@/utils/share'
import { DEFAULT_CONFIGURATION } from '@/data/defaults'

describe('share / URL configuration', () => {
  it('round-trips a valid configuration', () => {
    const encoded = encodeConfiguration(DEFAULT_CONFIGURATION)
    const decoded = decodeConfiguration(encoded)
    expect(decoded).toEqual(DEFAULT_CONFIGURATION)
  })

  it('rejects invalid payloads', () => {
    expect(decodeConfiguration('not-valid')).toBeNull()
    expect(isValidConfiguration({ vehicleId: 'nope' })).toBe(false)
    expect(isValidConfiguration(null)).toBe(false)
  })

  it('rejects unknown paint ids', () => {
    expect(
      isValidConfiguration({
        ...DEFAULT_CONFIGURATION,
        paintId: 'hot-pink',
      }),
    ).toBe(false)
  })
})
