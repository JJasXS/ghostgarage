import { useEffect } from 'react'
import { useGarageStore } from '@/store/useGarageStore'

export function useKeyboardShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return

      const state = useGarageStore.getState()

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        state.undo()
        return
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault()
        state.redo()
        return
      }
      if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) {
        state.resetCamera()
        return
      }
      if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.metaKey) {
        state.saveCurrentBuild()
        return
      }
      if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey) {
        if (!document.fullscreenElement) {
          void document.documentElement.requestFullscreen()
          state.updateSettings({ fullscreen: true })
        } else {
          void document.exitFullscreen()
          state.updateSettings({ fullscreen: false })
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
