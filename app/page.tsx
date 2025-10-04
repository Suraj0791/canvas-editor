"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from 'lucide-react'
import { templates } from "@/lib/templates"

export default function Home() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<string>("blank")

  const handleCreateCanvas = () => {
    const sceneId = Math.random().toString(36).substring(7)
    const template = templates.find(t => t.id === selectedTemplate)
    
    if (template && template.objects.length > 0) {
      localStorage.setItem(`canvas-template-${sceneId}`, JSON.stringify(template.objects))
    }
    
    router.push(`/canvas/${sceneId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">Canvas Editor</h1>
          <p className="text-xl text-gray-600">Create and share beautiful canvases with real-time collaboration</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Choose a Template</CardTitle>
            <CardDescription>Start with a template or create a blank canvas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedTemplate === template.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </button>
              ))}
            </div>

            <Button 
              onClick={handleCreateCanvas}
              size="lg"
              className="w-full"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create New Canvas
            </Button>
          </CardContent>
        </Card>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">Features:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
            <span>✓ Real-time saving</span>
            <span>✓ Share with view-only links</span>
            <span>✓ Undo/Redo support</span>
            <span>✓ Export as PNG</span>
            <span>✓ Keyboard shortcuts</span>
          </div>
        </div>
      </div>
    </div>
  )
}