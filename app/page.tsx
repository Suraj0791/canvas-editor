"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateSceneId } from "@/lib/utils"
import { FileText, Layout, Workflow, Sparkles } from "lucide-react"

const templates = [
  {
    id: "blank",
    name: "Blank Canvas",
    description: "Start with an empty canvas",
    icon: Sparkles,
    gradient: "from-blue-50 to-blue-100",
  },
  {
    id: "presentation",
    name: "Presentation Slide",
    description: "Title and content layout",
    icon: FileText,
    gradient: "from-purple-50 to-purple-100",
  },
  {
    id: "wireframe",
    name: "Wireframe",
    description: "Basic UI wireframe layout",
    icon: Layout,
    gradient: "from-green-50 to-green-100",
  },
  {
    id: "diagram",
    name: "Flowchart",
    description: "Connected shapes for diagrams",
    icon: Workflow,
    gradient: "from-orange-50 to-orange-100",
  },
]

export default function HomePage() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  const createCanvas = (templateId: string) => {
    setIsCreating(true)
    const sceneId = generateSceneId()
    router.push(`/canvas/${sceneId}?template=${templateId}`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-neutral-50 to-neutral-100">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold text-primary">Canvas Editor</h1>
          <p className="text-sm text-muted-foreground">Create and share beautiful canvases</p>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-neutral-900">Choose a Template</h2>
            <p className="text-lg text-neutral-600">
              Select a template to start your canvas or begin with a blank canvas
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {templates.map((template) => {
              const Icon = template.icon
              return (
                <Card
                  key={template.id}
                  className="group cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                  onClick={() => createCanvas(template.id)}
                >
                  <CardHeader>
                    <div
                      className={`mb-4 flex h-32 items-center justify-center rounded-lg bg-gradient-to-br ${template.gradient}`}
                    >
                      <Icon className="h-12 w-12 text-neutral-600" />
                    </div>
                    <CardTitle className="group-hover:text-primary">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" disabled={isCreating}>
                      {isCreating ? "Creating..." : "Start Creating"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>

      <footer className="border-t bg-white/80 backdrop-blur-sm py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Built with Next.js and Fabric.js
        </div>
      </footer>
    </div>
  )
}
