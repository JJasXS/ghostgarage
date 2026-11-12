import type { VehicleDefinition } from '@/types'

/** Fictional concept vehicles — not real production cars. */
export const VEHICLES: Record<string, VehicleDefinition> = {
  'ghost-gt': {
    id: 'ghost-gt',
    name: 'Ghost GT',
    category: 'Grand Touring Coupe',
    basePrice: 250_000,
    description:
      'A long-legged grand tourer with balanced proportions and refined presence. Conceptual showroom model.',
    specs: {
      horsepower: 450,
      torque: 580,
      acceleration: 4.2,
      topSpeed: 280,
      drivetrain: 'AWD',
      weight: 1780,
    },
  },
  'ghost-r': {
    id: 'ghost-r',
    name: 'Ghost R',
    category: 'Performance Sports Car',
    basePrice: 350_000,
    description:
      'A low, aggressive sports coupe focused on track-day theatre. Conceptual showroom model.',
    specs: {
      horsepower: 620,
      torque: 720,
      acceleration: 3.1,
      topSpeed: 320,
      drivetrain: 'RWD',
      weight: 1420,
    },
  },
  'ghost-x': {
    id: 'ghost-x',
    name: 'Ghost X',
    category: 'Luxury SUV',
    basePrice: 300_000,
    description:
      'An elevated luxury crossover with commanding stance and cabin presence. Conceptual showroom model.',
    specs: {
      horsepower: 480,
      torque: 650,
      acceleration: 4.8,
      topSpeed: 250,
      drivetrain: 'AWD',
      weight: 2150,
    },
  },
}

export const VEHICLE_LIST = Object.values(VEHICLES)
