"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Recipe } from "@/lib/recipes"
import { Button } from "@/components/ui/button"
import { useLocalPref } from "@/hooks/use-local-pref"
import { cn } from "@/lib/utils"

function scaleAmount(text: string, from: number, to: number) {
  if (from === to) return text
  const factor = to / from
  // parse leading quantity like "1 1/2", "2", "0.5"
  const m = text.match(/^([\d/.\s]+)\s+(.*)$/)
  if (!m) return text
  const qtyStr = m[1].trim()
  const rest = m[2]
  let qty = 0
  try {
    // supports "1 1/2"
    qty = qtyStr.split(" ").reduce((sum, part) => {
      if (part.includes("/")) {
        const [a, b] = part.split("/").map(Number)
        return sum + a / b
      }
      return sum + Number(part)
    }, 0)
  } catch {
    return text
  }
  const scaled = qty * factor
  const rounded = Math.round(scaled * 100) / 100
  return `${rounded} ${rest}`
}

export function RecipeCard({ recipe, servings }: { recipe: Recipe; servings: number }) {
  const [favorites, setFavorites] = useLocalPref<string[]>("favorites", [])
  const [ratings, setRatings] = useLocalPref<Record<string, number>>("ratings", {})

  const isFav = favorites.includes(recipe.id)
  const rating = ratings[recipe.id] ?? 0

  const scaledIngredients = useMemo(() => {
    return recipe.ingredients.map((i) => ({
      ...i,
      text: scaleAmount(i.text, recipe.servings, servings),
    }))
  }, [recipe.ingredients, recipe.servings, servings])

  function toggleFav() {
    setFavorites((prev) => (isFav ? prev.filter((id) => id !== recipe.id) : [...prev, recipe.id]))
  }

  function setStar(n: number) {
    setRatings((prev) => ({ ...prev, [recipe.id]: n }))
  }

  return (
    <Card
      className={cn(
        "overflow-hidden border-border/60 bg-card transition-transform duration-200 hover:-translate-y-0.5",
      )}
    >
      <CardHeader className="space-y-1">
        <CardTitle className="text-pretty">{recipe.title}</CardTitle>
        <div className="text-sm text-muted-foreground">
          {recipe.cuisine} • {recipe.difficulty} • {recipe.totalMinutes} min • serves {servings}
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-1">
          <div className="text-sm font-medium">Ingredients</div>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            {scaledIngredients.map((i, idx) => (
              <li key={idx}>{i.text}</li>
            ))}
          </ul>
        </div>

        <div className="grid gap-1">
          <div className="text-sm font-medium">Steps</div>
          <ol className="list-decimal pl-5 text-sm text-muted-foreground">
            {recipe.steps.slice(0, 4).map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ol>
        </div>

        <div className="grid gap-2">
          <div className="text-sm font-medium">Nutrition (per serving)</div>
          <div className="text-sm text-muted-foreground">
            {recipe.nutrition.calories} kcal • Protein {recipe.nutrition.protein}g • Carbs {recipe.nutrition.carbs}g •
            Fat {recipe.nutrition.fat}g
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
            {Array.from({ length: 5 }).map((_, i) => {
              const n = i + 1
              return (
                <button
                  key={n}
                  className={cn(
                    "h-6 w-6 rounded-sm transition-transform duration-150 hover:-translate-y-0.5",
                    n <= rating ? "bg-primary" : "bg-secondary",
                  )}
                  onClick={() => setStar(n)}
                  aria-checked={n === rating}
                  role="radio"
                  aria-label={`${n} star`}
                />
              )
            })}
          </div>
          <Button
            variant={isFav ? "default" : "secondary"}
            className="transition-transform duration-200 hover:-translate-y-0.5"
            onClick={toggleFav}
          >
            {isFav ? "Saved" : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
