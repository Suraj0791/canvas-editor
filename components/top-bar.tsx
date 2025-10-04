"use client"

import { Button } from "@/components/ui/button"
import { Share2, Undo2, Redo2, Download, Eye, LayoutTemplate } from "lucide-react"
import type { Canvas } from "fabric"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TopBarProps {
  sceneId: string
  viewOnly: boolean
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  canvas: Canvas | null
  onOpenTemplates: () => void
}

export function TopBar({ sceneId, viewOnly, onUndo, onRedo, canUndo, canRedo, canvas, onOpenTemplates }: TopBarProps) {
  const handleShare = () => {
    const url = `${window.location.origin}/canvas/${sceneId}`
    navigator.clipboard.writeText(url)
    toast.success("Link copied!", {
      description: "Canvas link has been copied to clipboard",
    })
  }

  const handleExportPNG = () => {
    if (!canvas) return
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
    })
    const link = document.createElement("a")
    link.download = `canvas-${sceneId}.png`
    link.href = dataURL
    link.click()
  }

  const handleExportSVG = () => {
    if (!canvas) return
    const svg = canvas.toSVG()
    const blob = new Blob([svg], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.download = `canvas-${sceneId}.svg`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
            />
          </svg>
        </div>
        <h1 className="text-lg font-semibold text-neutral-900">Canvas Editor</h1>
        {viewOnly && (
          <div className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
            <Eye className="h-3 w-3" />
            View Only
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!viewOnly && (
          <>
            <Button variant="ghost" size="sm" onClick={onOpenTemplates} className="gap-2">
              <LayoutTemplate className="h-4 w-4" />
              Templates
            </Button>
            <div className="mx-2 h-6 w-px bg-neutral-200" />
            <Button variant="ghost" size="sm" onClick={onUndo} disabled={!canUndo} className="gap-2">
              <Undo2 className="h-4 w-4" />
              Undo
            </Button>
            <Button variant="ghost" size="sm" onClick={onRedo} disabled={!canRedo} className="gap-2">
              <Redo2 className="h-4 w-4" />
              Redo
            </Button>
            <div className="mx-2 h-6 w-px bg-neutral-200" />
          </>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportPNG}>Export as PNG</DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportSVG}>Export as SVG</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={handleShare} size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share Canvas
        </Button>
      </div>
    </div>
  )
}
