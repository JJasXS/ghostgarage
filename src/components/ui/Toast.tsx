import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGarageStore } from '@/store/useGarageStore'

export function Toast() {
  const toast = useGarageStore((s) => s.toast)
  const setToast = useGarageStore((s) => s.setToast)

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2800)
    return () => window.clearTimeout(t)
  }, [toast, setToast])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="glass-panel pointer-events-none fixed bottom-20 left-1/2 z-50 max-w-sm -translate-x-1/2 px-4 py-2 text-center text-sm text-gg-text"
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
