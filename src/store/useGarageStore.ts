import { create } from 'zustand'
import { DEFAULT_CONFIGURATION } from '@/data/defaults'
import { calculatePrice } from '@/utils/pricing'
import {
  createBuildId,
  loadBuilds,
  loadSettings,
  saveBuilds,
  saveSettings,
} from '@/utils/storage'
import { buildShareUrl, clearShareParam, readShareFromUrl } from '@/utils/share'
import type {
  AppSettings,
  AppView,
  CameraPreset,
  ConfiguratorSection,
  SavedBuild,
  VehicleConfiguration,
} from '@/types'

interface HistoryEntry {
  configuration: VehicleConfiguration
}

interface GarageState {
  configuration: VehicleConfiguration
  view: AppView
  section: ConfiguratorSection
  builds: SavedBuild[]
  settings: AppSettings
  cameraPreset: CameraPreset | null
  cameraNonce: number
  compareIds: [string | null, string | null]
  history: HistoryEntry[]
  historyIndex: number
  isDraggingCamera: boolean
  screenshotRequestId: number
  loading: boolean
  toast: string | null

  setView: (view: AppView) => void
  setSection: (section: ConfiguratorSection) => void
  updateConfiguration: (partial: Partial<VehicleConfiguration>, recordHistory?: boolean) => void
  updateBody: (partial: Partial<VehicleConfiguration['body']>) => void
  updateLighting: (partial: Partial<VehicleConfiguration['lighting']>) => void
  setCameraPreset: (preset: CameraPreset) => void
  resetCamera: () => void
  setDraggingCamera: (dragging: boolean) => void
  requestScreenshot: () => void
  saveCurrentBuild: (name?: string) => string
  renameBuild: (id: string, name: string) => void
  loadBuild: (id: string) => void
  duplicateBuild: (id: string) => void
  deleteBuild: (id: string) => void
  setCompare: (slot: 0 | 1, id: string | null) => void
  undo: () => void
  redo: () => void
  resetFactory: () => void
  updateSettings: (partial: Partial<AppSettings>) => void
  setLoading: (loading: boolean) => void
  setToast: (toast: string | null) => void
  getShareUrl: () => string
  hydrateFromUrl: () => void
}

function pushHistory(
  history: HistoryEntry[],
  index: number,
  configuration: VehicleConfiguration,
): { history: HistoryEntry[]; historyIndex: number } {
  const trimmed = history.slice(0, index + 1)
  trimmed.push({ configuration: structuredClone(configuration) })
  if (trimmed.length > 40) trimmed.shift()
  return { history: trimmed, historyIndex: trimmed.length - 1 }
}

