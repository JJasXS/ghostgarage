import type { WheelFinish, WheelSize, WheelStyle } from '@/types'

export const WHEEL_STYLES: { id: WheelStyle; name: string; price: number }[] = [
  { id: 'classic-five', name: 'Classic Five-Spoke', price: 0 },
  { id: 'multi-spoke', name: 'Multi-Spoke Performance', price: 8500 },
  { id: 'aero-disc', name: 'Aero Disc', price: 12000 },
]

export const WHEEL_FINISHES: { id: WheelFinish; name: string; hex: string; price: number }[] = [
  { id: 'silver', name: 'Silver', hex: '#c8ccd4', price: 0 },
  { id: 'gloss-black', name: 'Gloss Black', hex: '#1a1a1a', price: 2500 },
  { id: 'bronze', name: 'Bronze', hex: '#8b6914', price: 3500 },
]

export const WHEEL_SIZES: { size: WheelSize; price: number }[] = [
  { size: 18, price: 0 },
  { size: 19, price: 4000 },
  { size: 20, price: 7500 },
]
