"use client"

import { useRef, useState } from "react"
import Tesseract from "tesseract.js"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

type Props = {
  value: string[]
  onChange: (ingredients: string[]) => void
}

export function IngredientInput({ value, onChange }: Props) {
  const [draft, setDraft] = useState("")
  const [busy, setBusy] = useState<null | string>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function addMany(list: string[]) {
    const cleaned = list
      .map((s) => s.toLowerCase().trim())
      .map((s) => s.replace(/[^a-z0-9\s-]/g, ""))
      .map((s) => s.replace(/\s+/g, " "))
      .filter(Boolean)
    const uniq = Array.from(new Set([...value, ...cleaned]))
    onChange(uniq)
  }

  function addOne(s: string) {
    addMany([s])
    setDraft("")
  }

  function removeOne(s: string) {
    onChange(value.filter((v) => v !== s))
  }

  async function handleImage(file: File) {
    setBusy("Scanning image...")
    try {
      const { data } = await Tesseract.recognize(file, "eng", {
        // Keep default options for performance
      })
      const raw = data.text || ""
      const lines = raw.split(/\n+/)
      const words = lines.flatMap((line) =>
        line
          .toLowerCase()
          .split(/[,\u2022\-*\t]+|\s{2,}/)
          .map((s) => s.trim())
          .filter(Boolean),
      )

      // basic filter to keep food-like tokens (letters, hyphens, spaces), limit to 2-3 words
      const candidates = words
        .map((w) => w.replace(/[^a-z\s-]/g, ""))
        .map((w) => w.replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .filter((w) => w.length >= 3 && w.length <= 30)
        .map((w) => w.split(" ").slice(0, 3).join(" "))

      const shortlisted = Array.from(new Set(candidates)).slice(0, 60)
      addMany(shortlisted)
      toast({
        title: "Image scanned",
        description: `Found ~${shortlisted.length} items. Review and remove any false positives.`,
      })
    } catch (e: any) {
      toast({ title: "OCR failed", description: e?.message ?? "Could not read image", variant: "destructive" })
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="grid gap-3">
      <label className="grid gap-2">
        <span className="text-sm text-muted-foreground">Ingredients you have</span>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type an ingredient and press Enter…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && draft.trim()) {
                e.preventDefault()
                addOne(draft)
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            className="transition-transform duration-200 hover:-translate-y-0.5"
            onClick={() => draft.trim() && addOne(draft)}
          >
            Add
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleImage(f)
              if (fileRef.current) fileRef.current.value = ""
            }}
          />
          <Button
            type="button"
            className="transition-transform duration-200 hover:-translate-y-0.5"
            onClick={() => fileRef.current?.click()}
            disabled={!!busy}
          >
            {busy ?? "Scan image"}
          </Button>
        </div>
      </label>

      {value.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-wrap gap-2">
            {value.map((ing) => (
              <Badge
                key={ing}
                variant="secondary"
                className="flex items-center gap-2 transition-transform duration-150 hover:-translate-y-0.5"
              >
                <span>{ing}</span>
                <button
                  aria-label={`Remove ${ing}`}
                  className="rounded-md px-1 text-muted-foreground hover:text-foreground"
                  onClick={() => removeOne(ing)}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
