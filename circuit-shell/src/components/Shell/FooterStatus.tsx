'use client'

import { useShellStore } from '@/stores/shell-store'
import { useEffect, useState } from 'react'

export const FooterStatus = () => {
  const { mode, currentPath, bootComplete } = useShellStore()
  const [systemTime, setSystemTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!bootComplete) return null

  return (
    <footer className="border-t border-shell-primary/20 bg-black/50 p-2">
      <div className="flex items-center justify-between text-xs text-shell-muted font-mono">
        {/* Left Section - System Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-shell-primary rounded-full animate-pulse" />
            <span>SYSTEM: ONLINE</span>
          </div>
          <span>MODE: {mode.toUpperCase()}</span>
          <span>PATH: {currentPath}</span>
        </div>

        {/* Center Section - Status Messages */}
        <div className="flex-1 text-center">
          <span className="text-shell-primary">
            {mode === 'cli' ? 'Type "help" for commands' : 'Click files to open'}
          </span>
        </div>

        {/* Right Section - Time & Stats */}
        <div className="flex items-center space-x-4">
          <span>TIME: {systemTime.toLocaleTimeString()}</span>
          <span>CPU: 2.4%</span>
          <span>MEM: 384MB</span>
        </div>
      </div>
    </footer>
  )
}