import { useEffect, useRef, useCallback } from "react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface CanvasState {
  objects: any[]
  background?: string
}

export function useCanvasState(sceneId: string, viewOnly: boolean = false) {
  const saveTimeoutRef = useRef<NodeJS.Timeout>()

  const loadCanvas = useCallback(async (): Promise<CanvasState | null> => {
    try {
      const docRef = doc(db, "canvases", sceneId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return docSnap.data() as CanvasState
      }
      return null
    } catch (error) {
      console.error("Error loading canvas:", error)
      return null
    }
  }, [sceneId])

  const saveCanvas = useCallback(
    (canvasData: CanvasState) => {
      if (viewOnly) return

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          const docRef = doc(db, "canvases", sceneId)
          await setDoc(docRef, canvasData)
          console.log("[v0] Canvas saved to Firebase")
        } catch (error) {
          console.error("Error saving canvas:", error)
        }
      }, 1000)
    },
    [sceneId, viewOnly]
  )

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  return { loadCanvas, saveCanvas }
}