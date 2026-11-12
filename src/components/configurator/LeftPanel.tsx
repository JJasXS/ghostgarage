import { useGarageStore } from '@/store/useGarageStore'
import { VEHICLE_LIST } from '@/data/vehicles'
import { PAINTS, PAINT_FINISH_LABELS } from '@/data/paints'
import { WHEEL_STYLES, WHEEL_FINISHES, WHEEL_SIZES } from '@/data/wheels'
import { GlassButton } from '@/components/ui/GlassButton'
import type { ConfiguratorSection, PaintFinish, PerformancePackage } from '@/types'

const SECTIONS: { id: ConfiguratorSection; label: string }[] = [
  { id: 'vehicle', label: 'Vehicle' },
  { id: 'paint', label: 'Paint' },
  { id: 'wheels', label: 'Wheels' },
  { id: 'body', label: 'Body Kit' },
  { id: 'lighting', label: 'Lighting' },
  { id: 'interior', label: 'Interior' },
  { id: 'performance', label: 'Performance' },
]

export function LeftPanel() {
  const section = useGarageStore((s) => s.section)
  const setSection = useGarageStore((s) => s.setSection)
  const config = useGarageStore((s) => s.configuration)
  const updateConfiguration = useGarageStore((s) => s.updateConfiguration)
  const updateBody = useGarageStore((s) => s.updateBody)
  const updateLighting = useGarageStore((s) => s.updateLighting)

  return (
    <aside
      className="glass-panel flex h-full w-full flex-col overflow-hidden md:w-72 lg:w-80"
      data-testid="left-panel"
    >
      <div className="flex gap-1 overflow-x-auto border-b border-gg-border p-2">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSection(s.id)}
            className={`shrink-0 rounded-md px-2 py-1 text-[11px] uppercase tracking-wide ${
              section === s.id
                ? 'bg-gg-accent/20 text-gg-accent'
                : 'text-gg-muted hover:text-gg-text'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {section === 'vehicle' && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gg-silver">
              Select Model
            </h3>
            {VEHICLE_LIST.map((v) => (
              <button
                key={v.id}
                type="button"
                data-testid={`vehicle-${v.id}`}
                onClick={() => updateConfiguration({ vehicleId: v.id })}
                className={`w-full rounded-xl border p-3 text-left transition-colors ${
                  config.vehicleId === v.id
                    ? 'border-gg-accent bg-gg-accent/10'
                    : 'border-gg-border bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="text-sm font-medium text-gg-text">{v.name}</div>
                <div className="text-xs text-gg-muted">{v.category}</div>
              </button>
            ))}
            <p className="text-[11px] leading-relaxed text-gg-muted">
              Conceptual procedural models for portfolio demonstration — not production vehicle
              geometry.
            </p>
          </div>
        )}

        {section === 'paint' && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gg-silver">
              Exterior Paint
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {PAINTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  title={p.name}
                  data-testid={`paint-${p.id}`}
                  onClick={() => updateConfiguration({ paintId: p.id })}
                  className={`h-10 w-10 rounded-full border-2 transition-transform hover:scale-110 ${
                    config.paintId === p.id ? 'border-gg-accent ring-2 ring-gg-accent/40' : 'border-white/20'
                  }`}
                  style={{ backgroundColor: p.hex }}
                />
              ))}
            </div>
            <div className="text-sm text-gg-text">
              {PAINTS.find((p) => p.id === config.paintId)?.name}
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PAINT_FINISH_LABELS) as PaintFinish[]).map((f) => (
                <GlassButton
                  key={f}
                  size="sm"
                  active={config.paintFinish === f}
                  onClick={() => updateConfiguration({ paintFinish: f })}
                >
                  {PAINT_FINISH_LABELS[f]}
                </GlassButton>
              ))}
            </div>
          </div>
        )}

        {section === 'wheels' && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gg-silver">
              Wheel Style
            </h3>
            <div className="space-y-2">
              {WHEEL_STYLES.map((w) => (
                <GlassButton
                  key={w.id}
                  className="w-full text-left"
                  active={config.wheelStyle === w.id}
                  onClick={() => updateConfiguration({ wheelStyle: w.id })}
                >
                  {w.name}
                </GlassButton>
              ))}
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gg-silver">Finish</h3>
            <div className="flex flex-wrap gap-2">
              {WHEEL_FINISHES.map((f) => (
                <GlassButton
                  key={f.id}
                  size="sm"
                  active={config.wheelFinish === f.id}
                  onClick={() => updateConfiguration({ wheelFinish: f.id })}
                >
                  {f.name}
                </GlassButton>
              ))}
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gg-silver">Size</h3>
            <div className="flex gap-2">
              {WHEEL_SIZES.map((s) => (
                <GlassButton
                  key={s.size}
                  size="sm"
                  active={config.wheelSize === s.size}
                  onClick={() => updateConfiguration({ wheelSize: s.size })}
                >
                  {s.size}&quot;
                </GlassButton>
              ))}
            </div>
          </div>
        )}

        {section === 'body' && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gg-silver">
              Body Kit
            </h3>
            <div className="flex flex-wrap gap-2">
              {(['standard', 'sport', 'track'] as const).map((kit) => (
                <GlassButton
                  key={kit}
                  size="sm"
                  active={config.body.kit === kit}
                  onClick={() => updateBody({ kit })}
                >
                  {kit.charAt(0).toUpperCase() + kit.slice(1)}
                </GlassButton>
              ))}
            </div>
            <div className="space-y-2">
              {(
                [
                  ['frontSplitter', 'Front splitter'],
                  ['rearDiffuser', 'Rear diffuser'],
                  ['sideSkirts', 'Side skirts'],
                  ['rearSpoiler', 'Rear spoiler'],
                  ['carbonRoof', 'Carbon-look roof'],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-gg-border bg-white/5 px-3 py-2 text-sm"
                >
                  <span>{label}</span>
                  <input
                    type="checkbox"
                    checked={config.body[key]}
                    onChange={(e) => updateBody({ [key]: e.target.checked })}
                    className="accent-gg-accent"
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        {section === 'lighting' && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gg-silver">
              Vehicle Lights
            </h3>
            {(
              [
                ['headlights', 'Headlights'],
                ['taillights', 'Taillights'],
                ['ambient', 'Ambient showroom'],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center justify-between rounded-lg border border-gg-border bg-white/5 px-3 py-2 text-sm"
              >
                <span>{label}</span>
                <input
                  type="checkbox"
                  checked={config.lighting[key]}
                  onChange={(e) => updateLighting({ [key]: e.target.checked })}
                  className="accent-gg-accent"
                />
              </label>
            ))}
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gg-silver">
              Environment
            </h3>
            <div className="flex flex-wrap gap-2">
              {(['day', 'night', 'studio'] as const).map((mode) => (
                <GlassButton
                  key={mode}
                  size="sm"
                  active={config.lighting.mode === mode}
                  onClick={() => updateLighting({ mode })}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </GlassButton>
              ))}
            </div>
          </div>
        )}

        {section === 'interior' && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gg-silver">
              Interior View
            </h3>
            <p className="text-sm leading-relaxed text-gg-muted">
              These concept models include a greenhouse cabin. Use the Interior camera preset to
              peek inside. Detailed cabin materials are not modeled in this portfolio MVP.
            </p>
            <GlassButton
              onClick={() => useGarageStore.getState().setCameraPreset('interior')}
            >
              Jump to interior camera
            </GlassButton>
          </div>
        )}

        {section === 'performance' && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gg-silver">
              Simulated Packages
            </h3>
            <p className="text-[11px] text-gg-muted">
              Fictional upgrades for demonstration only — not real vehicle performance claims.
            </p>
            {(
              [
                ['standard', 'Standard', 'Factory configuration'],
                ['sport', 'Sport', '+HP, sport suspension'],
                ['track', 'Track', 'Max HP, track suspension & brakes'],
              ] as [PerformancePackage, string, string][]
            ).map(([id, name, desc]) => (
              <button
                key={id}
                type="button"
                onClick={() => updateConfiguration({ performance: id })}
                className={`w-full rounded-xl border p-3 text-left ${
                  config.performance === id
                    ? 'border-gg-accent bg-gg-accent/10'
                    : 'border-gg-border bg-white/5'
                }`}
              >
                <div className="text-sm font-medium">{name}</div>
                <div className="text-xs text-gg-muted">{desc}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
