"use client"

import { Square, Circle, Type, Pen } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface ToolbarProps {
  onAddRectangle: () => void
  onAddCircle: () => void
  onAddText: () => void
  onToggleDrawing: () => void
}

export function Toolbar({ onAddRectangle, onAddCircle }: ToolbarProps) {


    const [isDrawing, setIsDrawing] = useState(false)

  const handleDrawingToggle = () => {
    setIsDrawing(!isDrawing)
    onToggleDrawing()
  }
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-white border rounded-lg p-2 shadow-lg z-10">
      <Button 
        variant="ghost" 
        size="icon" 
        title="Rectangle"
        onClick={onAddRectangle}
      >
        <Square className="h-5 w-5" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        title="Circle"
        onClick={onAddCircle}
      >
        <Circle className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" title="Text">
        <Type className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" title="Pen">
        <Pen className="h-5 w-5" />
      </Button>
      
      <Separator />
      
      <div className="text-xs text-muted-foreground px-2">More tools coming...</div>
    </div>
  )
}