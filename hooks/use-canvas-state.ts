import { useEffect, useRef, useCallback, useState } from "react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface CanvasState {
  objects: any[]
  background?: string
}

export function useCanvasState(sceneId: string, viewOnly: boolean = false) {
  const saveTimeoutRef = useRef<NodeJS.Timeout>()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const loadCanvas = useCallback(async (): Promise<CanvasState | null> => {
    setIsLoading(true)
    setError(null)
    try {
      const docRef = doc(db, "canvases", sceneId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setIsLoading(false)
        return docSnap.data() as CanvasState
      }
      setIsLoading(false)
      return null
    } catch (error) {
      console.error("Error loading canvas:", error)
      setError("Failed to load canvas. Please refresh the page.")
      setIsLoading(false)
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
          setError("Failed to save canvas. Your changes may not be persisted.")
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

  return { loadCanvas, saveCanvas, error, isLoading }
}