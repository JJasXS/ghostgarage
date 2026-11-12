import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { ProceduralCar } from '@/three/vehicles/ProceduralCar'
import { Platform } from './Platform'
import { ShowroomLights } from '@/three/lighting/ShowroomLights'
import { CameraController } from '@/three/camera/CameraController'
import { useGarageStore } from '@/store/useGarageStore'

function AutoRotateGroup({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null)
  const autoRotate = useGarageStore((s) => s.configuration.autoRotate)
  const isDragging = useGarageStore((s) => s.isDraggingCamera)
  const reducedMotion = useGarageStore((s) => s.settings.reducedMotion)

  useFrame((_, delta) => {
    if (!group.current || !autoRotate || isDragging || reducedMotion) return
    group.current.rotation.y += delta * 0.35
  })

  return <group ref={group}>{children}</group>
}

function ScreenshotCapture() {
  const { gl, scene, camera } = useThree()
  const requestId = useGarageStore((s) => s.screenshotRequestId)
  const lastId = useRef(0)
  const setToast = useGarageStore((s) => s.setToast)

  useEffect(() => {
    if (requestId === 0 || requestId === lastId.current) return
    lastId.current = requestId

    // Hide nothing in canvas — UI is outside Canvas
    gl.render(scene, camera)
    const dataUrl = gl.domElement.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `ghostgarage-${Date.now()}.png`
    link.href = dataUrl
    link.click()
    setToast('Screenshot downloaded')
  }, [requestId, gl, scene, camera, setToast])

  return null
}

function FpsOverlay() {
  const developerMode = useGarageStore((s) => s.settings.developerMode)
  const { gl } = useThree()
  const frames = useRef(0)
  const last = useRef(performance.now())
  const el = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!developerMode) {
      el.current?.remove()
      el.current = null
      return
    }
    const div = document.createElement('div')
    div.style.cssText =
      'position:fixed;bottom:8px;left:8px;z-index:80;font:11px monospace;color:#3b9eff;background:rgba(0,0,0,.55);padding:4px 8px;border-radius:4px;pointer-events:none'
    div.textContent = 'FPS —'
    document.body.appendChild(div)
    el.current = div
    return () => div.remove()
  }, [developerMode])

  useFrame(() => {
    if (!developerMode || !el.current) return
    frames.current++
    const now = performance.now()
    if (now - last.current >= 500) {
      const fps = Math.round((frames.current * 1000) / (now - last.current))
      el.current.textContent = `FPS ${fps} · ${gl.info.render.calls} calls`
      frames.current = 0
      last.current = now
    }
  })

  return null
}

function SceneContent() {
  const configuration = useGarageStore((s) => s.configuration)
  const cameraPreset = useGarageStore((s) => s.cameraPreset)
  const cameraNonce = useGarageStore((s) => s.cameraNonce)
  const reducedMotion = useGarageStore((s) => s.settings.reducedMotion)
  const resetCamera = useGarageStore((s) => s.resetCamera)
  const setDraggingCamera = useGarageStore((s) => s.setDraggingCamera)
  const setLoading = useGarageStore((s) => s.setLoading)

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 600)
    return () => window.clearTimeout(t)
  }, [setLoading])

  return (
    <>
      <color attach="background" args={['#0a0a0c']} />
      <fog attach="fog" args={['#0a0a0c', 18, 40]} />
      <ShowroomLights lighting={configuration.lighting} />
      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={0.35} />
      </Suspense>
      <Platform />
      <ContactShadows position={[0, 0.02, 0]} opacity={0.55} scale={12} blur={2.5} far={4} />
      <AutoRotateGroup>
        <ProceduralCar config={configuration} onDoubleClick={resetCamera} />
      </AutoRotateGroup>
      <CameraController
        preset={cameraPreset}
        nonce={cameraNonce}
        vehicleId={configuration.vehicleId}
        reducedMotion={reducedMotion}
        onDragStart={() => setDraggingCamera(true)}
        onDragEnd={() => setDraggingCamera(false)}
      />
      <ScreenshotCapture />
      <FpsOverlay />
    </>
  )
}

function WebGLFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gg-bg p-8 text-center">
      <div className="max-w-md space-y-3">
        <h2 className="text-xl font-semibold text-gg-text">WebGL unavailable</h2>
        <p className="text-sm text-gg-muted">
          GhostGarage needs a WebGL-capable browser and GPU to render the 3D showroom. Try updating
          your graphics drivers or enabling hardware acceleration.
        </p>
      </div>
    </div>
  )
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export function ShowroomScene() {
  if (typeof window !== 'undefined' && !detectWebGL()) {
    return <WebGLFallback />
  }

  return (
    <div className="h-full w-full" data-testid="showroom-canvas">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [5.5, 2.2, 4.5], fov: 42, near: 0.1, far: 80 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
          preserveDrawingBuffer: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0a0a0c')
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  )
}
