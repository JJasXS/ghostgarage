import { beforeEach, describe, expect, it } from 'vitest'
import { loadBuilds, saveBuilds, createBuildId, loadSettings } from '@/utils/storage'
import { STORAGE_KEY } from '@/data/defaults'
import { DEFAULT_CONFIGURATION } from '@/data/defaults'

describe('localStorage builds', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('saves and loads builds', () => {
    const build = {
      id: createBuildId(),
      name: 'Test',
      configuration: DEFAULT_CONFIGURATION,
      price: 250000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    saveBuilds([build])
    expect(loadBuilds()).toHaveLength(1)
    expect(loadBuilds()[0].name).toBe('Test')
  })

  it('recovers from malformed storage', () => {
    localStorage.setItem(STORAGE_KEY, '{broken')
    expect(loadBuilds()).toEqual([])
  })

  it('filters invalid build entries', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ id: 1, name: 'bad' }, null, 'x']),
    )
    expect(loadBuilds()).toEqual([])
  })

  it('loads default settings when missing', () => {
    expect(loadSettings().reducedMotion).toBe(false)
  })
})
