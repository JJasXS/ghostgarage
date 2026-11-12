import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  children: ReactNode
  size?: 'sm' | 'md'
}

export function GlassButton({
  active,
  children,
  size = 'md',
  className = '',
  ...rest
}: GlassButtonProps) {
  const sizeCls = size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm'
  return (
    <button
      type="button"
      className={`rounded-lg border transition-colors ${sizeCls} ${
        active
          ? 'border-gg-accent bg-gg-accent/20 text-gg-text'
          : 'border-gg-border bg-white/5 text-gg-muted hover:border-white/20 hover:text-gg-text'
      } disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
