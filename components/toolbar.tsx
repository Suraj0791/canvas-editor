"use client"

import { Square, Circle, Type, Pen } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function Toolbar() {
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-white border rounded-lg p-2 shadow-lg">
      <Button variant="ghost" size="icon" title="Rectangle">
        <Square className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" title="Circle">
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