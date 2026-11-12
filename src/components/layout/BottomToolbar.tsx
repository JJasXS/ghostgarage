import {
  RotateCcw,
  Camera,
  Maximize2,
  Minimize2,
  CircleDot,
  ArrowLeft,
  ArrowRight,
  Eye,
} from 'lucide-react'
import { useGarageStore } from '@/store/useGarageStore'
import { GlassButton } from '@/components/ui/GlassButton'
import type { CameraPreset } from '@/types'

const PRESETS: { id: CameraPreset; label: string; icon?: typeof Eye }[] = [
  { id: 'front', label: 'Front' },
  { id: 'rear', label: 'Rear' },
  { id: 'left', label: 'Left', icon: ArrowLeft },
  { id: 'right', label: 'Right', icon: ArrowRight },
  { id: 'front-three-quarter', label: '¾ Front' },
  { id: 'rear-three-quarter', label: '¾ Rear' },
  { id: 'top', label: 'Top' },
  { id: 'interior', label: 'Interior', icon: Eye },
]

export function BottomToolbar() {
  const setCameraPreset = useGarageStore((s) => s.setCameraPreset)
  const resetCamera = useGarageStore((s) => s.resetCamera)
  const requestScreenshot = useGarageStore((s) => s.requestScreenshot)
  const autoRotate = useGarageStore((s) => s.configuration.autoRotate)
  const updateConfiguration = useGarageStore((s) => s.updateConfiguration)
  const fullscreen = useGarageStore((s) => s.settings.fullscreen)
  const updateSettings = useGarageStore((s) => s.updateSettings)
  const cameraPreset = useGarageStore((s) => s.cameraPreset)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen()
      updateSettings({ fullscreen: true })
    } else {
      void document.exitFullscreen()
      updateSettings({ fullscreen: false })
    }
  }

  return (
    <div className="glass-panel relative z-30 mx-auto mb-3 flex max-w-5xl flex-wrap items-center justify-center gap-1.5 px-3 py-2 md:mb-4">
      <GlassButton
        size="sm"
        active={autoRotate}
        onClick={() => updateConfiguration({ autoRotate: !autoRotate }, false)}
        title="Auto-rotate turntable"
      >
        <span className="flex items-center gap-1">
          <CircleDot size={12} /> Rotate
        </span>
      </GlassButton>

      {PRESETS.map((p) => (
        <GlassButton
          key={p.id}
          size="sm"
          active={cameraPreset === p.id}
          onClick={() => setCameraPreset(p.id)}
          title={p.label}
        >
          {p.label}
        </GlassButton>
      ))}

      <GlassButton size="sm" onClick={resetCamera} title="Reset camera">
        <span className="flex items-center gap-1">
          <RotateCcw size={12} /> Reset
        </span>
      </GlassButton>

      <GlassButton size="sm" onClick={requestScreenshot} title="Screenshot" data-testid="screenshot-btn">
        <span className="flex items-center gap-1">
          <Camera size={12} /> Shot
        </span>
      </GlassButton>

      <GlassButton size="sm" onClick={toggleFullscreen} title="Fullscreen showroom">
        {fullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
      </GlassButton>
    </div>
  )
}
