"use client"

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react"
import { fabric } from "fabric"
import { useCanvasState } from "@/hooks/use-canvas-state"
import { useCanvasHistory } from "@/hooks/use-canvas-history"

interface CanvasEditorProps {
  sceneId: string
  viewOnly?: boolean
  onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void
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
  undo: () => void
  redo: () => void
  exportAsPNG: () => void
}

export const CanvasEditor = forwardRef<CanvasEditorRef, CanvasEditorProps>(
  ({ sceneId, viewOnly = false, onHistoryChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
    const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null)
    const [isDrawingMode, setIsDrawingMode] = useState(false)
    const { loadCanvas, saveCanvas } = useCanvasState(sceneId, viewOnly)
    const { saveState, undo, redo, canUndo, canRedo, updateHistoryState } = useCanvasHistory()
    const isLoadingRef = useRef(false)

    const GRID_SIZE = 20

    const snapToGrid = (value: number) => {
      return Math.round(value / GRID_SIZE) * GRID_SIZE
    }

    const handleCanvasChange = () => {
      if (!fabricCanvasRef.current || viewOnly || isLoadingRef.current) return
      
      const json = fabricCanvasRef.current.toJSON()
      const jsonString = JSON.stringify(json)
      
      saveState(jsonString)
      updateHistoryState()
      
      saveCanvas({
        objects: json.objects,
        background: json.background,
      })
    }

    useEffect(() => {
      if (onHistoryChange) {
        onHistoryChange(canUndo, canRedo)
      }
    }, [canUndo, canRedo, onHistoryChange])

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
        handleCanvasChange()
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
        handleCanvasChange()
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
        handleCanvasChange()
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
        handleCanvasChange()
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
        handleCanvasChange()
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
        handleCanvasChange()
      },
      deleteObject: () => {
        if (!fabricCanvasRef.current || viewOnly) return
        const activeObject = fabricCanvasRef.current.getActiveObject()
        if (!activeObject) return
        
        fabricCanvasRef.current.remove(activeObject)
        fabricCanvasRef.current.renderAll()
        handleCanvasChange()
      },
      undo: () => {
        if (!fabricCanvasRef.current || viewOnly) return
        const prevState = undo()
        if (prevState) {
          isLoadingRef.current = true
          fabricCanvasRef.current.loadFromJSON(JSON.parse(prevState), () => {
            fabricCanvasRef.current?.renderAll()
            isLoadingRef.current = false
            updateHistoryState()
          })
        }
      },
      redo: () => {
        if (!fabricCanvasRef.current || viewOnly) return
        const nextState = redo()
        if (nextState) {
          isLoadingRef.current = true
          fabricCanvasRef.current.loadFromJSON(JSON.parse(nextState), () => {
            fabricCanvasRef.current?.renderAll()
            isLoadingRef.current = false
            updateHistoryState()
          })
        }
      },
      exportAsPNG: () => {
        if (!fabricCanvasRef.current) return
        
        const dataURL = fabricCanvasRef.current.toDataURL({
          format: "png",
          quality: 1,
        })
        
        const link = document.createElement("a")
        link.download = `canvas-${sceneId}.png`
        link.href = dataURL
        link.click()
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

      loadCanvas().then((data) => {
        isLoadingRef.current = true
        if (data && data.objects) {
          canvas.loadFromJSON({ objects: data.objects, background: data.background }, () => {
            canvas.renderAll()
            const initialState = JSON.stringify(canvas.toJSON())
            saveState(initialState)
            updateHistoryState()
            isLoadingRef.current = false
            console.log("[v0] Canvas loaded from Firebase")
          })
        } else {
          const initialState = JSON.stringify(canvas.toJSON())
          saveState(initialState)
          updateHistoryState()
          isLoadingRef.current = false
        }
      })

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
          handleCanvasChange()
        }
      })

      canvas.on("path:created", () => {
        if (!viewOnly) {
          handleCanvasChange()
        }
      })

      return () => {
        canvas.dispose()
      }
    }, [viewOnly, sceneId])

    return (
      <div className="relative w-full h-full">
        <canvas ref={canvasRef} />
      </div>
    )
  }
)

CanvasEditor.displayName = "CanvasEditor"