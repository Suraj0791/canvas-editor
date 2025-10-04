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
    console.log("[v0] Tool clicked:", toolId, "Canvas exists:", !!canvas)

    if (!canvas) {
      console.log("[v0] ERROR: Canvas is null, cannot use tool")
      return
    }

    onToolSelect(toolId)

    canvas.isDrawingMode = false
    canvas.selection = true

    if (toolId === "select") {
      canvas.defaultCursor = "default"
      console.log("[v0] Select tool activated")
    } else if (toolId === "pen") {
      canvas.isDrawingMode = true
      const brush = new PencilBrush(canvas)
      brush.color = color
      brush.width = 3
      canvas.freeDrawingBrush = brush
      console.log("[v0] Pen tool activated, drawing mode:", canvas.isDrawingMode)
    } else if (toolId === "rectangle") {
      const left = 100 + Math.random() * 200
      const top = 100 + Math.random() * 200

      const rect = new Rect({
        left,
        top,
        width: 150,
        height: 100,
        fill: color,
        stroke: "#000000",
        strokeWidth: 2,
      })

      console.log("[v0] Adding rectangle at:", { left, top, width: 150, height: 100, fill: color })
      canvas.add(rect)
      canvas.setActiveObject(rect)
      
      console.log("[v0] Rectangle added. Canvas objects count:", canvas.getObjects().length)
      console.log("[v0] Upper canvas element:", canvas.upperCanvasEl)
      console.log("[v0] Canvas is dirty:", canvas.isRendering())
      
      const ctx = canvas.getContext();
      console.log("[v0] Canvas context:", ctx)
      ctx.fillStyle = 'green';
      ctx.fillRect(0, 0, 50, 50);
    } else if (toolId === "circle") {
      const left = 100 + Math.random() * 200
      const top = 100 + Math.random() * 200

      const circle = new FabricCircle({
        left,
        top,
        radius: 50,
        fill: color,
        stroke: "#000000",
        strokeWidth: 2,
      })

      console.log("[v0] Adding circle at:", { left, top, radius: 50, fill: color })
      canvas.add(circle)
      canvas.setActiveObject(circle)
      canvas.requestRenderAll()

      setTimeout(() => {
        canvas.requestRenderAll()
        console.log("[v0] Force render after circle")
      }, 50)

      console.log("[v0] Circle added. Canvas objects count:", canvas.getObjects().length)
    } else if (toolId === "text") {
      const left = 100 + Math.random() * 200
      const top = 100 + Math.random() * 200

      const text = new IText("Double click to edit", {
        left,
        top,
        fill: color,
        fontSize: 24,
      })

      console.log("[v0] Adding text at:", { left, top, fill: color })
      canvas.add(text)
      canvas.setActiveObject(text)
      canvas.requestRenderAll()

      setTimeout(() => {
        canvas.requestRenderAll()
        console.log("[v0] Force render after text")
      }, 50)

      console.log("[v0] Text added. Canvas objects count:", canvas.getObjects().length)
    }
  }

  const handleDelete = () => {
    if (!canvas) return
    const activeObjects = canvas.getActiveObjects()
    if (activeObjects.length > 0) {
      activeObjects.forEach((obj) => canvas.remove(obj))
      canvas.discardActiveObject()
      canvas.requestRenderAll()
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
      canvas.requestRenderAll()
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
    canvas.requestRenderAll()
  }

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (activeObject) {
      activeObject.set("fill", newColor)
      canvas.requestRenderAll()
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
          disabled={!canvas}
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