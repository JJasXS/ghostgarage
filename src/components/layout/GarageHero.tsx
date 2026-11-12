import { useGarageStore } from '@/store/useGarageStore'
import { GlassButton } from '@/components/ui/GlassButton'

export function GarageHero() {
  const setView = useGarageStore((s) => s.setView)

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="text-[10px] uppercase tracking-[0.4em] text-gg-silver">Welcome</div>
      <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-gg-text md:text-5xl">
        GhostGarage
      </h1>
      <p className="max-w-md text-sm leading-relaxed text-gg-muted">
        A fictional premium 3D concept car showroom. Configure paint, wheels, aero, and performance —
        then save and share your builds.
      </p>
      <GlassButton onClick={() => setView('configure')} className="px-6">
        Enter showroom
      </GlassButton>
    </div>
  )
}
