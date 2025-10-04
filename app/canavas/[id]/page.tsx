"use client"

import { useRef } from "react"
import { CanvasEditor, CanvasEditorRef } from "@/components/canvas-editor"
import { Toolbar } from "@/components/toolbar"

export default function CanvasPage({ 
  params,
  searchParams 
}: { 
  params: { id: string }
  searchParams: { viewOnly?: string }
}) {
  const viewOnly = searchParams.viewOnly === "true"
  const canvasRef = useRef<CanvasEditorRef>(null)
  
  return (
    <>
      <CanvasEditor ref={canvasRef} sceneId={params.id} viewOnly={viewOnly} />
      {!viewOnly && (
<Toolbar 
  onAddRectangle={() => canvasRef.current?.addRectangle()}
  onAddCircle={() => canvasRef.current?.addCircle()}
  onAddText={() => canvasRef.current?.addText()} // <CHANGE> Added text handler
/>
      )}
    </>
  )
}