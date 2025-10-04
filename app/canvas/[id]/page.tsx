"use client"

import { CanvasEditor } from "@/components/canvas-editor"
import { use } from "react"

interface CanvasPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ viewOnly?: string; template?: string }>
}

export default function CanvasPage({ params, searchParams }: CanvasPageProps) {
  const { id } = use(params)
  const { viewOnly, template } = use(searchParams)
  const isViewOnly = viewOnly === "true"

  return <CanvasEditor sceneId={id} viewOnly={isViewOnly} initialTemplate={template} />
}
