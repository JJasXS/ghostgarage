import { useMemo } from 'react'
import * as THREE from 'three'
import { PAINTS } from '@/data/paints'
import { getPaintMaterialProps } from '@/three/materials/paintMaterial'
import { WheelAssembly, getWheelPositions, glassProps } from './WheelAssembly'
import type { VehicleConfiguration, VehicleId } from '@/types'

interface ProceduralCarProps {
  config: VehicleConfiguration
  onDoubleClick?: () => void
}

interface Dims {
  length: number
  width: number
  height: number
  wheelbase: number
  track: number
  ride: number
  cabinLength: number
  cabinHeight: number
  cabinOffset: number
  hoodLength: number
  trunkLength: number
  suv?: boolean
}

const DIMS: Record<VehicleId, Dims> = {
  'ghost-gt': {
    length: 4.6,
    width: 1.9,
    height: 0.55,
    wheelbase: 2.75,
    track: 1.55,
    ride: 0.38,
    cabinLength: 1.7,
    cabinHeight: 0.45,
    cabinOffset: 0.1,
    hoodLength: 1.35,
    trunkLength: 0.9,
  },
  'ghost-r': {
    length: 4.3,
    width: 1.95,
    height: 0.48,
    wheelbase: 2.55,
    track: 1.6,
    ride: 0.32,
    cabinLength: 1.45,
    cabinHeight: 0.38,
    cabinOffset: -0.15,
    hoodLength: 1.5,
    trunkLength: 0.7,
  },
  'ghost-x': {
    length: 4.9,
    width: 2.05,
    height: 0.75,
    wheelbase: 2.95,
    track: 1.7,
    ride: 0.55,
    cabinLength: 2.2,
    cabinHeight: 0.7,
    cabinOffset: 0.05,
    hoodLength: 1.2,
    trunkLength: 1.0,
    suv: true,
  },
}

function BodyPaint({
  config,
  children,
}: {
  config: VehicleConfiguration
  children: React.ReactNode
}) {
  const paint = PAINTS.find((p) => p.id === config.paintId) ?? PAINTS[0]
  const props = getPaintMaterialProps(paint.hex, config.paintFinish)
  return (
    <mesh castShadow receiveShadow>
      {children}
      <meshPhysicalMaterial
        color={props.color}
        roughness={props.roughness}
        metalness={props.metalness}
        clearcoat={props.clearcoat}
        clearcoatRoughness={props.clearcoatRoughness}
      />
    </mesh>
  )
}

function CarbonMaterial() {
  return <meshStandardMaterial color="#1a1a1a" roughness={0.45} metalness={0.7} />
}

