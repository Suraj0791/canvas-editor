"use client"

import { Button } from "@/components/ui/button"
import { Square, Circle, Type, Pencil, MousePointer2, Trash2, Lock, Unlock, Pentagon } from "lucide-react"
import { type Canvas, Rect, Circle as FabricCircle, IText, PencilBrush, Polygon, Line } from "fabric"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ToolbarProps {
  canvas: Canvas | null
  selectedTool: string
  onToolSelect: (tool: string) => void
}

export function Toolbar({ canvas, selectedTool, onToolSelect }: ToolbarProps) {
  const [color, setColor] = useState("#3B82F6")
  const [polygonPoints, setPolygonPoints] = useState<{x: number, y: number}[]>([])
  const [isDrawingPolygon, setIsDrawingPolygon] = useState(false)
  const [tempLines, setTempLines] = useState<Line[]>([])

  const tools = [
    { id: "select", icon: MousePointer2, label: "Select" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "polygon", icon: Pentagon, label: "Polygon" },
    { id: "text", icon: Type, label: "Text" },
    { id: "pen", icon: Pencil, label: "Pen" },
  ]

  useEffect(() => {
    if (!canvas) return

    const handleClick = (e: any) => {
      if (selectedTool !== "polygon") return

      const pointer = canvas.getPointer(e.e)

      if (!isDrawingPolygon) {
        setIsDrawingPolygon(true)
        setPolygonPoints([{ x: pointer.x, y: pointer.y }])
      } else {
        const newPoints = [...polygonPoints, { x: pointer.x, y: pointer.y }]
        setPolygonPoints(newPoints)

        if (polygonPoints.length > 0) {
          const lastPoint = polygonPoints[polygonPoints.length - 1]
          const line = new Line([lastPoint.x, lastPoint.y, pointer.x, pointer.y], {
            stroke: color,
            strokeWidth: 2,
            selectable: false,
            evented: false,
          })
          canvas.add(line)
          setTempLines(prev => [...prev, line])
        }
      }
    }

    const handleDoubleClick = () => {
      if (!isDrawingPolygon || polygonPoints.length < 3) return

      tempLines.forEach(line => canvas.remove(line))
      setTempLines([])

      const polygon = new Polygon(polygonPoints, {
        fill: color,
        stroke: "#000000",
        strokeWidth: 2,
      })

      canvas.add(polygon)
      canvas.setActiveObject(polygon)
      canvas.renderAll()

      setIsDrawingPolygon(false)
      setPolygonPoints([])
    }

    canvas.on("mouse:down", handleClick)
    canvas.on("mouse:dblclick", handleDoubleClick)

    return () => {
      canvas.off("mouse:down", handleClick)
      canvas.off("mouse:dblclick", handleDoubleClick)
    }
  }, [canvas, selectedTool, isDrawingPolygon, polygonPoints, tempLines, color])

  useEffect(() => {
    if (selectedTool !== "polygon" && isDrawingPolygon) {
      tempLines.forEach(line => canvas?.remove(line))
      setTempLines([])
      setIsDrawingPolygon(false)
      setPolygonPoints([])
    }
  }, [selectedTool])

  const handleToolClick = (toolId: string) => {
    if (!canvas) return

    onToolSelect(toolId)
    canvas.isDrawingMode = false
    canvas.selection = true

    if (toolId === "select") {
      canvas.defaultCursor = "default"
    } else if (toolId === "pen") {
      canvas.isDrawingMode = true
      const brush = new PencilBrush(canvas)
      brush.color = color
      brush.width = 3
      canvas.freeDrawingBrush = brush
    } else if (toolId === "polygon") {
      canvas.defaultCursor = "crosshair"
    } else if (toolId === "rectangle") {
      const rect = new Rect({
        left: 100 + Math.random() * 200,
        top: 100 + Math.random() * 200,
        width: 150,
        height: 100,
        fill: color,
        stroke: "#000000",
        strokeWidth: 2,
      })
      canvas.add(rect)
      canvas.setActiveObject(rect)
    } else if (toolId === "circle") {
      const circle = new FabricCircle({
        left: 100 + Math.random() * 200,
        top: 100 + Math.random() * 200,
        radius: 50,
        fill: color,
        stroke: "#000000",
        strokeWidth: 2,
      })
      canvas.add(circle)
      canvas.setActiveObject(circle)
    } else if (toolId === "text") {
      const text = new IText("Double click to edit", {
        left: 100 + Math.random() * 200,
        top: 100 + Math.random() * 200,
        fill: color,
        fontSize: 24,
      })
      canvas.add(text)
      canvas.setActiveObject(text)
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
        selectable: true,
      })
      canvas.discardActiveObject()
      canvas.requestRenderAll()
    }
  }

  const handleUnlock = () => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (activeObject) {
      activeObject.set({
        lockMovementX: false,
        lockMovementY: false,
        lockRotation: false,
        lockScalingX: false,
        lockScalingY: false,
        selectable: true,
      })
    }
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

      <Button variant="ghost" size="icon" onClick={handleUnlock} title="Unlock Selected" className="h-12 w-12">
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

      {isDrawingPolygon && (
        <div className="absolute bottom-4 left-20 bg-white p-2 rounded shadow text-xs">
          Click to add points, double-click to finish
        </div>
      )}
    </div>
  )
}