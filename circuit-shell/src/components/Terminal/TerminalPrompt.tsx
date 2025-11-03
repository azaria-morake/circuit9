'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useShellStore } from '@/stores/shell-store'
import { commandParser } from '@/lib/command-parser'

export const TerminalPrompt = () => {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<{ command: string; output: string }[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const { currentPath } = useShellStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const output = commandParser(input.trim(), currentPath)
    setHistory(prev => [...prev, { command: input, output }])
    setInput('')
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [history])

  return (
    <div className="h-full bg-black/50 p-4 overflow-y-auto">
      {/* Welcome Message */}
      {history.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-shell-text mb-4 space-y-2"
        >
          <div>Circuit Shell v2.4.1 - Secure Terminal</div>
          <div>Type 'help' for available commands</div>
          <div className="text-shell-primary">¢</div>
        </motion.div>
      )}

      {/* Command History */}
      <div className="space-y-2">
        {history.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-shell-primary">¢</span>
              <span>{item.command}</span>
            </div>
            <div className="text-shell-text/80 whitespace-pre-wrap ml-4">
              {item.output}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 mt-4">
        <span className="text-shell-primary">¢</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-shell-text"
          placeholder="Type a command..."
          autoFocus
        />
      </form>
    </div>
  )
}
