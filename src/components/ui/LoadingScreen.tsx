import { motion } from 'framer-motion'

export function LoadingScreen() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-gg-bg"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      data-testid="loading-screen"
    >
      <div className="text-center">
        <motion.div
          className="mx-auto mb-4 h-12 w-12 rounded-full border-2 border-gg-accent/30 border-t-gg-accent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
        />
        <div className="text-sm tracking-[0.35em] text-gg-silver uppercase">GhostGarage</div>
        <div className="mt-2 text-xs text-gg-muted">Preparing showroom…</div>
      </div>
    </motion.div>
  )
}
