import { useState, useCallback } from 'react'
import { useShellStore } from '@/stores/shell-store'

export const useAuthSimulator = () => {
  const [isScanning, setIsScanning] = useState(false)
  const { startAuth, failAuth } = useShellStore()

  const simulateScan = useCallback(() => {
    setIsScanning(true)
    startAuth()

    // Simulate scan process
    setTimeout(() => {
      setIsScanning(false)
      // Always fail for demo purposes
      failAuth()
    }, 3000)
  }, [startAuth, failAuth])

  return {
    simulateScan,
    isScanning
  }
}
