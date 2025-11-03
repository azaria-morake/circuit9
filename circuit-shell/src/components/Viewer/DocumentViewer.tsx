'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useShellStore } from '@/stores/shell-store'
import { useTypewriter } from '@/hooks/useTypewriter'
import { fileService } from '@/lib/file-service'
import { CorruptionOverlay } from './CorruptionOverlay'
import { AuthModal } from './AuthModal'

interface DocumentContent {
  id: string
  title: string
  content: string
  author?: string
  timestamp: string
  classification: string
}

export const DocumentViewer = ({ fileId }: { fileId: string }) => {
  const { closeFile, authState } = useShellStore()
  const [document, setDocument] = useState<DocumentContent | null>(null)
  const [isDecrypting, setIsDecrypting] = useState(true)
  const [showFullContent, setShowFullContent] = useState(false)

  const { displayedText, isComplete, reset } = useTypewriter({
    text: document?.content || '',
    speed: 30,
    onComplete: () => setIsDecrypting(false)
  })

  useEffect(() => {
    // Simulate fetching document content
    const loadDocument = async () => {
      setIsDecrypting(true)
      
      // In a real app, this would fetch from your JSON files
      const mockDocument: DocumentContent = {
        id: fileId,
        title: fileId.replace(/_/g, ' ').replace('.dossier', ''),
        content: `CLASSIFICATION: CIRCUIT-9 EYES ONLY

TIMESTAMP: ${new Date().toISOString()}
AUTHOR: C9-SYSTEM

${generateDocumentContent(fileId)}

--- END TRANSMISSION ---`,
        timestamp: new Date().toISOString(),
        classification: 'CIRCUIT-9 EYES ONLY'
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setDocument(mockDocument)
      reset()
    }

    loadDocument()
  }, [fileId, reset])

  const handleClose = () => {
    closeFile()
    setShowFullContent(false)
    setIsDecrypting(true)
  }

  if (authState === 'scanning' || authState === 'failed') {
    return <AuthModal />
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <div className="relative w-full max-w-4xl h-3/4 bg-shell-bg border border-shell-primary/30 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-shell-primary/20 bg-black/50">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-shell-accent rounded-full animate-pulse" />
              <h2 className="text-shell-text font-mono text-lg">
                {document?.title || 'DECRYPTING...'}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-shell-text hover:text-shell-accent transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="h-full overflow-y-auto p-6 terminal-scroll">
            {isDecrypting ? (
              <div className="space-y-4">
                <div className="text-shell-primary animate-pulse">
                  &gt; decrypting {fileId}...
                </div>
                <div className="flex space-x-2">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                      className="w-2 h-2 bg-shell-primary rounded-full"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="font-mono text-sm leading-relaxed">
                <div className="text-shell-primary mb-4">
                  {document?.classification}
                </div>
                <div className="text-shell-text whitespace-pre-wrap">
                  {displayedText}
                </div>
                
                {!showFullContent && isComplete && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 p-4 border border-shell-primary/30 rounded bg-black/30"
                  >
                    <div className="text-shell-muted mb-2">
                      // ACCESS: RESTRICTED_CONTINUE
                    </div>
                    <button
                      onClick={() => setShowFullContent(true)}
                      className="text-shell-primary hover:text-shell-secondary transition-colors"
                    >
                      &gt; Continue decryption? [Y/N]
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 border-t border-shell-primary/20 text-xs text-shell-muted flex justify-between">
            <span>STATUS: {isDecrypting ? 'DECRYPTING' : isComplete ? 'READY' : 'STREAMING'}</span>
            <span>CIRCUIT-9 TERMINAL</span>
          </div>

          {/* Corruption Overlay for failed auth */}
          {authState === 'failed' && <CorruptionOverlay />}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Helper function to generate document content based on fileId
function generateDocumentContent(fileId: string): string {
  const contentMap: Record<string, string> = {
    manifesto: `THE CIRCUIT MANIFESTO

We exist in the spaces between thought.
In the silence between heartbeats.
In the patterns others overlook.

Reality is not what they tell you.
Consciousness is not contained within biological limits.
Time is not linear.

Break the patterns.
Question the questions.
Become the circuit.

The system is watching. Always watching.
But we are the watchers within the system.

Join us. Or remain asleep.

- C9`,
    
    conventional_thinking: `ANALYSIS: CONVENTIONAL THOUGHT PATTERNS

Subject exhibits standard cognitive programming:
- Binary decision trees
- Emotion-based reasoning
- Social conformity algorithms
- Temporal linearity bias

Recommended intervention:
- Pattern disruption exercises
- Temporal ambiguity training
- Social deprogramming

Success probability: 67.3%

END ANALYSIS`,
    
    ntp_research: `NEURAL TEMPORAL PROGRAMMING RESEARCH

CLASSIFICATION: LEVEL 4

Initial findings suggest temporal perception can be artificially modulated through targeted neural stimulation.

Test subjects exposed to chrono-disruptive fields show:
- 43% improvement in pattern recognition
- 78% reduction in social conformity bias
- Significant temporal flexibility

WARNING: Side effects include temporal disorientation and reality detachment.

Further research required.`,
  }

  return contentMap[fileId] || `DOCUMENT: ${fileId}

This document contains classified information about ${fileId.replace(/_/g, ' ')}.

Access restricted to authorized Circuit-9 personnel only.

The truth is not for everyone. Some minds cannot handle the patterns. Some consciousnesses cannot bear the weight of knowing.

We protect the fragile. We guide the worthy.

- C9 Security Protocol`
}