export const useGarageStore = create<GarageState>((set, get) => ({
  configuration: structuredClone(DEFAULT_CONFIGURATION),
  view: 'configure',
  section: 'vehicle',
  builds: loadBuilds(),
  settings: loadSettings(),
  cameraPreset: 'front-three-quarter',
  cameraNonce: 0,
  compareIds: [null, null],
  history: [{ configuration: structuredClone(DEFAULT_CONFIGURATION) }],
  historyIndex: 0,
  isDraggingCamera: false,
  screenshotRequestId: 0,
  loading: true,
  toast: null,

  setView: (view) => set({ view }),
  setSection: (section) => set({ section }),

  updateConfiguration: (partial, recordHistory = true) => {
    const next = { ...get().configuration, ...partial }
    if (recordHistory) {
      const { history, historyIndex } = pushHistory(
        get().history,
        get().historyIndex,
        next,
      )
      set({ configuration: next, history, historyIndex })
    } else {
      set({ configuration: next })
    }
  },

  updateBody: (partial) => {
    const next = {
      ...get().configuration,
      body: { ...get().configuration.body, ...partial },
    }
    const { history, historyIndex } = pushHistory(
      get().history,
      get().historyIndex,
      next,
    )
    set({ configuration: next, history, historyIndex })
  },

  updateLighting: (partial) => {
    const next = {
      ...get().configuration,
      lighting: { ...get().configuration.lighting, ...partial },
    }
    set({ configuration: next })
  },

  setCameraPreset: (preset) =>
    set((s) => ({ cameraPreset: preset, cameraNonce: s.cameraNonce + 1 })),

  resetCamera: () =>
    set((s) => ({
      cameraPreset: 'front-three-quarter',
      cameraNonce: s.cameraNonce + 1,
    })),

  setDraggingCamera: (dragging) => set({ isDraggingCamera: dragging }),

  requestScreenshot: () =>
    set((s) => ({ screenshotRequestId: s.screenshotRequestId + 1 })),

  saveCurrentBuild: (name) => {
    const { configuration, builds } = get()
    const id = createBuildId()
    const now = new Date().toISOString()
    const build: SavedBuild = {
      id,
      name: name?.trim() || `Build ${builds.length + 1}`,
      configuration: structuredClone(configuration),
      price: calculatePrice(configuration).total,
      createdAt: now,
      updatedAt: now,
    }
    const next = [build, ...builds]
    saveBuilds(next)
    set({ builds: next, toast: 'Build saved to garage' })
    return id
  },

  renameBuild: (id, name) => {
    const next = get().builds.map((b) =>
      b.id === id ? { ...b, name: name.trim() || b.name, updatedAt: new Date().toISOString() } : b,
    )
    saveBuilds(next)
    set({ builds: next })
  },

  loadBuild: (id) => {
    const build = get().builds.find((b) => b.id === id)
    if (!build) return
    const { history, historyIndex } = pushHistory(
      get().history,
      get().historyIndex,
      build.configuration,
    )
    set({
      configuration: structuredClone(build.configuration),
      history,
      historyIndex,
      view: 'configure',
      toast: `Loaded “${build.name}”`,
    })
  },

  duplicateBuild: (id) => {
    const build = get().builds.find((b) => b.id === id)
    if (!build) return
    const now = new Date().toISOString()
    const copy: SavedBuild = {
      ...structuredClone(build),
      id: createBuildId(),
      name: `${build.name} (copy)`,
      createdAt: now,
      updatedAt: now,
    }
    const next = [copy, ...get().builds]
    saveBuilds(next)
    set({ builds: next, toast: 'Build duplicated' })
  },

  deleteBuild: (id) => {
    const next = get().builds.filter((b) => b.id !== id)
    saveBuilds(next)
    const [a, b] = get().compareIds
    set({
      builds: next,
      compareIds: [a === id ? null : a, b === id ? null : b],
      toast: 'Build deleted',
    })
  },

  setCompare: (slot, id) => {
    const compareIds = [...get().compareIds] as [string | null, string | null]
    compareIds[slot] = id
    set({ compareIds })
  },

  undo: () => {
    const { historyIndex, history } = get()
    if (historyIndex <= 0) return
    const nextIndex = historyIndex - 1
    set({
      historyIndex: nextIndex,
      configuration: structuredClone(history[nextIndex].configuration),
    })
  },

  redo: () => {
    const { historyIndex, history } = get()
    if (historyIndex >= history.length - 1) return
    const nextIndex = historyIndex + 1
    set({
      historyIndex: nextIndex,
      configuration: structuredClone(history[nextIndex].configuration),
    })
  },

  resetFactory: () => {
    const next = structuredClone(DEFAULT_CONFIGURATION)
    const { history, historyIndex } = pushHistory(
      get().history,
      get().historyIndex,
      next,
    )
    set({
      configuration: next,
      history,
      historyIndex,
      toast: 'Reset to factory defaults',
    })
  },

  updateSettings: (partial) => {
    const settings = { ...get().settings, ...partial }
    saveSettings(settings)
    set({ settings })
  },

  setLoading: (loading) => set({ loading }),
  setToast: (toast) => set({ toast }),

  getShareUrl: () => buildShareUrl(get().configuration),

  hydrateFromUrl: () => {
    const shared = readShareFromUrl()
    if (!shared) return
    const { history, historyIndex } = pushHistory(
      get().history,
      get().historyIndex,
      shared,
    )
    set({
      configuration: shared,
      history,
      historyIndex,
      toast: 'Shared configuration loaded',
    })
    clearShareParam()
  },
}))
