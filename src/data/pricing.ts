import type { BodyKit, PerformancePackage } from '@/types'

export const BODY_KIT_PRICES: Record<BodyKit, number> = {
  standard: 0,
  sport: 15000,
  track: 28000,
}

export const BODY_EXTRA_PRICES = {
  frontSplitter: 4500,
  rearDiffuser: 5500,
  sideSkirts: 3800,
  rearSpoiler: 6200,
  carbonRoof: 9000,
} as const

export const PERFORMANCE_PRICES: Record<PerformancePackage, number> = {
  standard: 0,
  sport: 22000,
  track: 45000,
}

export const PERFORMANCE_MODIFIERS: Record<
  PerformancePackage,
  { hp: number; torque: number; accel: number; topSpeed: number }
> = {
  standard: { hp: 0, torque: 0, accel: 0, topSpeed: 0 },
  sport: { hp: 60, torque: 80, accel: -0.3, topSpeed: 15 },
  track: { hp: 120, torque: 140, accel: -0.6, topSpeed: 30 },
}
