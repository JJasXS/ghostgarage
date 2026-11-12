import { useGarageStore } from '@/store/useGarageStore'

export function SettingsView() {
  const settings = useGarageStore((s) => s.settings)
  const updateSettings = useGarageStore((s) => s.updateSettings)

  return (
    <div className="mx-auto max-w-lg space-y-4 overflow-y-auto p-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <label className="glass-panel flex items-center justify-between rounded-xl p-4 text-sm">
        <div>
          <div className="font-medium">Reduced motion</div>
          <div className="text-xs text-gg-muted">Disable camera tweens and auto-rotate</div>
        </div>
        <input
          type="checkbox"
          className="accent-gg-accent"
          checked={settings.reducedMotion}
          onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
        />
      </label>

      <label className="glass-panel flex items-center justify-between rounded-xl p-4 text-sm">
        <div>
          <div className="font-medium">Developer mode</div>
          <div className="text-xs text-gg-muted">Show FPS counter overlay</div>
        </div>
        <input
          type="checkbox"
          className="accent-gg-accent"
          checked={settings.developerMode}
          onChange={(e) => updateSettings({ developerMode: e.target.checked })}
        />
      </label>

      <div className="text-xs text-gg-muted">
        Keyboard: <kbd className="rounded bg-white/10 px-1">Ctrl+Z</kbd> undo,{' '}
        <kbd className="rounded bg-white/10 px-1">Ctrl+Y</kbd> redo,{' '}
        <kbd className="rounded bg-white/10 px-1">R</kbd> reset camera,{' '}
        <kbd className="rounded bg-white/10 px-1">S</kbd> save,{' '}
        <kbd className="rounded bg-white/10 px-1">F</kbd> fullscreen.
      </div>
    </div>
  )
}
