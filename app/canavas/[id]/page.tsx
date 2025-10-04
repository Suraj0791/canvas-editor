import { CanvasEditor } from "@/components/canvas-editor"

export default function CanvasPage({ 
  params,
  searchParams 
}: { 
  params: { id: string }
  searchParams: { viewOnly?: string }
}) {
  const viewOnly = searchParams.viewOnly === "true"
  
  return <CanvasEditor sceneId={params.id} viewOnly={viewOnly} />
}