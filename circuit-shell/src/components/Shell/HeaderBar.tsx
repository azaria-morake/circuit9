'use client'

import { useShellStore } from '@/stores/shell-store'
import { Switch } from '../UI/Switch'

export const HeaderBar = () => {
  const { mode, setMode, audioEnabled, setAudioEnabled } = useShellStore()

  return (
    <header className="border-b border-shell-primary/20 bg-black/50 p-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="text-shell-primary text-xl font-bold glow">
            Circuit 9
          </div>
          <div className="text-xs text-shell-muted px-2 py-1 border border-shell-primary/30 rounded">
            SHELL v2.4.1
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6">
          {/* Mode Toggle */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-shell-text">GUI</span>
            <Switch
              enabled={mode === 'cli'}
              onChange={(enabled) => setMode(enabled ? 'cli' : 'gui')}
            />
            <span className="text-sm text-shell-text">CLI</span>
          </div>

          {/* Audio Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-shell-text">Audio</span>
            <Switch
              enabled={audioEnabled}
              onChange={setAudioEnabled}
            />
          </div>

          {/* Status Indicators */}
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-shell-primary rounded-full animate-pulse" />
              <span className="text-shell-muted">ONLINE</span>
            </div>
            <div className="text-shell-muted">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}