"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { Canvas } from "fabric"

export function useCanvasHistory(canvas: Canvas | null) {
  const [history, setHistory] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const isUndoRedoRef = useRef(false)
  const hasInitializedRef = useRef(false)

  useEffect(() => {
    if (canvas && !hasInitializedRef.current) {
      try {
        const json = JSON.stringify(canvas.toJSON())
        setHistory([json])
        setCurrentIndex(0)
        hasInitializedRef.current = true
        console.log("[History] Initial state recorded")
      } catch (error) {
        console.error("[History] Error recording initial state:", error)
      }
    }
  }, [canvas])

  const recordState = useCallback(() => {
    if (!canvas || isUndoRedoRef.current) return

    try {
      const json = JSON.stringify(canvas.toJSON())
      
      setHistory((prev) => {
        const newHistory = prev.slice(0, currentIndex + 1)
        newHistory.push(json)
        
        if (newHistory.length > 50) {
          newHistory.shift()
          setCurrentIndex(newHistory.length - 1)
          return newHistory
        }
        
        return newHistory
      })
      
      setCurrentIndex((prev) => Math.min(prev + 1, 49))
    } catch (error) {
      console.error("[History] Error recording state:", error)
    }
  }, [canvas, currentIndex])

  const undo = useCallback(() => {
    if (!canvas) return
    
    if (currentIndex <= 0) {
      console.log("[History] Already at first state")
      return
    }

    const targetIndex = currentIndex - 1
    const prevState = history[targetIndex]
    
    if (!prevState) {
      console.error("[History] Invalid state. Index:", currentIndex, "History length:", history.length)
      return
    }

    try {
      isUndoRedoRef.current = true
      
      canvas.loadFromJSON(JSON.parse(prevState))
        .then(() => {
          canvas.renderAll()
          setCurrentIndex(targetIndex)
          isUndoRedoRef.current = false
        })
        .catch((err) => {
          console.error("[History] Undo error:", err)
          isUndoRedoRef.current = false
        })
    } catch (error) {
      console.error("[History] Undo parse error:", error)
      isUndoRedoRef.current = false
    }
  }, [canvas, history, currentIndex])

  const redo = useCallback(() => {
    if (!canvas) return
    
    if (currentIndex >= history.length - 1) {
      console.log("[History] Already at latest state")
      return
    }

    const targetIndex = currentIndex + 1
    const nextState = history[targetIndex]
    
    if (!nextState) {
      console.error("[History] Invalid state. Index:", currentIndex, "History length:", history.length)
      return
    }

    try {
      isUndoRedoRef.current = true
      
      canvas.loadFromJSON(JSON.parse(nextState))
        .then(() => {
          canvas.renderAll()
          setCurrentIndex(targetIndex)
          isUndoRedoRef.current = false
        })
        .catch((err) => {
          console.error("[History] Redo error:", err)
          isUndoRedoRef.current = false
        })
    } catch (error) {
      console.error("[History] Redo parse error:", error)
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