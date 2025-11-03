import { fileService } from './file-service'
import { useShellStore } from '@/stores/shell-store'

export const commandParser = (command: string, currentPath: string): string => {
  const [cmd, ...args] = command.split(' ')
  
  switch (cmd.toLowerCase()) {
    case 'ls':
    case 'dir':
      const files = fileService.getFiles(currentPath)
      return files.map(file => 
        `${file.type === 'folder' ? '📁' : '📄'} ${file.name}${file.locked ? ' 🔒' : ''}`
      ).join('\n')
    
    case 'cd':
      if (!args[0]) return 'Usage: cd <folder>'
      const newPath = fileService.resolvePath(currentPath, args[0])
      if (fileService.pathExists(newPath)) {
        useShellStore.getState().setCurrentPath(newPath)
        return `Changed directory to ${newPath}`
      }
      return `Directory not found: ${args[0]}`
    
    case 'open':
    case 'cat':
      if (!args[0]) return 'Usage: open <file>'
      const file = fileService.getFile(currentPath, args[0])
      if (!file) return `File not found: ${args[0]}`
      if (file.locked) {
        useShellStore.getState().startAuth()
        return 'Access denied. Circuit Auth required.'
      }
      useShellStore.getState().openFile(file.id)
      return `Opening ${file.name}...`
    
    case 'help':
      return `Available commands:
ls, dir - List files
cd <folder> - Change directory
open, cat <file> - Open file
auth - Attempt authentication
clear - Clear terminal
root - Return to root
help - Show this help`
    
    case 'clear':
      return '\n'.repeat(50) // Simple clear
    
    case 'root':
      useShellStore.getState().setCurrentPath('/')
      return 'Returned to root directory'
    
    case 'auth':
      useShellStore.getState().startAuth()
      return 'Initiating Circuit Auth...'
    
    default:
      return `Command not found: ${cmd}. Type 'help' for available commands.`
  }
}
