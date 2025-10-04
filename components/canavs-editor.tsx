"use client"

import { useEffect, useRef, useState } from "react"
import { fabric } from "fabric"

interface CanvasEditorProps {
  sceneId: string
  viewOnly?: boolean
}

export function CanvasEditor({ sceneId, viewOnly = false }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null)

  const GRID_SIZE = 20

  const snapToGrid = (value: number) => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE
  }

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "#ffffff",
    })

    fabricCanvasRef.current = canvas

    // Handle object selection
    canvas.on("selection:created", (e) => {
      setSelectedObject(e.selected?.[0] || null)
    })

    canvas.on("selection:updated", (e) => {
      setSelectedObject(e.selected?.[0] || null)
    })

    canvas.on("selection:cleared", () => {
      setSelectedObject(null)
    })

    // Snap to grid while moving
    canvas.on("object:moving", (e) => {
      const obj = e.target
      if (!obj) return

      obj.set({
        left: snapToGrid(obj.left || 0),
        top: snapToGrid(obj.top || 0),
      })
    })

    // Handle object modifications
    canvas.on("object:modified", () => {
      console.log("[v0] Object modified")
    })

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