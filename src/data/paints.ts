import type { PaintFinish, PaintOption } from '@/types'

export const PAINTS: PaintOption[] = [
  { id: 'midnight-black', name: 'Midnight Black', hex: '#0d0d0f', price: 0 },
  { id: 'pearl-white', name: 'Pearl White', hex: '#f2f2f0', price: 4500 },
  { id: 'racing-red', name: 'Racing Red', hex: '#c41e3a', price: 6500 },
  { id: 'electric-blue', name: 'Electric Blue', hex: '#1a7cff', price: 7500 },
  { id: 'titanium-silver', name: 'Titanium Silver', hex: '#b8bcc4', price: 5500 },
  { id: 'emerald-green', name: 'Emerald Green', hex: '#0d6b4c', price: 8000 },
  { id: 'sunset-orange', name: 'Sunset Orange', hex: '#e85d04', price: 7000 },
  { id: 'royal-purple', name: 'Royal Purple', hex: '#5b2c8a', price: 8500 },
]

export const PAINT_FINISH_PRICES: Record<PaintFinish, number> = {
  gloss: 0,
  matte: 3500,
  metallic: 5000,
}

export const PAINT_FINISH_LABELS: Record<PaintFinish, string> = {
  gloss: 'Gloss',
  matte: 'Matte',
  metallic: 'Metallic',
}
