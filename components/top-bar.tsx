"use client"

import { ArrowLeft, Share2, Eye, Undo2, Redo2, Download, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TopBarProps {
  sceneId: string
  viewOnly?: boolean
  onUndo?: () => void
  onRedo?: () => void
  onExport?: () => void
  canUndo?: boolean
  canRedo?: boolean
}

export function TopBar({ 
  sceneId, 
  viewOnly = false,
  onUndo,
  onRedo,
  onExport,
  canUndo = false,
  canRedo = false
}: TopBarProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleShare = async () => {
    const url = `${window.location.origin}/canvas/${sceneId}?viewOnly=true`
    
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Link copied!",
        description: "Share this link to let others view your canvas.",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="absolute top-0 left-0 right-0 h-16 bg-white border-b flex items-center justify-between px-4 z-20">
      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-base sm:text-lg font-semibold hidden sm:block">Canvas Editor</h1>
        <h1 className="text-base font-semibold sm:hidden">Canvas</h1>
        {viewOnly && (
          <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-muted rounded-md">
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">View Only</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!viewOnly && (
          <>
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onUndo}
                disabled={!canUndo}
                title="Undo"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRedo}
                disabled={!canRedo}
                title="Redo"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onUndo} disabled={!canUndo}>
                  <Undo2 className="h-4 w-4 mr-2" />
                  Undo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onRedo} disabled={!canRedo}>
                  <Redo2 className="h-4 w-4 mr-2" />
                  Redo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
        <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">
          Scene: {sceneId}
        </span>
      </div>
    </div>
  )
}