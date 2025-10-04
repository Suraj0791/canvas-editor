"use client"

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react"
import { fabric } from "fabric"

interface CanvasEditorProps {
  sceneId: string
  viewOnly?: boolean
}

export interface CanvasEditorRef {
  addRectangle: () => void
  addCircle: () => void
  addText: () => void
  toggleDrawingMode: () => void
  changeColor: (color: string) => void
  getSelectedObject: () => fabric.Object | null
  lockObject: () => void
  unlockObject: () => void
  deleteObject: () => void
}

export const CanvasEditor = forwardRef<CanvasEditorRef, CanvasEditorProps>(
  ({ sceneId, viewOnly = false }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
    const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null)
    const [isDrawingMode, setIsDrawingMode] = useState(false)

    const GRID_SIZE = 20

    const snapToGrid = (value: number) => {
      return Math.round(value / GRID_SIZE) * GRID_SIZE
    }

    useImperativeHandle(ref, () => ({
      addRectangle: () => {
        if (!fabricCanvasRef.current || viewOnly) return
        
        const rect = new fabric.Rect({
          left: 100,
          top: 100,
          width: 200,
          height: 150,
          fill: "#3b82f6",
          stroke: "#1e40af",
          strokeWidth: 2,
        })
        
        fabricCanvasRef.current.add(rect)
        fabricCanvasRef.current.setActiveObject(rect)
        fabricCanvasRef.current.renderAll()
      },
      addCircle: () => {
        if (!fabricCanvasRef.current || viewOnly) return
        
        const circle = new fabric.Circle({
          left: 150,
          top: 150,
          radius: 75,
          fill: "#f97316",
          stroke: "#ea580c",
          strokeWidth: 2,
        })
        
        fabricCanvasRef.current.add(circle)
        fabricCanvasRef.current.setActiveObject(circle)
        fabricCanvasRef.current.renderAll()
      },
      addText: () => {
        if (!fabricCanvasRef.current || viewOnly) return
        
        const text = new fabric.IText("Double click to edit", {
          left: 100,
          top: 100,
          fontSize: 24,
          fill: "#1f2937",
          fontFamily: "Arial",
        })
        
        fabricCanvasRef.current.add(text)
        fabricCanvasRef.current.setActiveObject(text)
        fabricCanvasRef.current.renderAll()
      },
      toggleDrawingMode: () => {
        if (!fabricCanvasRef.current || viewOnly) return
        
        const newMode = !isDrawingMode
        setIsDrawingMode(newMode)
        fabricCanvasRef.current.isDrawingMode = newMode
        
        if (newMode) {
          fabricCanvasRef.current.freeDrawingBrush.color = "#1f2937"
          fabricCanvasRef.current.freeDrawingBrush.width = 3
        }
      },
      changeColor: (color: string) => {
        if (!fabricCanvasRef.current || viewOnly) return
        
        const activeObject = fabricCanvasRef.current.getActiveObject()
        if (!activeObject) return
        
        activeObject.set({ fill: color })
        fabricCanvasRef.current.renderAll()
      },
      getSelectedObject: () => selectedObject,
      lockObject: () => {
        if (!fabricCanvasRef.current || viewOnly) return
        const activeObject = fabricCanvasRef.current.getActiveObject()
        if (!activeObject) return
        
        activeObject.set({
          lockMovementX: true,
          lockMovementY: true,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
          selectable: true,
        })
        fabricCanvasRef.current.renderAll()
      },
      unlockObject: () => {
        if (!fabricCanvasRef.current || viewOnly) return
        const activeObject = fabricCanvasRef.current.getActiveObject()
        if (!activeObject) return
        
        activeObject.set({
          lockMovementX: false,
          lockMovementY: false,
          lockRotation: false,
          lockScalingX: false,
          lockScalingY: false,
        })
        fabricCanvasRef.current.renderAll()
      },
      deleteObject: () => {
        if (!fabricCanvasRef.current || viewOnly) return
        const activeObject = fabricCanvasRef.current.getActiveObject()
        if (!activeObject) return
        
        fabricCanvasRef.current.remove(activeObject)
        fabricCanvasRef.current.renderAll()
      },
    }))

    useEffect(() => {
      if (!canvasRef.current) return

      const canvas = new fabric.Canvas(canvasRef.current, {
        width: window.innerWidth,
        height: window.innerHeight - 64,
        backgroundColor: "#ffffff",
        selection: !viewOnly,
      })

      fabricCanvasRef.current = canvas

      if (viewOnly) {
        canvas.forEachObject((obj) => {
          obj.selectable = false
          obj.evented = false
        })
      }

      canvas.on("selection:created", (e) => {
        if (!viewOnly) {
          setSelectedObject(e.selected?.[0] || null)
        }
      })

      canvas.on("selection:updated", (e) => {
        if (!viewOnly) {
          setSelectedObject(e.selected?.[0] || null)
        }
      })

      canvas.on("selection:cleared", () => {
        setSelectedObject(null)
      })

      canvas.on("object:moving", (e) => {
        if (viewOnly) return
        const obj = e.target
        if (!obj) return

        obj.set({
          left: snapToGrid(obj.left || 0),
          top: snapToGrid(obj.top || 0),
        })
      })

      canvas.on("object:modified", () => {
        if (!viewOnly) {
          console.log("[v0] Object modified")
        }
      })

      return () => {
        canvas.dispose()
      }
    }, [viewOnly])

    return (
      <div className="relative w-full h-full">
        <canvas ref={canvasRef} />
      </div>
    )
  }
)

CanvasEditor.displayName = "CanvasEditor"