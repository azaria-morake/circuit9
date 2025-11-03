'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useShellStore } from '@/stores/shell-store'

export const BootSequence = () => {
  const { completeBoot } = useShellStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const bootSteps = [
    "Initializing Circuit Shell...",
    "Loading core modules...", 
    "Establishing secure connection...",
    "Verifying system integrity...",
    "Circuit Shell ready."
  ]

  useEffect(() => {
    // Simulate boot progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 100)

    // Simulate boot steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= bootSteps.length - 1) {
          clearInterval(stepInterval)
          setTimeout(completeBoot, 1000)
          return prev
        }
        return prev + 1
      })
    }, 800)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
    }
  }, [completeBoot])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-8">
        {/* C9 Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl font-bold text-shell-primary glow">
            Circuit 9
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-shell-primary rounded-full"
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="text-sm text-gray-400 text-center">
            {progress}%
          </div>
        </div>

        {/* Boot Messages */}
        <div className="space-y-2">
          <AnimatePresence>
            {bootSteps.slice(0, currentStep + 1).map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-shell-text"
              >
                {step}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Boot Complete Message */}
        <AnimatePresence>
          {progress === 100 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-4 mt-8"
            >
              <div className="text-lg italic text-shell-text/80">
                "I think, therefore we aren't. I don't, therefore we are."
              </div>
              <div className="text-shell-primary flicker">
                You've now entered the Circuit Shell
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}