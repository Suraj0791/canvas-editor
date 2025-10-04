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