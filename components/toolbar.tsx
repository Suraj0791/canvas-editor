"use client"

import { Square, Circle, Type, Pencil, Lock, Unlock, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface ToolbarProps {
  onAddRectangle: () => void
  onAddCircle: () => void
  onAddText: () => void
  onToggleDrawing: () => void
  onChangeColor: (color: string) => void
  hasSelection: boolean
  onLock: () => void
  onUnlock: () => void
  onDelete: () => void
}

const colors = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#1f2937",
]

export function Toolbar({
  onAddRectangle,
  onAddCircle,
  onAddText,
  onToggleDrawing,
  onChangeColor,
  hasSelection,
  onLock,
  onUnlock,
  onDelete,
}: ToolbarProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg border p-2 flex flex-wrap items-center gap-2 max-w-[95vw] z-10">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onAddRectangle}
          title="Add Rectangle (R)"
          className="h-9 w-9"
        >
          <Square className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onAddCircle}
          title="Add Circle (C)"
          className="h-9 w-9"
        >
          <Circle className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onAddText}
          title="Add Text (T)"
          className="h-9 w-9"
        >
          <Type className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleDrawing}
          title="Draw (D)"
          className="h-9 w-9"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 hidden sm:block" />

      <div className="flex items-center gap-1">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onChangeColor(color)}
            className="w-7 h-7 rounded border-2 border-gray-300 hover:border-gray-400 transition-colors"
            style={{ backgroundColor: color }}
            title={`Color: ${color}`}
          />
        ))}
      </div>

      {hasSelection && (
        <>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onLock}
              title="Lock Object"
              className="h-9 w-9"
            >
              <Lock className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onUnlock}
              title="Unlock Object"
              className="h-9 w-9"
            >
              <Unlock className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              title="Delete (Del)"
              className="h-9 w-9 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}