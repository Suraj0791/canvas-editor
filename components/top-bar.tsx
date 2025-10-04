"use client"

import { ArrowLeft, Share2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface TopBarProps {
  sceneId: string
  viewOnly?: boolean
}

export function TopBar({ sceneId, viewOnly = false }: TopBarProps) {
  const router = useRouter()

  const handleShare = async () => {
    const url = `${window.location.origin}/canvas/${sceneId}?viewOnly=true`
    
    try {
      await navigator.clipboard.writeText(url)
      alert("Link copied to clipboard!")
    } catch (err) {
      console.error("Failed to copy:", err)
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
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <span className="text-sm text-muted-foreground">
          Scene: {sceneId}
        </span>
      </div>
    </div>
  )
}