export function ProceduralCar({ config, onDoubleClick }: ProceduralCarProps) {
  const d = DIMS[config.vehicleId]
  const kit = config.body.kit
  const rideDrop = config.performance === 'track' ? 0.04 : config.performance === 'sport' ? 0.02 : 0
  const wheelY = d.ride - rideDrop
  const brakeColor =
    config.performance === 'track' ? '#ff2222' : config.performance === 'sport' ? '#cc3300' : '#8b0000'

  const wheelPositions = useMemo(
    () => getWheelPositions(d.track, d.wheelbase, wheelY),
    [d.track, d.wheelbase, wheelY],
  )

  const spoilerScale = kit === 'track' || config.body.rearSpoiler ? 1 : kit === 'sport' ? 0.7 : 0
  const splitter =
    kit !== 'standard' || config.body.frontSplitter
      ? kit === 'track' || config.body.frontSplitter
        ? 1
        : 0.6
      : 0
  const diffuser =
    kit !== 'standard' || config.body.rearDiffuser
      ? kit === 'track' || config.body.rearDiffuser
        ? 1
        : 0.55
      : 0
  const skirts = kit !== 'standard' || config.body.sideSkirts

  const bodyY = wheelY + 0.14 * (config.wheelSize / 19)

  return (
    <group
      position={[0, -rideDrop, 0]}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onDoubleClick?.()
      }}
    >
      {/* Main body */}
      <group position={[0, bodyY, 0]}>
        {/* Lower body / rocker */}
        <BodyPaint config={config}>
          <boxGeometry args={[d.length, d.height * 0.55, d.width]} />
        </BodyPaint>

        {/* Hood */}
        <group position={[d.length / 2 - d.hoodLength / 2 - 0.05, d.height * 0.28, 0]}>
          <BodyPaint config={config}>
            <boxGeometry args={[d.hoodLength, 0.08, d.width * 0.92]} />
          </BodyPaint>
        </group>

        {/* Cabin / greenhouse */}
        <group position={[d.cabinOffset, d.height * 0.55, 0]}>
          {config.body.carbonRoof ? (
            <mesh castShadow>
              <boxGeometry args={[d.cabinLength, d.cabinHeight, d.width * 0.82]} />
              <CarbonMaterial />
            </mesh>
          ) : (
            <BodyPaint config={config}>
              <boxGeometry args={[d.cabinLength, d.cabinHeight, d.width * 0.82]} />
            </BodyPaint>
          )}
          {/* Windshield */}
          <mesh position={[d.cabinLength * 0.35, 0.05, 0]} rotation={[0, 0, -0.35]}>
            <boxGeometry args={[0.55, d.cabinHeight * 0.85, d.width * 0.78]} />
            <meshPhysicalMaterial {...glassProps} />
          </mesh>
          {/* Rear glass */}
          <mesh position={[-d.cabinLength * 0.35, 0.02, 0]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.45, d.cabinHeight * 0.8, d.width * 0.78]} />
            <meshPhysicalMaterial {...glassProps} />
          </mesh>
          {/* Side windows */}
          <mesh position={[0, 0.05, d.width * 0.41]}>
            <boxGeometry args={[d.cabinLength * 0.7, d.cabinHeight * 0.55, 0.02]} />
            <meshPhysicalMaterial {...glassProps} />
          </mesh>
          <mesh position={[0, 0.05, -d.width * 0.41]}>
            <boxGeometry args={[d.cabinLength * 0.7, d.cabinHeight * 0.55, 0.02]} />
            <meshPhysicalMaterial {...glassProps} />
          </mesh>
        </group>

        {/* Trunk */}
        <group position={[-d.length / 2 + d.trunkLength / 2 + 0.05, d.height * 0.22, 0]}>
          <BodyPaint config={config}>
            <boxGeometry args={[d.trunkLength, 0.12, d.width * 0.9]} />
          </BodyPaint>
        </group>

        {/* Doors hint lines */}
        <mesh position={[0.15, d.height * 0.1, d.width / 2 + 0.01]}>
          <boxGeometry args={[1.1, d.height * 0.35, 0.01]} />
          <meshStandardMaterial color="#222" roughness={0.6} metalness={0.3} />
        </mesh>
        <mesh position={[0.15, d.height * 0.1, -d.width / 2 - 0.01]}>
          <boxGeometry args={[1.1, d.height * 0.35, 0.01]} />
          <meshStandardMaterial color="#222" roughness={0.6} metalness={0.3} />
        </mesh>

        {/* Grille */}
        <mesh position={[d.length / 2 + 0.02, d.height * 0.05, 0]}>
          <boxGeometry args={[0.06, 0.22, d.width * 0.55]} />
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.4} />
        </mesh>

        {/* Headlights */}
        <mesh position={[d.length / 2 + 0.01, d.height * 0.18, d.width * 0.32]}>
          <boxGeometry args={[0.08, 0.1, 0.28]} />
          <meshStandardMaterial
            color={config.lighting.headlights ? '#ffffee' : '#ddeeff'}
            emissive={config.lighting.headlights ? '#ffffcc' : '#000000'}
            emissiveIntensity={config.lighting.headlights ? 2.5 : 0}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>
        <mesh position={[d.length / 2 + 0.01, d.height * 0.18, -d.width * 0.32]}>
          <boxGeometry args={[0.08, 0.1, 0.28]} />
          <meshStandardMaterial
            color={config.lighting.headlights ? '#ffffee' : '#ddeeff'}
            emissive={config.lighting.headlights ? '#ffffcc' : '#000000'}
            emissiveIntensity={config.lighting.headlights ? 2.5 : 0}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>
        {config.lighting.headlights && (
          <>
            <pointLight
              position={[d.length / 2 + 0.4, d.height * 0.2, d.width * 0.32]}
              intensity={8}
              distance={12}
              color="#fff5dd"
            />
            <pointLight
              position={[d.length / 2 + 0.4, d.height * 0.2, -d.width * 0.32]}
              intensity={8}
              distance={12}
              color="#fff5dd"
            />
          </>
        )}

        {/* Taillights */}
        <mesh position={[-d.length / 2 - 0.01, d.height * 0.2, d.width * 0.3]}>
          <boxGeometry args={[0.06, 0.1, 0.35]} />
          <meshStandardMaterial
            color="#aa0000"
            emissive={config.lighting.taillights ? '#ff0000' : '#220000'}
            emissiveIntensity={config.lighting.taillights ? 2 : 0.2}
          />
        </mesh>
        <mesh position={[-d.length / 2 - 0.01, d.height * 0.2, -d.width * 0.3]}>
          <boxGeometry args={[0.06, 0.1, 0.35]} />
          <meshStandardMaterial
            color="#aa0000"
            emissive={config.lighting.taillights ? '#ff0000' : '#220000'}
            emissiveIntensity={config.lighting.taillights ? 2 : 0.2}
          />
        </mesh>

        {/* Mirrors */}
        <mesh position={[0.55, d.height * 0.45, d.width * 0.48]}>
          <boxGeometry args={[0.18, 0.08, 0.12]} />
          <meshStandardMaterial color="#222" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.55, d.height * 0.45, -d.width * 0.48]}>
          <boxGeometry args={[0.18, 0.08, 0.12]} />
          <meshStandardMaterial color="#222" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Wheel arches (fenders) */}
        {[
          [d.wheelbase / 2, 0, d.track / 2],
          [d.wheelbase / 2, 0, -d.track / 2],
          [-d.wheelbase / 2, 0, d.track / 2],
          [-d.wheelbase / 2, 0, -d.track / 2],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <torusGeometry args={[0.42, 0.08, 8, 16, Math.PI]} />
            <meshPhysicalMaterial
              color={PAINTS.find((p) => p.id === config.paintId)?.hex ?? '#1a7cff'}
              roughness={getPaintMaterialProps(
                PAINTS.find((p) => p.id === config.paintId)?.hex ?? '#1a7cff',
                config.paintFinish,
              ).roughness}
              metalness={0.4}
            />
          </mesh>
        ))}

        {/* Front splitter */}
        {splitter > 0 && (
          <mesh position={[d.length / 2 + 0.08, -d.height * 0.2, 0]} scale={[1, 1, splitter]}>
            <boxGeometry args={[0.25, 0.03, d.width * 0.95]} />
            <meshStandardMaterial color="#111" roughness={0.5} metalness={0.4} />
          </mesh>
        )}

        {/* Rear diffuser */}
        {diffuser > 0 && (
          <mesh position={[-d.length / 2 - 0.05, -d.height * 0.22, 0]} scale={[1, 1, diffuser]}>
            <boxGeometry args={[0.3, 0.08, d.width * 0.7]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.6} metalness={0.3} />
          </mesh>
        )}

        {/* Side skirts */}
        {skirts && (
          <>
            <mesh position={[0, -d.height * 0.2, d.width / 2 + 0.02]}>
              <boxGeometry args={[d.length * 0.7, 0.06, 0.06]} />
              <meshStandardMaterial color="#111" roughness={0.5} metalness={0.4} />
            </mesh>
            <mesh position={[0, -d.height * 0.2, -d.width / 2 - 0.02]}>
              <boxGeometry args={[d.length * 0.7, 0.06, 0.06]} />
              <meshStandardMaterial color="#111" roughness={0.5} metalness={0.4} />
            </mesh>
          </>
        )}

        {/* Spoiler */}
        {spoilerScale > 0 && (
          <group
            position={[-d.length / 2 + 0.15, d.height * 0.55 + (d.suv ? 0.35 : 0.15), 0]}
            scale={[spoilerScale, spoilerScale, spoilerScale]}
          >
            <mesh>
              <boxGeometry args={[0.12, 0.04, d.width * 0.75]} />
              <meshStandardMaterial color="#111" roughness={0.4} metalness={0.5} />
            </mesh>
            <mesh position={[0, -0.08, d.width * 0.28]}>
              <boxGeometry args={[0.04, 0.12, 0.04]} />
              <meshStandardMaterial color="#111" roughness={0.4} metalness={0.5} />
            </mesh>
            <mesh position={[0, -0.08, -d.width * 0.28]}>
              <boxGeometry args={[0.04, 0.12, 0.04]} />
              <meshStandardMaterial color="#111" roughness={0.4} metalness={0.5} />
            </mesh>
          </group>
        )}

        {/* Ghost R accent stripe */}
        {config.vehicleId === 'ghost-r' && (
          <mesh position={[0.2, d.height * 0.32, 0]}>
            <boxGeometry args={[d.length * 0.6, 0.02, 0.12]} />
            <meshStandardMaterial color="#3b9eff" emissive="#1a5cff" emissiveIntensity={0.4} />
          </mesh>
        )}

        {/* Ghost X roof rails */}
        {config.vehicleId === 'ghost-x' && (
          <>
            <mesh position={[0, d.height * 0.55 + d.cabinHeight * 0.55, d.width * 0.28]}>
              <boxGeometry args={[d.cabinLength * 0.9, 0.04, 0.04]} />
              <meshStandardMaterial color="#333" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, d.height * 0.55 + d.cabinHeight * 0.55, -d.width * 0.28]}>
              <boxGeometry args={[d.cabinLength * 0.9, 0.04, 0.04]} />
              <meshStandardMaterial color="#333" metalness={0.8} roughness={0.3} />
            </mesh>
          </>
        )}
      </group>

      {/* Wheels */}
      {wheelPositions.map((pos, i) => (
        <WheelAssembly
          key={i}
          position={pos}
          style={config.wheelStyle}
          finish={config.wheelFinish}
          size={config.wheelSize}
          brakeColor={brakeColor}
        />
      ))}
    </group>
  )
}

/** Interior camera target for Ghost models */
export function getInteriorTarget(vehicleId: VehicleId): THREE.Vector3 {
  const d = DIMS[vehicleId]
  return new THREE.Vector3(d.cabinOffset, d.ride + d.height * 0.7, 0)
}

export function getVehicleBounds(vehicleId: VehicleId) {
  return DIMS[vehicleId]
}
