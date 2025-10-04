"use client"

import { useEffect, useRef } from "react"
import { fabric } from "fabric"

interface CanvasEditorProps {
  sceneId: string
  viewOnly?: boolean
}

export function CanvasEditor({ sceneId, viewOnly = false }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Initialize Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "#ffffff",
    })

    fabricCanvasRef.current = canvas

    // Cleanup on unmount
    return () => {
      canvas.dispose()
    }
  }, [])

  return (
    <div className="relative w-full h-screen">
      <canvas ref={canvasRef} />
    </div>
  )
}