import { useState, useCallback } from "react"

interface HistoryState {
  canUndo: boolean
  canRedo: boolean
}

export function useCanvasHistory() {
  const [history, setHistory] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [historyState, setHistoryState] = useState<HistoryState>({
    canUndo: false,
    canRedo: false,
  })

  const saveState = useCallback((state: string) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, currentIndex + 1)
      newHistory.push(state)
      
      if (newHistory.length > 50) {
        newHistory.shift()
        setCurrentIndex((idx) => idx)
      } else {
        setCurrentIndex((idx) => idx + 1)
      }
      
      return newHistory
    })
  }, [currentIndex])

  const undo = useCallback((): string | null => {
    if (currentIndex > 0) {
      setCurrentIndex((idx) => idx - 1)
      return history[currentIndex - 1]
    }
    return null
  }, [currentIndex, history])

  const redo = useCallback((): string | null => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((idx) => idx + 1)
      return history[currentIndex + 1]
    }
    return null
  }, [currentIndex, history])

  const updateHistoryState = useCallback(() => {
    setHistoryState({
      canUndo: currentIndex > 0,
      canRedo: currentIndex < history.length - 1,
    })
  }, [currentIndex, history.length])

  return {
    saveState,
    undo,
    redo,
    canUndo: historyState.canUndo,
    canRedo: historyState.canRedo,
    updateHistoryState,
  }
}