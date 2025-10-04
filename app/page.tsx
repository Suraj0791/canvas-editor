"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { generateSceneId } from "@/lib/utils"

export default function Home() {
  const router = useRouter()

  const createNewCanvas = () => {
    const sceneId = generateSceneId()
    router.push(`/canvas/${sceneId}`)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Canvas Editor</h1>
        <p className="text-muted-foreground text-lg">
          Create and share beautiful canvases with ease
        </p>
        <Button onClick={createNewCanvas} size="lg">
          Create New Canvas
        </Button>
      </div>
    </div>
  )
}