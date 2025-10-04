"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { Canvas } from "fabric"

export function useCanvasHistory(canvas: Canvas | null) {
  const [history, setHistory] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const isUndoRedoRef = useRef(false)

  useEffect(() => {
    if (canvas && history.length === 0) {
      const json = JSON.stringify(canvas.toJSON())
      setHistory([json])
      setCurrentIndex(0)
    }
  }, [canvas, history.length])

  const recordState = useCallback(() => {
    if (!canvas || isUndoRedoRef.current) return

    try {
      const json = JSON.stringify(canvas.toJSON())
      setHistory((prev) => {
        const newHistory = prev.slice(0, currentIndex + 1)
        newHistory.push(json)
        
        if (newHistory.length > 50) {
          newHistory.shift()
          return newHistory
        }
        setCurrentIndex((prevIndex) => prevIndex + 1)
        return newHistory
      })
    } catch (error) {
      console.error("[History] Error recording state:", error)
    }
  }, [canvas, currentIndex])

  const undo = useCallback(() => {
    if (!canvas || currentIndex <= 0) return

    isUndoRedoRef.current = true
    const prevState = history[currentIndex - 1]
    
    if (!prevState) {
      console.error("[History] No previous state available")
      isUndoRedoRef.current = false
      return
    }

    try {
      canvas.loadFromJSON(JSON.parse(prevState))
        .then(() => {
          canvas.renderAll()
          isUndoRedoRef.current = false
        })
        .catch((err) => {
          console.error("[History] Undo error:", err)
          isUndoRedoRef.current = false
        })
      
      setCurrentIndex((prev) => prev - 1)
    } catch (error) {
      console.error("[History] Undo JSON parse error:", error)
      isUndoRedoRef.current = false
    }
  }, [canvas, history, currentIndex])

  const redo = useCallback(() => {
    if (!canvas || currentIndex >= history.length - 1) return

    isUndoRedoRef.current = true
    const nextState = history[currentIndex + 1]
    
    if (!nextState) {
      console.error("[History] No next state available")
      isUndoRedoRef.current = false
      return
    }

    try {
      canvas.loadFromJSON(JSON.parse(nextState))
        .then(() => {
          canvas.renderAll()
          isUndoRedoRef.current = false
        })
        .catch((err) => {
          console.error("[History] Redo error:", err)
          isUndoRedoRef.current = false
        })
      
      setCurrentIndex((prev) => prev + 1)
    } catch (error) {
      console.error("[History] Redo JSON parse error:", error)
      isUndoRedoRef.current = false
    }
  }, [canvas, history, currentIndex])

  return {
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    recordState,
  }
}