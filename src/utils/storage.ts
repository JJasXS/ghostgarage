import { STORAGE_KEY, SETTINGS_KEY, DEFAULT_CONFIGURATION } from '@/data/defaults'
import type { AppSettings, SavedBuild, VehicleConfiguration } from '@/types'
import { isValidConfiguration } from './share'

const DEFAULT_SETTINGS: AppSettings = {
  reducedMotion: false,
  developerMode: false,
  fullscreen: false,
}

export function loadBuilds(): SavedBuild[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidSavedBuild)
  } catch {
    return []
  }
}

export function saveBuilds(builds: SavedBuild[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(builds))
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    const parsed = JSON.parse(raw) as Partial<AppSettings>
    return {
      reducedMotion: Boolean(parsed.reducedMotion),
      developerMode: Boolean(parsed.developerMode),
      fullscreen: Boolean(parsed.fullscreen),
    }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

function isValidSavedBuild(value: unknown): value is SavedBuild {
  if (!value || typeof value !== 'object') return false
  const b = value as Partial<SavedBuild>
  return (
    typeof b.id === 'string' &&
    typeof b.name === 'string' &&
    typeof b.price === 'number' &&
    typeof b.createdAt === 'string' &&
    typeof b.updatedAt === 'string' &&
    isValidConfiguration(b.configuration)
  )
}

export function createBuildId(): string {
  return `build_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function sanitizeConfiguration(
  partial: Partial<VehicleConfiguration> | undefined,
): VehicleConfiguration {
  if (!partial || !isValidConfiguration(partial)) {
    return structuredClone(DEFAULT_CONFIGURATION)
  }
  return partial
}
