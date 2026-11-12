import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { LeftPanel } from './LeftPanel'
import { RightPanel } from './RightPanel'

export function MobileSheet() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'configure' | 'summary'>('configure')

  return (
    <div className="relative z-30 md:hidden">
      <button
        type="button"
        className="glass-panel mx-auto mb-2 flex w-[min(100%-1rem,28rem)] items-center justify-center gap-2 rounded-full px-4 py-2 text-sm"
        onClick={() => setOpen((v) => !v)}
      >
        Customize {open ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      {open && (
        <div className="glass-panel mx-2 mb-2 max-h-[55vh] overflow-hidden rounded-2xl">
          <div className="flex border-b border-gg-border">
            <button
              type="button"
              className={`flex-1 py-2 text-sm ${tab === 'configure' ? 'text-gg-accent' : 'text-gg-muted'}`}
              onClick={() => setTab('configure')}
            >
              Configure
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm ${tab === 'summary' ? 'text-gg-accent' : 'text-gg-muted'}`}
              onClick={() => setTab('summary')}
            >
              Summary
            </button>
          </div>
          <div className="h-[48vh]">
            {tab === 'configure' ? <LeftPanel /> : <RightPanel />}
          </div>
        </div>
      )}
    </div>
  )
}
