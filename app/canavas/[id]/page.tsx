"use client"

import { useRef, useState, useEffect } from "react"
import { CanvasEditor, CanvasEditorRef } from "@/components/canvas-editor"
import { Toolbar } from "@/components/toolbar"
import { TopBar } from "@/components/top-bar"

export default function CanvasPage({ 
  params,
  searchParams 
}: { 
  params: { id: string }
  searchParams: { viewOnly?: string }
}) {
  const viewOnly = searchParams.viewOnly === "true"
  const canvasRef = useRef<CanvasEditorRef>(null)
  const [hasSelection, setHasSelection] = useState(false)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const selected = canvasRef.current?.getSelectedObject()
      setHasSelection(!!selected)
    }, 100)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (viewOnly) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        canvasRef.current?.undo()
      }
      
      if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault()
        canvasRef.current?.redo()
      }
      
      if ((e.key === "Delete" || e.key === "Backspace") && hasSelection) {
        e.preventDefault()
        canvasRef.current?.deleteObject()
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === "e") {
        e.preventDefault()
        canvasRef.current?.exportAsPNG()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [viewOnly, hasSelection])

  const handleHistoryChange = (undo: boolean, redo: boolean) => {
    setCanUndo(undo)
    setCanRedo(redo)
  }
  
  return (
    <div className="relative w-full h-screen">
      <TopBar 
        sceneId={params.id} 
        viewOnly={viewOnly}
        onUndo={() => canvasRef.current?.undo()}
        onRedo={() => canvasRef.current?.redo()}
        onExport={() => canvasRef.current?.exportAsPNG()}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <div className="pt-16 h-full">
        <CanvasEditor 
          ref={canvasRef} 
          sceneId={params.id} 
          viewOnly={viewOnly}
          onHistoryChange={handleHistoryChange}
        />
      </div>
      {!viewOnly && (
        <Toolbar 
          onAddRectangle={() => canvasRef.current?.addRectangle()}
          onAddCircle={() => canvasRef.current?.addCircle()}
          onAddText={() => canvasRef.current?.addText()}
          onToggleDrawing={() => canvasRef.current?.toggleDrawingMode()}
          onChangeColor={(color) => canvasRef.current?.changeColor(color)}
          hasSelection={hasSelection}
          onLock={() => canvasRef.current?.lockObject()}
          onUnlock={() => canvasRef.current?.unlockObject()}
          onDelete={() => canvasRef.current?.deleteObject()}
        />
      )}
    </div>
  )
}