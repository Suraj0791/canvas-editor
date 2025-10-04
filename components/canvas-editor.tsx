"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Canvas } from "fabric"
import { Toolbar } from "@/components/toolbar"
import { TopBar } from "@/components/top-bar"
import { TemplateDialog } from "@/components/template-dialog"
import { useCanvasState } from "@/hooks/use-canvas-state"
import { useCanvasHistory } from "@/hooks/use-canvas-history"

interface CanvasEditorProps {
  sceneId: string
  viewOnly?: boolean
  initialTemplate?: string
}

export function CanvasEditor({ sceneId, viewOnly = false, initialTemplate }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null)
  const [selectedTool, setSelectedTool] = useState<string>("select")
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const { saveCanvas, loadCanvas } = useCanvasState(sceneId, fabricCanvas)
  const { undo, redo, canUndo, canRedo, recordState } = useCanvasHistory(fabricCanvas)

  const handleSaveCanvas = useCallback(() => {
    if (fabricCanvas && isInitialized) {
      saveCanvas()
    }
  }, [fabricCanvas, isInitialized, saveCanvas])

  const handleRecordState = useCallback(() => {
    if (fabricCanvas && isInitialized) {
      recordState()
    }
  }, [fabricCanvas, isInitialized, recordState])

  useEffect(() => {
    if (!canvasRef.current || fabricCanvas) return

    const width = window.innerWidth - (viewOnly ? 0 : 80)
    const height = window.innerHeight - 64

    canvasRef.current.width = width
    canvasRef.current.height = height

    const canvas = new Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: "#ffffff",
      selection: true,
      renderOnAddRemove: true,
      enableRetinaScaling: false,
    })

    canvas.defaultCursor = "default"
    canvas.hoverCursor = "move"
    canvas.moveCursor = "move"

    console.log("[Canvas] Initialized:", {
      width: canvas.width,
      height: canvas.height,
      element: canvasRef.current,
    })

    canvas.on("object:moving", (e) => {
      const obj = e.target
      if (!obj) return

      const gridSize = 20
      obj.set({
        left: Math.round((obj.left || 0) / gridSize) * gridSize,
        top: Math.round((obj.top || 0) / gridSize) * gridSize,
      })
    })

    canvas.renderAll()
    setFabricCanvas(canvas)

    const handleResize = () => {
      const newWidth = window.innerWidth - (viewOnly ? 0 : 80)
      const newHeight = window.innerHeight - 64

      if (canvasRef.current) {
        canvasRef.current.width = newWidth
        canvasRef.current.height = newHeight
      }

      canvas.setDimensions({
        width: newWidth,
        height: newHeight,
      })
      canvas.renderAll()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.dispose()
    }
  }, [viewOnly, fabricCanvas])

  useEffect(() => {
    if (!fabricCanvas || isInitialized) return

    loadCanvas().then((exists) => {
      setIsInitialized(true)
      if (!exists && !viewOnly && !initialTemplate) {
        setShowTemplateDialog(true)
      }
    })
  }, [fabricCanvas, isInitialized, loadCanvas, viewOnly, initialTemplate])

  useEffect(() => {
    if (!fabricCanvas || !isInitialized) return

    const handleModified = () => {
      handleRecordState()
      handleSaveCanvas()
    }

    fabricCanvas.on("object:modified", handleModified)
    fabricCanvas.on("object:added", handleModified)
    fabricCanvas.on("object:removed", handleModified)

    return () => {
      fabricCanvas.off("object:modified", handleModified)
      fabricCanvas.off("object:added", handleModified)
      fabricCanvas.off("object:removed", handleModified)
    }
  }, [fabricCanvas, isInitialized, handleRecordState, handleSaveCanvas])

  return (
    <div className="flex h-screen flex-col bg-neutral-50">
      <TopBar
        sceneId={sceneId}
        viewOnly={viewOnly}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        canvas={fabricCanvas}
        onOpenTemplates={() => setShowTemplateDialog(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        {!viewOnly && <Toolbar canvas={fabricCanvas} selectedTool={selectedTool} onToolSelect={setSelectedTool} />}
        <div ref={containerRef} className="flex-1 flex items-center justify-center bg-neutral-100 p-8">
          <canvas 
            ref={canvasRef} 
            className="shadow-2xl border border-neutral-300"
            style={{ 
              display: 'block',
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          />
        </div>
      </div>

      <TemplateDialog
        open={showTemplateDialog}
        onOpenChange={setShowTemplateDialog}
        canvas={fabricCanvas}
        initialTemplate={initialTemplate}
        isCanvasReady={isInitialized}
      />
    </div>
  )
}