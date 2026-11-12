import { useMemo } from 'react'
import * as THREE from 'three'
import type { WheelFinish, WheelSize, WheelStyle } from '@/types'

interface WheelAssemblyProps {
  position: [number, number, number]
  style: WheelStyle
  finish: WheelFinish
  size: WheelSize
  brakeColor?: string
}

const FINISH_COLORS: Record<WheelFinish, string> = {
  silver: '#c8ccd4',
  'gloss-black': '#1a1a1a',
  bronze: '#8b6914',
}

/** Scale rim diameter relative to 19" baseline. */
function sizeScale(size: WheelSize): number {
  return size / 19
}

export function WheelAssembly({
  position,
  style,
  finish,
  size,
  brakeColor = '#8b0000',
}: WheelAssemblyProps) {
  const s = sizeScale(size)
  const rimColor = FINISH_COLORS[finish]

  const spokes = useMemo(() => {
    if (style === 'classic-five') {
      return Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <mesh key={i} rotation={[0, 0, a]} position={[0, 0, 0.02]}>
            <boxGeometry args={[0.06 * s, 0.42 * s, 0.04 * s]} />
            <meshStandardMaterial color={rimColor} metalness={0.9} roughness={0.25} />
          </mesh>
        )
      })
    }
    if (style === 'multi-spoke') {
      return Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2
        return (
          <mesh key={i} rotation={[0, 0, a]} position={[0, 0, 0.02]}>
            <boxGeometry args={[0.035 * s, 0.44 * s, 0.03 * s]} />
            <meshStandardMaterial color={rimColor} metalness={0.92} roughness={0.2} />
          </mesh>
        )
      })
    }
    // Aero disc — solid cover with vents
    return (
      <>
        <mesh position={[0, 0, 0.03]}>
          <cylinderGeometry args={[0.38 * s, 0.38 * s, 0.04 * s, 32]} />
          <meshStandardMaterial color={rimColor} metalness={0.85} roughness={0.3} />
        </mesh>
        {Array.from({ length: 5 }, (_, i) => {
          const a = (i / 5) * Math.PI * 2
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.22 * s, Math.sin(a) * 0.22 * s, 0.055]}
              rotation={[Math.PI / 2, 0, a]}
            >
              <boxGeometry args={[0.08 * s, 0.02 * s, 0.14 * s]} />
              <meshStandardMaterial color="#111" metalness={0.4} roughness={0.5} />
            </mesh>
          )
        })}
      </>
    )
  }, [style, rimColor, s])

  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      {/* Tire */}
      <mesh castShadow>
        <torusGeometry args={[0.38 * s, 0.14 * s, 16, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.9} metalness={0.05} />
      </mesh>
      {/* Rim outer */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32 * s, 0.32 * s, 0.12 * s, 32]} />
        <meshStandardMaterial color={rimColor} metalness={0.9} roughness={0.22} />
      </mesh>
      {/* Hub */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.08 * s, 0.08 * s, 0.14 * s, 24]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.3} />
      </mesh>
      <group rotation={[Math.PI / 2, 0, 0]}>{spokes}</group>
      {/* Brake disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.02]}>
        <cylinderGeometry args={[0.22 * s, 0.22 * s, 0.02 * s, 32]} />
        <meshStandardMaterial color="#888" metalness={0.95} roughness={0.35} />
      </mesh>
      {/* Caliper */}
      <mesh position={[0, 0.16 * s, -0.02]}>
        <boxGeometry args={[0.12 * s, 0.08 * s, 0.06 * s]} />
        <meshStandardMaterial color={brakeColor} metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  )
}

export function getWheelPositions(
  track: number,
  wheelbase: number,
  y: number,
): [number, number, number][] {
  return [
    [-wheelbase / 2, y, track / 2],
    [-wheelbase / 2, y, -track / 2],
    [wheelbase / 2, y, track / 2],
    [wheelbase / 2, y, -track / 2],
  ]
}

/** Shared glass material helper */
export const glassProps = {
  color: '#88aacc',
  transparent: true,
  opacity: 0.35,
  roughness: 0.05,
  metalness: 0.1,
  side: THREE.DoubleSide,
} as const
