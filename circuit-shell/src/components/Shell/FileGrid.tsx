'use client'

import { useShellStore } from '@/stores/shell-store'
import { fileService } from '@/lib/file-service'

export const FileGrid = () => {
  const { currentPath, openFile } = useShellStore()
  const files = fileService.getFiles(currentPath)

  const handleFileClick = (file: any) => {
    if (file.type === 'folder') {
      // Navigate to folder - you might want to add this to your store
      console.log('Navigate to folder:', file.name)
    } else {
      if (file.locked) {
        // Trigger auth flow
        console.log('File locked, trigger auth')
      } else {
        openFile(file.id)
      }
    }
  }

  const getFileIcon = (file: any) => {
    if (file.type === 'folder') {
      return '📁'
    }
    return file.locked ? '🔒' : '📄'
  }

  const getFileColor = (file: any) => {
    if (file.locked) return 'text-shell-muted'
    if (file.type === 'folder') return 'text-shell-secondary'
    return 'text-shell-text'
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Current Path */}
      <div className="mb-6">
        <div className="text-sm text-shell-muted mb-2">
          Current Directory: <span className="text-shell-primary">{currentPath}</span>
        </div>
        <div className="text-xs text-shell-muted">
          {files.length} item{files.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Files Grid */}
      {files.length === 0 ? (
        <div className="text-center text-shell-muted py-12">
          <div className="text-4xl mb-4">📁</div>
          <div>Directory empty</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className={`
                border border-shell-primary/20 rounded-lg p-4 cursor-pointer
                hover:border-shell-primary/50 hover:bg-shell-primary/5
                transition-all duration-200
                ${file.locked ? 'opacity-60' : ''}
              `}
              onClick={() => handleFileClick(file)}
            >
              {/* File Icon */}
              <div className="text-3xl mb-3 text-center">
                {getFileIcon(file)}
              </div>

              {/* File Name */}
              <div className={`text-center font-mono text-sm mb-2 ${getFileColor(file)}`}>
                {file.name}
              </div>

              {/* File Info */}
              <div className="text-xs text-shell-muted text-center space-y-1">
                <div>
                  {file.type === 'folder' ? 'Folder' : 'Document'}
                </div>
                {file.preview && (
                  <div className="truncate" title={file.preview}>
                    {file.preview}
                  </div>
                )}
                {file.timestamp && (
                  <div>
                    {new Date(file.timestamp).toLocaleDateString()}
                  </div>
                )}
                {file.locked && (
                  <div className="text-shell-accent">
                    AUTH REQUIRED
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State Help */}
      {files.length === 0 && currentPath !== '/' && (
        <div className="text-center mt-8">
          <button
            onClick={() => useShellStore.getState().setCurrentPath('/')}
            className="text-shell-primary hover:text-shell-secondary transition-colors"
          >
            ← Return to root directory
          </button>
        </div>
      )}
    </div>
  )
}