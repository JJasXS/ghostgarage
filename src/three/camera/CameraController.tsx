import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { getInteriorTarget } from '@/three/vehicles/ProceduralCar'
import type { CameraPreset, VehicleId } from '@/types'

const PRESETS: Record<CameraPreset, { position: [number, number, number]; target?: [number, number, number] }> = {
  front: { position: [7, 1.8, 0] },
  rear: { position: [-7, 1.8, 0] },
  left: { position: [0, 1.6, 7] },
  right: { position: [0, 1.6, -7] },
  'front-three-quarter': { position: [5.5, 2.2, 4.5] },
  'rear-three-quarter': { position: [-5.5, 2.2, 4.5] },
  top: { position: [0.1, 10, 0.1] },
  interior: { position: [0.4, 1.35, 0.15], target: [1.2, 1.1, 0] },
}

interface CameraControllerProps {
  preset: CameraPreset | null
  nonce: number
  vehicleId: VehicleId
  reducedMotion: boolean
  onDragStart: () => void
  onDragEnd: () => void
}

export function CameraController({
  preset,
  nonce,
  vehicleId,
  reducedMotion,
  onDragStart,
  onDragEnd,
}: CameraControllerProps) {
  const controls = useRef<OrbitControlsImpl>(null)
  const { camera } = useThree()
  const animating = useRef(false)
  const startPos = useRef(new THREE.Vector3())
  const endPos = useRef(new THREE.Vector3())
  const startTarget = useRef(new THREE.Vector3())
  const endTarget = useRef(new THREE.Vector3())
  const progress = useRef(1)
  const lastNonce = useRef(nonce)

  useEffect(() => {
    if (nonce === lastNonce.current || !preset || !controls.current) return
    lastNonce.current = nonce

    const data = PRESETS[preset]
    startPos.current.copy(camera.position)
    endPos.current.set(...data.position)

    startTarget.current.copy(controls.current.target)
    if (preset === 'interior') {
      const t = getInteriorTarget(vehicleId)
      endTarget.current.set(t.x + 0.8, t.y, t.z)
      endPos.current.set(t.x - 0.3, t.y + 0.15, t.z + 0.1)
    } else if (data.target) {
      endTarget.current.set(...data.target)
    } else {
      endTarget.current.set(0, 0.8, 0)
    }

    if (reducedMotion) {
      camera.position.copy(endPos.current)
      controls.current.target.copy(endTarget.current)
      controls.current.update()
      return
    }

    progress.current = 0
    animating.current = true
  }, [nonce, preset, camera, vehicleId, reducedMotion])

  useFrame((_, delta) => {
    if (!animating.current || !controls.current) return
    progress.current = Math.min(1, progress.current + delta * 1.8)
    const t = 1 - Math.pow(1 - progress.current, 3)
    camera.position.lerpVectors(startPos.current, endPos.current, t)
    controls.current.target.lerpVectors(startTarget.current, endTarget.current, t)
    controls.current.update()
    if (progress.current >= 1) animating.current = false
  })

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={3}
      maxDistance={14}
      maxPolarAngle={Math.PI / 2.05}
      minPolarAngle={0.15}
      target={[0, 0.8, 0]}
      onStart={onDragStart}
      onEnd={onDragEnd}
    />
  )
}
