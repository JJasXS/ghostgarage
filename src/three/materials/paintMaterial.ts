import * as THREE from 'three'
import type { PaintFinish } from '@/types'

export function getPaintMaterialProps(
  hex: string,
  finish: PaintFinish,
): {
  color: string
  roughness: number
  metalness: number
  clearcoat: number
  clearcoatRoughness: number
} {
  switch (finish) {
    case 'matte':
      return {
        color: hex,
        roughness: 0.72,
        metalness: 0.15,
        clearcoat: 0.05,
        clearcoatRoughness: 0.6,
      }
    case 'metallic':
      return {
        color: hex,
        roughness: 0.28,
        metalness: 0.85,
        clearcoat: 0.9,
        clearcoatRoughness: 0.12,
      }
    case 'gloss':
    default:
      return {
        color: hex,
        roughness: 0.18,
        metalness: 0.35,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      }
  }
}

export function createPaintMaterial(hex: string, finish: PaintFinish): THREE.MeshPhysicalMaterial {
  const props = getPaintMaterialProps(hex, finish)
  return new THREE.MeshPhysicalMaterial({
    color: props.color,
    roughness: props.roughness,
    metalness: props.metalness,
    clearcoat: props.clearcoat,
    clearcoatRoughness: props.clearcoatRoughness,
  })
}
