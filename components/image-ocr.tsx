"use client"

import { useEffect, useRef, useState } from "react"
// Client-side OCR, no API keys
import Tesseract from "tesseract.js"

type Props = {
  onDetected: (items: string[]) => void
}

export function ImageOCR({ onDetected }: Props) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  async function handleFile(f: File) {
    setError(null)
    setBusy(true)
    try {
      const url = URL.createObjectURL(f)
      setPreview(url)
      const { data } = await Tesseract.recognize(url, "eng", { logger: () => {} })
      const text = data.text || ""
      const items = extractIngredients(text)
      if (items.length) onDetected(items)
    } catch (e: any) {
      setError("Failed to read image. Try a clearer photo.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
        }}
      />
      <button
        className="button-shine bg-accent text-accent-foreground px-3 py-2 rounded-md hover-lift"
        onClick={() => fileRef.current?.click()}
        aria-label="Scan ingredients from image"
      >
        {busy ? "Scanning..." : "Scan Image"}
      </button>
      {preview && (
        <img
          src={preview || "/placeholder.svg"}
          alt="Uploaded preview"
          className="h-10 w-10 rounded object-cover border border-border/60"
        />
      )}
      {busy && <span className="text-xs text-muted-foreground">OCR running…</span>}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  )
}

function extractIngredients(text: string) {
  const lines = text
    .split(/\n+/g)
    .map((l) => l.toLowerCase().trim())
    .filter(Boolean)

  // naive dictionary cues
  const keepWords = [
    "chicken",
    "beef",
    "pork",
    "tofu",
    "egg",
    "eggs",
    "milk",
    "cream",
    "yogurt",
    "butter",
    "flour",
    "rice",
    "pasta",
    "tomato",
    "onion",
    "garlic",
    "pepper",
    "salt",
    "spinach",
    "carrot",
    "potato",
    "basil",
    "cilantro",
    "parsley",
    "cheese",
    "parmesan",
    "mozzarella",
    "beans",
    "lentil",
    "chickpea",
    "broccoli",
    "mushroom",
    "ginger",
    "soy",
    "sauce",
    "vinegar",
    "oil",
    "olive",
    "lemon",
    "lime",
    "cumin",
    "paprika",
    "turmeric",
    "curry",
    "chili",
    "coconut",
    "fish",
  ]

  const words = new Set<string>()
  for (const line of lines) {
    line
      .replace(/[^a-z\s]/g, " ")
      .split(/\s+/g)
      .forEach((w) => {
        if (keepWords.includes(w)) words.add(w)
      })
  }
  return Array.from(words)
}
