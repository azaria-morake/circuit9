import filesData from '@/data/files.json'

export interface File {
  id: string
  name: string
  type: 'file' | 'folder'
  path: string
  locked: boolean
  accessLevel: number
  preview?: string
  timestamp?: string
  children?: File[]
}

class FileService {
  private files: File[]

  constructor() {
    this.files = filesData as File[]
  }

  getFiles(path: string): File[] {
    if (path === '/') {
      return this.files
    }

    const pathParts = path.split('/').filter(Boolean)
    let currentLevel = this.files
    
    for (const part of pathParts) {
      const folder = currentLevel.find(f => f.name === part && f.type === 'folder')
      if (!folder || !folder.children) return []
      currentLevel = folder.children
    }
    
    return currentLevel
  }

  getFile(path: string, filename: string): File | null {
    const files = this.getFiles(path)
    return files.find(f => f.name === filename) || null
  }

  resolvePath(currentPath: string, targetPath: string): string {
    if (targetPath.startsWith('/')) {
      return targetPath
    }
    
    const currentParts = currentPath.split('/').filter(Boolean)
    const targetParts = targetPath.split('/').filter(Boolean)
    
    for (const part of targetParts) {
      if (part === '..') {
        currentParts.pop()
      } else if (part !== '.') {
        currentParts.push(part)
      }
    }
    
    return '/' + currentParts.join('/')
  }

  pathExists(path: string): boolean {
    try {
      return this.getFiles(path).length > 0
    } catch {
      return false
    }
  }
}

export const fileService = new FileService()
