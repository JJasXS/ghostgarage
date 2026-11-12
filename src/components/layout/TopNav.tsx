import { Car, Settings, Info, FolderOpen, Wrench, Ghost } from 'lucide-react'
import { useGarageStore } from '@/store/useGarageStore'
import type { AppView } from '@/types'

const LINKS: { id: AppView; label: string; icon: typeof Car }[] = [
  { id: 'garage', label: 'Garage', icon: Car },
  { id: 'configure', label: 'Configure', icon: Wrench },
  { id: 'saved', label: 'Saved Builds', icon: FolderOpen },
  { id: 'about', label: 'About', icon: Info },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function TopNav() {
  const view = useGarageStore((s) => s.view)
  const setView = useGarageStore((s) => s.setView)

  return (
    <header className="glass-panel relative z-30 flex h-14 shrink-0 items-center justify-between px-4 md:px-6">
      <button
        type="button"
        className="flex items-center gap-2 text-left"
        onClick={() => setView('configure')}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gg-accent/20 text-gg-accent">
          <Ghost size={18} />
        </div>
        <div>
          <div className="text-sm font-semibold tracking-wide text-gg-text">GhostGarage</div>
          <div className="hidden text-[10px] uppercase tracking-[0.2em] text-gg-silver sm:block">
            Concept Showroom
          </div>
        </div>
      </button>

      <nav className="flex items-center gap-1 overflow-x-auto">
        {LINKS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setView(id)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors md:px-3 md:text-sm ${
              view === id
                ? 'bg-gg-accent/15 text-gg-accent'
                : 'text-gg-muted hover:bg-white/5 hover:text-gg-text'
            }`}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </nav>
    </header>
  )
}
