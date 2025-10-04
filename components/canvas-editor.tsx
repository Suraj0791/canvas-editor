"use client"

import { useEffect, useRef, useState } from "react"
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
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null)
  const [selectedTool, setSelectedTool] = useState<string>("select")
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)

  const { saveCanvas, loadCanvas } = useCanvasState(sceneId, fabricCanvas)
  const { undo, redo, canUndo, canRedo, recordState } = useCanvasHistory(fabricCanvas)

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight - 64, // Account for top bar
      backgroundColor: "#ffffff",
      selection: !viewOnly,
    })

    // Enable snap to grid
    canvas.on("object:moving", (e) => {
      const obj = e.target
      if (!obj) return

      const gridSize = 20
      obj.set({
        left: Math.round((obj.left || 0) / gridSize) * gridSize,
        top: Math.round((obj.top || 0) / gridSize) * gridSize,
      })
    })

    // Record state changes for undo/redo
    canvas.on("object:modified", () => {
      recordState()
      saveCanvas()
    })

    canvas.on("object:added", () => {
      recordState()
      saveCanvas()
    })

    canvas.on("object:removed", () => {
      recordState()
      saveCanvas()
    })

    setFabricCanvas(canvas)

    loadCanvas().then((exists) => {
      if (!exists && !viewOnly && !initialTemplate) {
        setShowTemplateDialog(true)
      }
    })

    // Handle window resize
    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 64,
      })
      canvas.renderAll()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.dispose()
    }
  }, [sceneId, viewOnly, initialTemplate, loadCanvas, recordState, saveCanvas])

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
        <div className="flex-1 overflow-auto">
          <canvas ref={canvasRef} />
        </div>
      </div>

      <TemplateDialog
        open={showTemplateDialog}
        onOpenChange={setShowTemplateDialog}
        canvas={fabricCanvas}
        initialTemplate={initialTemplate}
      />
    </div>
  )
}
