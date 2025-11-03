'use client'

import { motion } from 'framer-motion'

interface SwitchProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: string
}

export const Switch = ({ enabled, onChange, label }: SwitchProps) => {
  return (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full border border-shell-primary/30 ${
        enabled ? 'bg-shell-primary/20' : 'bg-black/50'
      }`}
      onClick={() => onChange(!enabled)}
    >
      <span className="sr-only">{label}</span>
      <motion.span
        animate={{ x: enabled ? 20 : 4 }}
        className={`inline-block h-4 w-4 transform rounded-full bg-shell-primary transition`}
      />
    </button>
  )
}
