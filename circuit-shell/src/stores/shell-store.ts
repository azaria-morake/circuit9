import { create } from 'zustand'

interface File {
  id: string
  name: string
  type: 'file' | 'folder'
  path: string
  locked: boolean
  accessLevel: number
  preview?: string
  timestamp?: string
}

interface ShellState {
  // UI State
  mode: 'gui' | 'cli'
  currentPath: string
  openDocument: string | null
  isBooting: boolean
  bootComplete: boolean
  authState: 'idle' | 'scanning' | 'failed' | 'success'

  // Audio state
  audioEnabled: boolean
  // Camera state
  cameraEnabled: boolean
  
  // Actions
  setMode: (mode: 'gui' | 'cli') => void
  setCurrentPath: (path: string) => void
  openFile: (fileId: string) => void
  closeFile: () => void
  startBoot: () => void
  completeBoot: () => void
  startAuth: () => void
  failAuth: () => void
  resetAuth: () => void
  setAudioEnabled: (enabled: boolean) => void
  setCameraEnabled: (enabled: boolean) => void
}

export const useShellStore = create<ShellState>((set) => ({
  mode: 'gui',
  currentPath: '/',
  openDocument: null,
  isBooting: true,
  bootComplete: false,
  authState: 'idle',

  audioEnabled: true,
  cameraEnabled: false,
  

  setMode: (mode) => set({ mode }),
  setCurrentPath: (path) => set({ currentPath: path }),
  openFile: (fileId) => set({ openDocument: fileId }),
  closeFile: () => set({ openDocument: null }),
  startBoot: () => set({ isBooting: true, bootComplete: false }),
  completeBoot: () => set({ isBooting: false, bootComplete: true }),
  startAuth: () => set({ authState: 'scanning' }),
  failAuth: () => set({ authState: 'failed' }),
  resetAuth: () => set({ authState: 'idle' }),
  // New actions
  setAudioEnabled: (audioEnabled) => set({ audioEnabled }),
  setCameraEnabled: (cameraEnabled) => set({ cameraEnabled }),
}))
