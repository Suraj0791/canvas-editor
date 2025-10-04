"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Canvas } from "fabric"
import { Rect, Circle as FabricCircle, IText } from "fabric"
import { useEffect } from "react"

interface TemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  canvas: Canvas | null
  initialTemplate?: string
}

const templates = [
  {
    id: "blank",
    name: "Blank Canvas",
    description: "Start with an empty canvas",
    preview: "bg-white",
  },
  {
    id: "presentation",
    name: "Presentation Slide",
    description: "Title and content layout",
    preview: "bg-gradient-to-br from-blue-50 to-blue-100",
  },
  {
    id: "wireframe",
    name: "Wireframe",
    description: "Basic UI wireframe layout",
    preview: "bg-gradient-to-br from-gray-50 to-gray-100",
  },
  {
    id: "diagram",
    name: "Flowchart",
    description: "Connected shapes for diagrams",
    preview: "bg-gradient-to-br from-purple-50 to-purple-100",
  },
]

export function TemplateDialog({ open, onOpenChange, canvas, initialTemplate }: TemplateDialogProps) {
  const applyTemplate = (templateId: string) => {
    if (!canvas) return

    // Clear existing canvas
    canvas.clear()
    canvas.backgroundColor = "#ffffff"

    switch (templateId) {
      case "blank":
        // Nothing to add
        break

      case "presentation":
        // Add title
        const title = new IText("Presentation Title", {
          left: 100,
          top: 80,
          fontSize: 48,
          fontWeight: "bold",
          fill: "#1F2937",
        })
        canvas.add(title)

        // Add subtitle
        const subtitle = new IText("Add your subtitle here", {
          left: 100,
          top: 150,
          fontSize: 24,
          fill: "#6B7280",
        })
        canvas.add(subtitle)

        // Add content area
        const contentBox = new Rect({
          left: 100,
          top: 220,
          width: 600,
          height: 300,
          fill: "#F3F4F6",
          stroke: "#D1D5DB",
          strokeWidth: 2,
          rx: 8,
          ry: 8,
        })
        canvas.add(contentBox)

        const contentText = new IText("Add your content here", {
          left: 120,
          top: 240,
          fontSize: 18,
          fill: "#4B5563",
        })
        canvas.add(contentText)
        break

      case "wireframe":
        // Header
        const header = new Rect({
          left: 50,
          top: 50,
          width: 700,
          height: 80,
          fill: "#E5E7EB",
          stroke: "#9CA3AF",
          strokeWidth: 2,
        })
        canvas.add(header)

        const headerText = new IText("Header", {
          left: 70,
          top: 75,
          fontSize: 20,
          fill: "#374151",
        })
        canvas.add(headerText)

        // Sidebar
        const sidebar = new Rect({
          left: 50,
          top: 150,
          width: 200,
          height: 400,
          fill: "#F3F4F6",
          stroke: "#9CA3AF",
          strokeWidth: 2,
        })
        canvas.add(sidebar)

        const sidebarText = new IText("Sidebar", {
          left: 70,
          top: 170,
          fontSize: 16,
          fill: "#374151",
        })
        canvas.add(sidebarText)

        // Main content
        const mainContent = new Rect({
          left: 270,
          top: 150,
          width: 480,
          height: 400,
          fill: "#FFFFFF",
          stroke: "#9CA3AF",
          strokeWidth: 2,
        })
        canvas.add(mainContent)

        const mainText = new IText("Main Content", {
          left: 290,
          top: 170,
          fontSize: 16,
          fill: "#374151",
        })
        canvas.add(mainText)
        break

      case "diagram":
        // Create flowchart shapes
        const step1 = new Rect({
          left: 150,
          top: 100,
          width: 150,
          height: 80,
          fill: "#3B82F6",
          rx: 8,
          ry: 8,
        })
        canvas.add(step1)

        const step1Text = new IText("Start", {
          left: 200,
          top: 130,
          fontSize: 18,
          fill: "#FFFFFF",
        })
        canvas.add(step1Text)

        const step2 = new FabricCircle({
          left: 175,
          top: 250,
          radius: 60,
          fill: "#10B981",
        })
        canvas.add(step2)

        const step2Text = new IText("Process", {
          left: 195,
          top: 295,
          fontSize: 16,
          fill: "#FFFFFF",
        })
        canvas.add(step2Text)

        const step3 = new Rect({
          left: 150,
          top: 400,
          width: 150,
          height: 80,
          fill: "#F97316",
          rx: 8,
          ry: 8,
        })
        canvas.add(step3)

        const step3Text = new IText("End", {
          left: 205,
          top: 430,
          fontSize: 18,
          fill: "#FFFFFF",
        })
        canvas.add(step3Text)
        break
    }

    canvas.renderAll()
    onOpenChange(false)
  }

  useEffect(() => {
    if (initialTemplate && canvas && !open) {
      applyTemplate(initialTemplate)
    }
  }, [initialTemplate, canvas])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>Select a template to start your canvas or begin with a blank canvas</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => applyTemplate(template.id)}
              className="group flex flex-col gap-3 rounded-lg border-2 border-neutral-200 p-4 text-left transition-all hover:border-primary hover:shadow-md"
            >
              <div className={`h-32 w-full rounded ${template.preview} border border-neutral-200`} />
              <div>
                <h3 className="font-semibold text-neutral-900 group-hover:text-primary">{template.name}</h3>
                <p className="text-sm text-neutral-600">{template.description}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
