"use client"

import { Button } from "@/components/ui/button"
import { Square, Circle, Type, Pencil, MousePointer2, Trash2, Lock, Unlock } from "lucide-react"
import { type Canvas, Rect, Circle as FabricCircle, IText, PencilBrush } from "fabric"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ToolbarProps {
  canvas: Canvas | null
  selectedTool: string
  onToolSelect: (tool: string) => void
}

export function Toolbar({ canvas, selectedTool, onToolSelect }: ToolbarProps) {
  const [color, setColor] = useState("#3B82F6")

  const tools = [
    { id: "select", icon: MousePointer2, label: "Select" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "text", icon: Type, label: "Text" },
    { id: "pen", icon: Pencil, label: "Pen" },
  ]

  const handleToolClick = (toolId: string) => {
    if (!canvas) return
    onToolSelect(toolId)

    // Disable drawing mode by default
    canvas.isDrawingMode = false

    if (toolId === "select") {
      canvas.defaultCursor = "default"
    } else if (toolId === "pen") {
      canvas.isDrawingMode = true
      canvas.freeDrawingBrush = new PencilBrush(canvas)
      canvas.freeDrawingBrush.color = color
      canvas.freeDrawingBrush.width = 3
    } else if (toolId === "rectangle") {
      const rect = new Rect({
        left: 100,
        top: 100,
        width: 150,
        height: 100,
        fill: color,
      })
      canvas.add(rect)
      canvas.setActiveObject(rect)
      canvas.renderAll()
      onToolSelect("select")
    } else if (toolId === "circle") {
      const circle = new FabricCircle({
        left: 100,
        top: 100,
        radius: 50,
        fill: color,
      })
      canvas.add(circle)
      canvas.setActiveObject(circle)
      canvas.renderAll()
      onToolSelect("select")
    } else if (toolId === "text") {
      const text = new IText("Double click to edit", {
        left: 100,
        top: 100,
        fill: color,
        fontSize: 24,
      })
      canvas.add(text)
      canvas.setActiveObject(text)
      canvas.renderAll()
      onToolSelect("select")
    }
  }

  const handleDelete = () => {
    if (!canvas) return
    const activeObjects = canvas.getActiveObjects()
    if (activeObjects.length > 0) {
      activeObjects.forEach((obj) => canvas.remove(obj))
      canvas.discardActiveObject()
      canvas.renderAll()
    }
  }

  const handleLock = () => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (activeObject) {
      activeObject.set({
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        selectable: false,
      })
      canvas.discardActiveObject()
      canvas.renderAll()
    }
  }

  const handleUnlock = () => {
    if (!canvas) return
    const objects = canvas.getObjects()
    objects.forEach((obj) => {
      obj.set({
        lockMovementX: false,
        lockMovementY: false,
        lockRotation: false,
        lockScalingX: false,
        lockScalingY: false,
        selectable: true,
      })
    })
    canvas.renderAll()
  }

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (activeObject) {
      activeObject.set("fill", newColor)
      canvas.renderAll()
    }
  }

  return (
    <div className="flex w-20 flex-col items-center gap-2 border-r border-neutral-200 bg-white py-6">
      {tools.map((tool) => (
        <Button
          key={tool.id}
          variant={selectedTool === tool.id ? "default" : "ghost"}
          size="icon"
          onClick={() => handleToolClick(tool.id)}
          title={tool.label}
          className="h-12 w-12"
        >
          <tool.icon className="h-5 w-5" />
        </Button>
      ))}

      <div className="my-2 h-px w-12 bg-neutral-200" />

      <div className="flex flex-col items-center gap-2 px-2">
        <Label htmlFor="color" className="sr-only">
          Color
        </Label>
        <Input
          id="color"
          type="color"
          value={color}
          onChange={(e) => handleColorChange(e.target.value)}
          className="h-12 w-12 cursor-pointer border-2 p-1"
        />
      </div>

      <div className="my-2 h-px w-12 bg-neutral-200" />

      <Button variant="ghost" size="icon" onClick={handleLock} title="Lock Selected" className="h-12 w-12">
        <Lock className="h-5 w-5" />
      </Button>

      <Button variant="ghost" size="icon" onClick={handleUnlock} title="Unlock All" className="h-12 w-12">
        <Unlock className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        title="Delete Selected"
        className="h-12 w-12 text-destructive hover:text-destructive"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  )
}
