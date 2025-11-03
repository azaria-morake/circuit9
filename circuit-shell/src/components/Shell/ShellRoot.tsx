'use client'

import { useEffect } from 'react'
import { useShellStore } from '@/stores/shell-store'
import { useAmbientAudio } from '@/hooks/useAmbientAudio'
import { BootSequence } from './BootSequence'
import { HeaderBar } from './HeaderBar'
import { SidebarTree } from './SidebarTree'
import { FileGrid } from './FileGrid'
import { TerminalPrompt } from '../Terminal/TerminalPrompt'
import { DocumentViewer } from '../Viewer/DocumentViewer'
import { FooterStatus } from './FooterStatus'
import { BackgroundHum } from '../Audio/BackgroundHum'

export const ShellRoot = () => {
  const { 
    isBooting, 
    bootComplete, 
    mode, 
    openDocument 
  } = useShellStore()
  const { play } = useAmbientAudio()

  useEffect(() => {
    if (bootComplete) {
      play()
    }
  }, [bootComplete, play])

  if (isBooting) {
    return <BootSequence />
  }

  return (
    <div className="min-h-screen bg-shell-bg text-shell-text font-mono overflow-hidden">
      <BackgroundHum />
      
      <div className="flex flex-col h-screen">
        <HeaderBar />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Hidden in CLI mode on mobile */}
          <aside className={`
            ${mode === 'cli' ? 'hidden md:block' : 'block'} 
            w-64 border-r border-shell-primary/20
          `}>
            <SidebarTree />
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 flex flex-col">
            {mode === 'gui' ? (
              <FileGrid />
            ) : (
              <TerminalPrompt />
            )}
            
            {openDocument && (
              <DocumentViewer fileId={openDocument} />
            )}
          </main>
        </div>
        
        <FooterStatus />
      </div>
    </div>
  )
}