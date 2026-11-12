export type VehicleId = 'ghost-gt' | 'ghost-r' | 'ghost-x'

export type PaintFinish = 'gloss' | 'matte' | 'metallic'

export type PaintId =
  | 'midnight-black'
  | 'pearl-white'
  | 'racing-red'
  | 'electric-blue'
  | 'titanium-silver'
  | 'emerald-green'
  | 'sunset-orange'
  | 'royal-purple'

export type WheelStyle = 'classic-five' | 'multi-spoke' | 'aero-disc'
export type WheelFinish = 'silver' | 'gloss-black' | 'bronze'
export type WheelSize = 18 | 19 | 20

export type BodyKit = 'standard' | 'sport' | 'track'
export type PerformancePackage = 'standard' | 'sport' | 'track'
export type LightingMode = 'day' | 'night' | 'studio'
export type CameraPreset =
  | 'front'
  | 'rear'
  | 'left'
  | 'right'
  | 'front-three-quarter'
  | 'rear-three-quarter'
  | 'top'
  | 'interior'

export interface VehicleSpecs {
  horsepower: number
  torque: number
  acceleration: number
  topSpeed: number
  drivetrain: string
  weight: number
}

export interface VehicleDefinition {
  id: VehicleId
  name: string
  category: string
  basePrice: number
  specs: VehicleSpecs
  description: string
}

export interface PaintOption {
  id: PaintId
  name: string
  hex: string
  price: number
}

export interface BodyOptions {
  kit: BodyKit
  frontSplitter: boolean
  rearDiffuser: boolean
  sideSkirts: boolean
  rearSpoiler: boolean
  carbonRoof: boolean
}

export interface LightingState {
  headlights: boolean
  taillights: boolean
  ambient: boolean
  mode: LightingMode
}

export interface VehicleConfiguration {
  vehicleId: VehicleId
  paintId: PaintId
  paintFinish: PaintFinish
  wheelStyle: WheelStyle
  wheelFinish: WheelFinish
  wheelSize: WheelSize
  body: BodyOptions
  lighting: LightingState
  performance: PerformancePackage
  autoRotate: boolean
}

export interface PriceBreakdown {
  base: number
  paint: number
  paintFinish: number
  wheels: number
  bodyKit: number
  bodyExtras: number
  performance: number
  total: number
}

export interface SavedBuild {
  id: string
  name: string
  configuration: VehicleConfiguration
  price: number
  createdAt: string
  updatedAt: string
}

export interface AppSettings {
  reducedMotion: boolean
  developerMode: boolean
  fullscreen: boolean
}

export type AppView = 'garage' | 'configure' | 'saved' | 'about' | 'settings'

export type ConfiguratorSection =
  | 'vehicle'
  | 'paint'
  | 'wheels'
  | 'body'
  | 'lighting'
  | 'interior'
  | 'performance'
