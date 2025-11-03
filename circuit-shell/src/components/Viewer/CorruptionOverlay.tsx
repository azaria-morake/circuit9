'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CORRUPTION_CHARS = '░▒▓█▄▀▌▐╳╲╱╴╵╶╷┼┴┬┤├▔▁▏▕▂▃▅▆▇◤◥◢◣◰◳◲◱♺⚡⍟⌇⌁'
const CORRUPTION_LINES = 50

export const CorruptionOverlay = () => {
  const [visible, setVisible] = useState(true)
  const [corruptionText, setCorruptionText] = useState<string[]>([])

  useEffect(() => {
    // Generate corruption text
    const lines = Array.from({ length: CORRUPTION_LINES }, () =>
      Array.from({ length: 80 }, () => 
        CORRUPTION_CHARS[Math.floor(Math.random() * CORRUPTION_CHARS.length)]
      ).join('')
    )
    setCorruptionText(lines)

    // Auto-remove after delay
    const timer = setTimeout(() => setVisible(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 pointer-events-none"
      >
        {/* Glitch effect */}
        <div className="absolute inset-0 glitch-text bg-shell-corruption/10" />
        
        {/* Scanlines */}
        <div className="absolute inset-0 scanlines" />
        
        {/* Corruption text overlay */}
        <div className="absolute inset-0 corruption-overlay font-mono text-xs leading-tight text-shell-corruption overflow-hidden">
          {corruptionText.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: Math.random() * 100 - 50 }}
              animate={{ 
                opacity: [0, 1, 0],
                x: [Math.random() * 100 - 50, Math.random() * 100 - 50]
              }}
              transition={{ 
                duration: 0.5 + Math.random() * 2,
                delay: Math.random() * 1
              }}
              className="whitespace-pre"
            >
              {line}
            </motion.div>
          ))}
        </div>

        {/* Error message */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <div className="text-shell-accent text-2xl font-mono mb-4 glitch-text">
            ACCESS DENIED
          </div>
          <div className="text-shell-text text-sm">
            CIRCUIT_AUTH_FAILURE: 0x7F3A9C
          </div>
          <div className="text-shell-muted text-xs mt-2">
            Biometric signature rejected
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
