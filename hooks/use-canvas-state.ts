"use client"

import { useCallback, useEffect, useRef } from "react"
import type { Canvas } from "fabric"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

function removeUndefined(obj: any): any {
  if (obj === null || obj === undefined) {
    return null
  }

  if (Array.isArray(obj)) {
    return obj.map(removeUndefined)
  }

  if (typeof obj === "object") {
    const cleaned: any = {}
    for (const key in obj) {
      const value = obj[key]
      if (value !== undefined) {
        cleaned[key] = removeUndefined(value)
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
        const cleanedJson = removeUndefined(json)

        await setDoc(doc(db, "canvases", sceneId), {
          data: cleanedJson,
          updatedAt: new Date().toISOString(),
        })
        console.log("[Canvas] Saved to Firestore")
      } catch (error) {
        console.error("[Canvas] Error saving:", error)
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