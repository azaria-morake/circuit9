import { useState, useEffect, useCallback } from 'react'

interface UseTypewriterProps {
  text: string
  speed?: number
  onComplete?: () => void
}

export const useTypewriter = ({ 
  text, 
  speed = 50, 
  onComplete 
}: UseTypewriterProps) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const reset = useCallback(() => {
    setDisplayedText('')
    setCurrentIndex(0)
    setIsComplete(false)
  }, [])

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    } else if (!isComplete) {
      setIsComplete(true)
      onComplete?.()
    }
  }, [currentIndex, text, speed, isComplete, onComplete])

  return { displayedText, isComplete, reset }
}
