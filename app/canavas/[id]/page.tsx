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