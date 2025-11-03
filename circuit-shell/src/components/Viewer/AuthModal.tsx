'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useShellStore } from '@/stores/shell-store'
import { useAuthSimulator } from '@/hooks/useAuthSimulator'

export const AuthModal = () => {
  const { authState, failAuth, resetAuth } = useShellStore()
  const [scanProgress, setScanProgress] = useState(0)
  const [useRealCamera, setUseRealCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const { simulateScan, isScanning } = useAuthSimulator()

  useEffect(() => {
    if (authState === 'scanning') {
      // Start scan progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            // Always fail for demo purposes
            setTimeout(failAuth, 500)
            return 100
          }
          return prev + 2
        })
      }, 100)

      return () => clearInterval(progressInterval)
    }
  }, [authState, failAuth])

  useEffect(() => {
    if (useRealCamera && authState === 'scanning') {
      startCamera()
    }

    return () => {
      stopCamera()
    }
  }, [useRealCamera, authState])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.warn('Camera access denied, using simulation')
      setUseRealCamera(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const handleSimulateAuth = () => {
    resetAuth()
    simulateScan()
  }

  const handleRealCameraAuth = () => {
    setUseRealCamera(true)
    resetAuth()
    simulateScan()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      >
        <div className="relative w-full max-w-md bg-shell-bg border border-shell-primary/30 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-shell-primary/20 bg-black/50">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-shell-primary rounded-full animate-pulse" />
              <h2 className="text-shell-text font-mono text-lg">
                CIRCUIT AUTH v2.4
              </h2>
            </div>
            <div className="text-sm text-shell-muted mt-1">
              Biometric verification required
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {authState === 'idle' ? (
              <>
                <div className="text-center space-y-4">
                  <div className="text-shell-text">
                    Access to this document requires Circuit-9 biometric verification.
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={handleSimulateAuth}
                      className="w-full py-3 px-4 bg-shell-primary/20 border border-shell-primary text-shell-primary rounded-lg hover:bg-shell-primary/30 transition-colors"
                    >
                      Simulated Biometric Scan
                    </button>
                    
                    <button
                      onClick={handleRealCameraAuth}
                      className="w-full py-3 px-4 bg-shell-secondary/20 border border-shell-secondary text-shell-secondary rounded-lg hover:bg-shell-secondary/30 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Use Real Camera</span>
                      <span className="text-xs opacity-70">(Local only)</span>
                    </button>
                  </div>

                  <div className="text-xs text-shell-muted p-3 bg-black/30 rounded">
                    <strong>Privacy Note:</strong> Camera data never leaves your device. 
                    No images are stored or transmitted.
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Scanner UI */}
                <div className="space-y-4">
                  <div className="text-center text-shell-text">
                    {useRealCamera ? 'Real Camera Scan' : 'Simulated Biometric Scan'}
                  </div>

                  {/* Scanner Box */}
                  <div className="relative aspect-video bg-black border-2 border-shell-primary/50 rounded-lg overflow-hidden">
                    {useRealCamera ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-shell-primary text-4xl">
                          [SCAN]
                        </div>
                      </div>
                    )}

                    {/* Scanning Animation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ y: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-full h-1 bg-shell-primary/50"
                      />
                    </div>

                    {/* Progress */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="h-2 bg-shell-muted/30 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${scanProgress}%` }}
                          className="h-full bg-shell-primary rounded-full"
                        />
                      </div>
                      <div className="text-xs text-shell-text mt-1 text-center">
                        Scanning: {scanProgress}%
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-sm text-shell-muted">
                    {scanProgress < 50 && 'Initializing neural patterns...'}
                    {scanProgress >= 50 && scanProgress < 80 && 'Analyzing biometric signature...'}
                    {scanProgress >= 80 && 'Verifying Circuit-9 clearance...'}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-shell-primary/20 bg-black/50 text-xs text-shell-muted flex justify-between">
            <span>SECURITY: ACTIVE</span>
            <span>LOCAL PROCESSING ONLY</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
