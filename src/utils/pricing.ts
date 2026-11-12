import { VEHICLES } from '@/data/vehicles'
import { PAINTS, PAINT_FINISH_PRICES } from '@/data/paints'
import { WHEEL_STYLES, WHEEL_FINISHES, WHEEL_SIZES } from '@/data/wheels'
import {
  BODY_KIT_PRICES,
  BODY_EXTRA_PRICES,
  PERFORMANCE_PRICES,
  PERFORMANCE_MODIFIERS,
} from '@/data/pricing'
import type { PriceBreakdown, VehicleConfiguration, VehicleSpecs } from '@/types'

export function calculatePrice(config: VehicleConfiguration): PriceBreakdown {
  const vehicle = VEHICLES[config.vehicleId]
  const paint = PAINTS.find((p) => p.id === config.paintId)
  const wheelStyle = WHEEL_STYLES.find((w) => w.id === config.wheelStyle)
  const wheelFinish = WHEEL_FINISHES.find((w) => w.id === config.wheelFinish)
  const wheelSize = WHEEL_SIZES.find((w) => w.size === config.wheelSize)

  const base = vehicle?.basePrice ?? 0
  const paintPrice = paint?.price ?? 0
  const paintFinish = PAINT_FINISH_PRICES[config.paintFinish] ?? 0
  const wheels =
    (wheelStyle?.price ?? 0) + (wheelFinish?.price ?? 0) + (wheelSize?.price ?? 0)
  const bodyKit = BODY_KIT_PRICES[config.body.kit] ?? 0

  let bodyExtras = 0
  if (config.body.frontSplitter) bodyExtras += BODY_EXTRA_PRICES.frontSplitter
  if (config.body.rearDiffuser) bodyExtras += BODY_EXTRA_PRICES.rearDiffuser
  if (config.body.sideSkirts) bodyExtras += BODY_EXTRA_PRICES.sideSkirts
  if (config.body.rearSpoiler) bodyExtras += BODY_EXTRA_PRICES.rearSpoiler
  if (config.body.carbonRoof) bodyExtras += BODY_EXTRA_PRICES.carbonRoof

  const performance = PERFORMANCE_PRICES[config.performance] ?? 0
  const total = base + paintPrice + paintFinish + wheels + bodyKit + bodyExtras + performance

  return {
    base,
    paint: paintPrice,
    paintFinish,
    wheels,
    bodyKit,
    bodyExtras,
    performance,
    total,
  }
}

export function getEffectiveSpecs(config: VehicleConfiguration): VehicleSpecs {
  const base = VEHICLES[config.vehicleId]?.specs
  if (!base) {
    return {
      horsepower: 0,
      torque: 0,
      acceleration: 0,
      topSpeed: 0,
      drivetrain: '—',
      weight: 0,
    }
  }

  const mod = PERFORMANCE_MODIFIERS[config.performance]
  return {
    horsepower: base.horsepower + mod.hp,
    torque: base.torque + mod.torque,
    acceleration: Math.max(2.5, +(base.acceleration + mod.accel).toFixed(1)),
    topSpeed: base.topSpeed + mod.topSpeed,
    drivetrain: base.drivetrain,
    weight: base.weight,
  }
}

export function formatMYR(amount: number): string {
  return new Intl.NumberFormat('ms-MY', {
    style: 'currency',
    currency: 'MYR',
    maximumFractionDigits: 0,
  }).format(amount)
}
