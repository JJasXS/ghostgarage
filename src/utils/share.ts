import { DEFAULT_CONFIGURATION, SHARE_PARAM } from '@/data/defaults'
import { VEHICLES } from '@/data/vehicles'
import { PAINTS } from '@/data/paints'
import type {
  BodyKit,
  LightingMode,
  PaintFinish,
  PerformancePackage,
  VehicleConfiguration,
  VehicleId,
  WheelFinish,
  WheelSize,
  WheelStyle,
} from '@/types'

const VEHICLE_IDS = Object.keys(VEHICLES) as VehicleId[]
const PAINT_IDS = PAINTS.map((p) => p.id)
const FINISHES: PaintFinish[] = ['gloss', 'matte', 'metallic']
const WHEEL_STYLES: WheelStyle[] = ['classic-five', 'multi-spoke', 'aero-disc']
const WHEEL_FINISHES: WheelFinish[] = ['silver', 'gloss-black', 'bronze']
const WHEEL_SIZES: WheelSize[] = [18, 19, 20]
const BODY_KITS: BodyKit[] = ['standard', 'sport', 'track']
const PERF: PerformancePackage[] = ['standard', 'sport', 'track']
const LIGHT_MODES: LightingMode[] = ['day', 'night', 'studio']

export function isValidConfiguration(value: unknown): value is VehicleConfiguration {
  if (!value || typeof value !== 'object') return false
  const c = value as Partial<VehicleConfiguration>
  if (!c.vehicleId || !VEHICLE_IDS.includes(c.vehicleId)) return false
  if (!c.paintId || !PAINT_IDS.includes(c.paintId)) return false
  if (!c.paintFinish || !FINISHES.includes(c.paintFinish)) return false
  if (!c.wheelStyle || !WHEEL_STYLES.includes(c.wheelStyle)) return false
  if (!c.wheelFinish || !WHEEL_FINISHES.includes(c.wheelFinish)) return false
  if (!c.wheelSize || !WHEEL_SIZES.includes(c.wheelSize)) return false
  if (!c.performance || !PERF.includes(c.performance)) return false
  if (!c.body || typeof c.body !== 'object') return false
  if (!BODY_KITS.includes(c.body.kit)) return false
  if (!c.lighting || typeof c.lighting !== 'object') return false
  if (!LIGHT_MODES.includes(c.lighting.mode)) return false
  return true
}

export function encodeConfiguration(config: VehicleConfiguration): string {
  const json = JSON.stringify(config)
  return btoa(unescape(encodeURIComponent(json)))
}

export function decodeConfiguration(encoded: string): VehicleConfiguration | null {
  try {
    const json = decodeURIComponent(escape(atob(encoded)))
    const parsed: unknown = JSON.parse(json)
    if (!isValidConfiguration(parsed)) return null
    return {
      ...DEFAULT_CONFIGURATION,
      ...parsed,
      body: { ...DEFAULT_CONFIGURATION.body, ...parsed.body },
      lighting: { ...DEFAULT_CONFIGURATION.lighting, ...parsed.lighting },
    }
  } catch {
    return null
  }
}

export function buildShareUrl(config: VehicleConfiguration): string {
  const url = new URL(window.location.href)
  url.searchParams.set(SHARE_PARAM, encodeConfiguration(config))
  return url.toString()
}

export function readShareFromUrl(): VehicleConfiguration | null {
  try {
    const params = new URLSearchParams(window.location.search)
    const encoded = params.get(SHARE_PARAM)
    if (!encoded) return null
    return decodeConfiguration(encoded)
  } catch {
    return null
  }
}

export function clearShareParam(): void {
  const url = new URL(window.location.href)
  if (!url.searchParams.has(SHARE_PARAM)) return
  url.searchParams.delete(SHARE_PARAM)
  window.history.replaceState({}, '', url.toString())
}
