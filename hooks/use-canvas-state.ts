"use client"

import { useCallback, useEffect, useRef } from "react"
import type { Canvas } from "fabric"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

function cleanCanvasData(obj: any): any {
  if (obj === null || obj === undefined) {
    return null
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanCanvasData).filter(item => item !== null && item !== undefined)
  }

  if (typeof obj === "object") {
    const cleaned: any = {}
    for (const key in obj) {
      const value = obj[key]
      
      if (key === "path" && Array.isArray(value)) {
        cleaned[key] = "SIMPLIFIED_PATH"
        continue
      }
      
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          const cleanedArray = value.map(cleanCanvasData).filter(item => item !== null && item !== undefined)
          if (cleanedArray.length > 0) {
            cleaned[key] = cleanedArray
          }
        } else if (typeof value === "object") {
          const cleanedObj = cleanCanvasData(value)
          if (Object.keys(cleanedObj).length > 0) {
            cleaned[key] = cleanedObj
          }
        } else {
          cleaned[key] = value
        }
      }
    }
    return cleaned
  }

  return obj
}

export function useCanvasState(sceneId: string, canvas: Canvas | null) {
  const saveTimeoutRef = useRef<NodeJS.Timeout>()

  const saveCanvas = useCallback(async () => {
    if (!canvas) return

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const json = canvas.toJSON()
        const cleanedJson = cleanCanvasData(json)

        await setDoc(doc(db, "canvases", sceneId), {
          data: cleanedJson,
          updatedAt: new Date().toISOString(),
        })
        console.log("[Canvas] ✓ Successfully saved to Firestore")
      } catch (error: any) {
        console.error("[Canvas] ✗ Save failed:", error?.message || error)
        if (error?.message?.includes("network")) {
          console.error("Network blocked - check ad blockers or privacy extensions")
        }
      }
    }, 1000)
  }, [canvas, sceneId])

  const loadCanvas = useCallback(async (): Promise<boolean> => {
    if (!canvas) return false

    try {
      const docRef = doc(db, "canvases", sceneId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        await canvas.loadFromJSON(data.data)
        canvas.renderAll()
        console.log("[Canvas] Loaded from Firestore")
        return true
      }
      console.log("[Canvas] No saved data found")
      return false
    } catch (error) {
      console.error("[Canvas] Error loading:", error)
      return false
    }
  }, [canvas, sceneId])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  return { saveCanvas, loadCanvas }
}