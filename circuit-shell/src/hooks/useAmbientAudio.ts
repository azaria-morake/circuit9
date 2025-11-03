import { useEffect, useRef, useState } from 'react'

export const useAmbientAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    audioRef.current = new Audio('/audio/ambient-hum.mp3')
    audioRef.current.loop = true
    audioRef.current.volume = 0.3

    return () => {
      audioRef.current?.pause()
    }
  }, [])

  const play = () => {
    audioRef.current?.play().then(() => {
      setIsPlaying(true)
    }).catch(console.error)
  }

  const pause = () => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }

  return { play, pause, isPlaying }
}
