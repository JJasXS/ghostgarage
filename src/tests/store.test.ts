import { beforeEach, describe, expect, it } from 'vitest'
import { useGarageStore } from '@/store/useGarageStore'
import { DEFAULT_CONFIGURATION } from '@/data/defaults'

describe('garage store', () => {
  beforeEach(() => {
    localStorage.clear()
    useGarageStore.setState({
      configuration: structuredClone(DEFAULT_CONFIGURATION),
      builds: [],
      history: [{ configuration: structuredClone(DEFAULT_CONFIGURATION) }],
      historyIndex: 0,
      toast: null,
    })
  })

  it('updates vehicle selection', () => {
    useGarageStore.getState().updateConfiguration({ vehicleId: 'ghost-r' })
    expect(useGarageStore.getState().configuration.vehicleId).toBe('ghost-r')
  })

  it('updates paint configuration', () => {
    useGarageStore.getState().updateConfiguration({ paintId: 'racing-red', paintFinish: 'matte' })
    const c = useGarageStore.getState().configuration
    expect(c.paintId).toBe('racing-red')
    expect(c.paintFinish).toBe('matte')
  })

  it('updates wheel configuration', () => {
    useGarageStore.getState().updateConfiguration({
      wheelStyle: 'aero-disc',
      wheelFinish: 'bronze',
      wheelSize: 20,
    })
    const c = useGarageStore.getState().configuration
    expect(c.wheelStyle).toBe('aero-disc')
    expect(c.wheelSize).toBe(20)
  })

  it('saves and loads a build', () => {
    useGarageStore.getState().updateConfiguration({ paintId: 'emerald-green' })
    const id = useGarageStore.getState().saveCurrentBuild('Forest Build')
    expect(useGarageStore.getState().builds).toHaveLength(1)

    useGarageStore.getState().updateConfiguration({ paintId: 'pearl-white' })
    useGarageStore.getState().loadBuild(id)
    expect(useGarageStore.getState().configuration.paintId).toBe('emerald-green')
  })

  it('resets to factory', () => {
    useGarageStore.getState().updateConfiguration({ vehicleId: 'ghost-x', paintId: 'royal-purple' })
    useGarageStore.getState().resetFactory()
    expect(useGarageStore.getState().configuration).toEqual(DEFAULT_CONFIGURATION)
  })

  it('supports undo', () => {
    useGarageStore.getState().updateConfiguration({ paintId: 'sunset-orange' })
    useGarageStore.getState().undo()
    expect(useGarageStore.getState().configuration.paintId).toBe(DEFAULT_CONFIGURATION.paintId)
  })
})
