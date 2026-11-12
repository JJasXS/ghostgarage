import { Save, Share2, Undo2, Redo2, RotateCcw } from 'lucide-react'
import { useGarageStore } from '@/store/useGarageStore'
import { VEHICLES } from '@/data/vehicles'
import { PAINTS } from '@/data/paints'
import { calculatePrice, formatMYR, getEffectiveSpecs } from '@/utils/pricing'
import { GlassButton } from '@/components/ui/GlassButton'

export function RightPanel() {
  const config = useGarageStore((s) => s.configuration)
  const saveCurrentBuild = useGarageStore((s) => s.saveCurrentBuild)
  const getShareUrl = useGarageStore((s) => s.getShareUrl)
  const setToast = useGarageStore((s) => s.setToast)
  const undo = useGarageStore((s) => s.undo)
  const redo = useGarageStore((s) => s.redo)
  const resetFactory = useGarageStore((s) => s.resetFactory)
  const historyIndex = useGarageStore((s) => s.historyIndex)
  const history = useGarageStore((s) => s.history)

  const vehicle = VEHICLES[config.vehicleId]
  const paint = PAINTS.find((p) => p.id === config.paintId)
  const breakdown = calculatePrice(config)
  const specs = getEffectiveSpecs(config)

  const share = async () => {
    const url = getShareUrl()
    try {
      await navigator.clipboard.writeText(url)
      setToast('Share link copied to clipboard')
    } catch {
      setToast(url)
    }
  }

  return (
    <aside
      className="glass-panel flex h-full w-full flex-col overflow-hidden md:w-72 lg:w-80"
      data-testid="right-panel"
    >
      <div className="border-b border-gg-border p-4">
        <div className="text-[10px] uppercase tracking-[0.25em] text-gg-silver">Selected</div>
        <h2 className="mt-1 text-xl font-semibold text-gg-text">{vehicle.name}</h2>
        <p className="text-xs text-gg-muted">{vehicle.category}</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div className="space-y-1 text-sm">
          <Row label="Paint" value={`${paint?.name ?? '—'} · ${config.paintFinish}`} />
          <Row label="Wheels" value={`${config.wheelStyle} · ${config.wheelSize}"`} />
          <Row label="Body kit" value={config.body.kit} />
          <Row label="Performance" value={config.performance} />
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-gg-silver">
            Specs (simulated)
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Stat label="HP" value={`${specs.horsepower}`} />
            <Stat label="Torque" value={`${specs.torque} Nm`} />
            <Stat label="0–100" value={`${specs.acceleration}s`} />
            <Stat label="Top" value={`${specs.topSpeed} km/h`} />
            <Stat label="Drive" value={specs.drivetrain} />
            <Stat label="Weight" value={`${specs.weight} kg`} />
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-gg-silver">
            Estimated price (fictional)
          </h3>
          <div className="space-y-1 text-xs text-gg-muted">
            <Row label="Base" value={formatMYR(breakdown.base)} />
            <Row label="Paint" value={formatMYR(breakdown.paint + breakdown.paintFinish)} />
            <Row label="Wheels" value={formatMYR(breakdown.wheels)} />
            <Row label="Body" value={formatMYR(breakdown.bodyKit + breakdown.bodyExtras)} />
            <Row label="Performance" value={formatMYR(breakdown.performance)} />
          </div>
          <div className="mt-3 flex items-baseline justify-between border-t border-gg-border pt-3">
            <span className="text-xs uppercase tracking-wide text-gg-silver">Total</span>
            <span className="text-lg font-semibold text-gg-accent" data-testid="total-price">
              {formatMYR(breakdown.total)}
            </span>
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-gg-muted">
            Prices are fictional portfolio figures in Malaysian Ringgit and are not real quotations.
          </p>
        </div>
      </div>

      <div className="space-y-2 border-t border-gg-border p-3">
        <div className="flex gap-2">
          <GlassButton
            size="sm"
            className="flex-1"
            onClick={() => undo()}
            disabled={historyIndex <= 0}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={14} className="mx-auto" />
          </GlassButton>
          <GlassButton
            size="sm"
            className="flex-1"
            onClick={() => redo()}
            disabled={historyIndex >= history.length - 1}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={14} className="mx-auto" />
          </GlassButton>
          <GlassButton size="sm" className="flex-1" onClick={() => resetFactory()} title="Factory reset">
            <RotateCcw size={14} className="mx-auto" />
          </GlassButton>
        </div>
        <GlassButton
          className="flex w-full items-center justify-center gap-2"
          onClick={() => {
            const name = window.prompt('Name this build', `${vehicle.name} Build`)
            if (name !== null) saveCurrentBuild(name)
          }}
          data-testid="save-build-btn"
        >
          <Save size={14} /> Save configuration
        </GlassButton>
        <GlassButton className="flex w-full items-center justify-center gap-2" onClick={() => void share()}>
          <Share2 size={14} /> Share build URL
        </GlassButton>
      </div>
    </aside>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-gg-muted">{label}</span>
      <span className="text-right text-gg-text capitalize">{value}</span>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gg-border bg-white/5 px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-wide text-gg-muted">{label}</div>
      <div className="text-sm text-gg-text">{value}</div>
    </div>
  )
}
