'use client'

import { useState } from 'react'
import { useShellStore } from '@/stores/shell-store'
import { fileService } from '@/lib/file-service'

export const SidebarTree = () => {
  const { currentPath, setCurrentPath, openFile, mode } = useShellStore()
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/']))

  const files = fileService.getFiles(currentPath)

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(folderPath)) {
        newSet.delete(folderPath)
      } else {
        newSet.add(folderPath)
      }
      return newSet
    })
  }

  const handleFileClick = (file: any) => {
    if (file.type === 'folder') {
      setCurrentPath(fileService.resolvePath(currentPath, file.name))
    } else {
      if (file.locked) {
        // This would trigger the auth flow
        console.log('File is locked, should trigger auth')
      } else {
        openFile(file.id)
      }
    }
  }

  const renderTree = (files: any[], depth = 0) => {
    return files.map((file) => (
      <div key={file.id} className="select-none">
        <div
          className={`flex items-center space-x-2 py-1 px-2 hover:bg-shell-primary/10 cursor-pointer rounded ${
            currentPath.includes(file.name) ? 'bg-shell-primary/20' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => handleFileClick(file)}
        >
          {/* Icon */}
          <span className="text-sm">
            {file.type === 'folder' ? 
              (expandedFolders.has(file.path) ? '📂' : '📁') : 
              (file.locked ? '🔒' : '📄')
            }
          </span>
          
          {/* Name */}
          <span className={`text-sm ${
            file.locked ? 'text-shell-muted' : 'text-shell-text'
          }`}>
            {file.name}
          </span>

          {/* Lock indicator */}
          {file.locked && (
            <span className="text-xs text-shell-accent">[LOCKED]</span>
          )}
        </div>

        {/* Children */}
        {file.type === 'folder' && expandedFolders.has(file.path) && file.children && (
          <div className="border-l border-shell-primary/20 ml-4">
            {renderTree(file.children, depth + 1)}
          </div>
        )}
      </div>
    ))
  }

  return (
    <div className="h-full p-4 overflow-y-auto">
      <div className="mb-4">
        <h3 className="text-shell-primary text-sm font-semibold mb-2">
          FILE SYSTEM
        </h3>
        <div className="text-xs text-shell-muted mb-2">
          Path: {currentPath}
        </div>
      </div>

      <div className="space-y-1">
        {renderTree(files)}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-shell-primary/20">
        <h4 className="text-shell-primary text-sm font-semibold mb-2">
          QUICK ACTIONS
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => setCurrentPath('/')}
            className="w-full text-left text-sm text-shell-text hover:bg-shell-primary/10 py-1 px-2 rounded"
          >
            🏠 Root Directory
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full text-left text-sm text-shell-text hover:bg-shell-primary/10 py-1 px-2 rounded"
          >
            🔄 Refresh Shell
          </button>
        </div>
      </div>
    </div>
  )
}