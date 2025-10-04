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
  }, [canvas, currentIndex])

  const undo = useCallback(() => {
    if (!canvas || currentIndex <= 0) return

    isUndoRedoRef.current = true
    const prevState = history[currentIndex - 1]
    
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
  }, [canvas, history, currentIndex])

  const redo = useCallback(() => {
    if (!canvas || currentIndex >= history.length - 1) return

    isUndoRedoRef.current = true
    const nextState = history[currentIndex + 1]
    
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
  }, [canvas, history, currentIndex])

  return {
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    recordState,
  }
}