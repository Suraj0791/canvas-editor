"use client"

import { ArrowLeft, Share2, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface TopBarProps {
  sceneId: string
  viewOnly?: boolean
}

export function TopBar({ sceneId, viewOnly = false }: TopBarProps) {
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
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Canvas Editor</h1>
        {viewOnly && (
          <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">View Only</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!viewOnly && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        )}
        <span className="text-sm text-muted-foreground">
          Scene: {sceneId}
        </span>
      </div>
    </div>
  )
}