import type { VehicleConfiguration } from '@/types'

export const DEFAULT_CONFIGURATION: VehicleConfiguration = {
  vehicleId: 'ghost-gt',
  paintId: 'electric-blue',
  paintFinish: 'metallic',
  wheelStyle: 'classic-five',
  wheelFinish: 'silver',
  wheelSize: 19,
  body: {
    kit: 'standard',
    frontSplitter: false,
    rearDiffuser: false,
    sideSkirts: false,
    rearSpoiler: false,
    carbonRoof: false,
  },
  lighting: {
    headlights: true,
    taillights: true,
    ambient: true,
    mode: 'studio',
  },
  performance: 'standard',
  autoRotate: false,
}

export const STORAGE_KEY = 'ghostgarage-builds-v1'
export const SETTINGS_KEY = 'ghostgarage-settings-v1'
export const SHARE_PARAM = 'build'
