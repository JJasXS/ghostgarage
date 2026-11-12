import { useMemo } from 'react'
import { Copy, Trash2, FolderOpen, Pencil } from 'lucide-react'
import { useGarageStore } from '@/store/useGarageStore'
import { VEHICLES } from '@/data/vehicles'
import { formatMYR } from '@/utils/pricing'
import { GlassButton } from '@/components/ui/GlassButton'
import type { SavedBuild } from '@/types'

export function SavedBuildsView() {
  const builds = useGarageStore((s) => s.builds)
  const loadBuild = useGarageStore((s) => s.loadBuild)
  const renameBuild = useGarageStore((s) => s.renameBuild)
  const duplicateBuild = useGarageStore((s) => s.duplicateBuild)
  const deleteBuild = useGarageStore((s) => s.deleteBuild)
  const compareIds = useGarageStore((s) => s.compareIds)
  const setCompare = useGarageStore((s) => s.setCompare)

  const [a, b] = compareIds
  const compareA = useMemo(() => builds.find((x) => x.id === a), [builds, a])
  const compareB = useMemo(() => builds.find((x) => x.id === b), [builds, b])

  return (
    <div className="mx-auto flex h-full max-w-5xl flex-col gap-4 overflow-y-auto p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Saved Builds</h1>
        <p className="text-sm text-gg-muted">Stored locally in your browser via localStorage.</p>
      </div>

      {builds.length === 0 && (
        <div className="glass-panel rounded-2xl p-8 text-center text-gg-muted">
          No saved builds yet. Configure a vehicle and tap Save.
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {builds.map((build) => {
          const vehicle = VEHICLES[build.configuration.vehicleId]
          return (
            <div key={build.id} className="glass-panel rounded-2xl p-4" data-testid="saved-build">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-medium text-gg-text">{build.name}</h3>
                  <p className="text-xs text-gg-muted">
                    {vehicle?.name} · {formatMYR(build.price)}
                  </p>
                  <p className="mt-1 text-[10px] text-gg-muted">
                    {new Date(build.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <GlassButton size="sm" onClick={() => loadBuild(build.id)}>
                  <FolderOpen size={12} className="mr-1 inline" /> Load
                </GlassButton>
                <GlassButton
                  size="sm"
                  onClick={() => {
                    const name = window.prompt('Rename build', build.name)
                    if (name) renameBuild(build.id, name)
                  }}
                >
                  <Pencil size={12} className="mr-1 inline" /> Rename
                </GlassButton>
                <GlassButton size="sm" onClick={() => duplicateBuild(build.id)}>
                  <Copy size={12} className="mr-1 inline" /> Duplicate
                </GlassButton>
                <GlassButton size="sm" onClick={() => deleteBuild(build.id)}>
                  <Trash2 size={12} className="mr-1 inline" /> Delete
                </GlassButton>
                <GlassButton
                  size="sm"
                  active={compareIds[0] === build.id}
                  onClick={() => setCompare(0, compareIds[0] === build.id ? null : build.id)}
                >
                  Compare A
                </GlassButton>
                <GlassButton
                  size="sm"
                  active={compareIds[1] === build.id}
                  onClick={() => setCompare(1, compareIds[1] === build.id ? null : build.id)}
                >
                  Compare B
                </GlassButton>
              </div>
            </div>
          )
        })}
      </div>

      {(compareA || compareB) && (
        <div className="glass-panel rounded-2xl p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-gg-silver">
            Compare builds
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <CompareCard title="Build A" build={compareA} />
            <CompareCard title="Build B" build={compareB} />
          </div>
        </div>
      )}
    </div>
  )
}

function CompareCard({ title, build }: { title: string; build: SavedBuild | undefined }) {
  if (!build) {
    return (
      <div className="rounded-xl border border-dashed border-gg-border p-4 text-sm text-gg-muted">
        {title}: select a build
      </div>
    )
  }
  const v = VEHICLES[build.configuration.vehicleId]
  return (
    <div className="rounded-xl border border-gg-border bg-white/5 p-4 text-sm">
      <div className="font-medium">
        {title}: {build.name}
      </div>
      <div className="mt-2 space-y-1 text-xs text-gg-muted">
        <div>Vehicle: {v?.name}</div>
        <div>Paint: {build.configuration.paintId}</div>
        <div>
          Wheels: {build.configuration.wheelStyle} / {build.configuration.wheelSize}&quot;
        </div>
        <div>Body: {build.configuration.body.kit}</div>
        <div>Performance: {build.configuration.performance}</div>
        <div className="text-gg-accent">{formatMYR(build.price)}</div>
      </div>
    </div>
  )
}
