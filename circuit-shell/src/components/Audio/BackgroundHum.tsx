'use client'

import { useEffect, useRef } from 'react'
import { useShellStore } from '@/stores/shell-store'

export const BackgroundHum = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { bootComplete } = useShellStore()

  useEffect(() => {
    if (!bootComplete) return

    // Create audio element
    audioRef.current = new Audio()
    audioRef.current.src = '/audio/ambient-hum.mp3'
    audioRef.current.loop = true
    audioRef.current.volume = 0.2

    // Attempt to play
    const playAudio = async () => {
      try {
        await audioRef.current?.play()
      } catch (error) {
        console.warn('Audio playback failed:', error)
      }
    }

    playAudio()

    return () => {
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [bootComplete])

  return null
}
