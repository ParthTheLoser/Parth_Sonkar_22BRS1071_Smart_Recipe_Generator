"use client"

import { useId } from "react"

export type Filters = {
  diet: Array<"vegan" | "vegetarian" | "glutenFree" | "dairyFree">
  cuisine: "any" | "italian" | "mexican" | "indian" | "asian" | "american" | "mediterranean" | "middle-eastern"
  difficulty: "any" | "easy" | "medium" | "hard"
  maxTime: number
  servings: number
}

type Props = {
  value: Filters
  onChange: (v: Filters) => void
}

export function RecipeFilters({ value, onChange }: Props) {
  const id = useId()
  function toggleDiet(k: Filters["diet"][number]) {
    const set = new Set(value.diet)
    set.has(k) ? set.delete(k) : set.add(k)
    onChange({ ...value, diet: Array.from(set) as Filters["diet"] })
  }
  return (
    <div className="card-elevated p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground">Cuisine</label>
          <select
            className="mt-1 w-full bg-background border border-border/60 rounded-md px-2 py-2"
            value={value.cuisine}
            onChange={(e) => onChange({ ...value, cuisine: e.target.value as Filters["cuisine"] })}
          >
            <option value="any">Any</option>
            <option value="italian">Italian</option>
            <option value="mexican">Mexican</option>
            <option value="indian">Indian</option>
            <option value="asian">Asian</option>
            <option value="american">American</option>
            <option value="mediterranean">Mediterranean</option>
            <option value="middle-eastern">Middle Eastern</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Difficulty</label>
          <select
            className="mt-1 w-full bg-background border border-border/60 rounded-md px-2 py-2"
            value={value.difficulty}
            onChange={(e) => onChange({ ...value, difficulty: e.target.value as Filters["difficulty"] })}
          >
            <option value="any">Any</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 items-center">
        <div>
          <label className="text-xs text-muted-foreground">Max time (min)</label>
          <input
            type="range"
            min={10}
            max={120}
            step={5}
            value={value.maxTime}
            onChange={(e) => onChange({ ...value, maxTime: Number(e.target.value) })}
            className="w-full"
            aria-labelledby={id}
          />
          <div className="text-xs mt-1">{value.maxTime} minutes</div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Servings</label>
          <input
            type="number"
            min={1}
            max={12}
            className="mt-1 w-full bg-background border border-border/60 rounded-md px-2 py-2"
            value={value.servings}
            onChange={(e) => onChange({ ...value, servings: Number(e.target.value || 1) })}
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground">Dietary</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {["vegan", "vegetarian", "glutenFree", "dairyFree"].map((d) => {
            const active = value.diet.includes(d as any)
            return (
              <button
                key={d}
                onClick={() => toggleDiet(d as any)}
                className={`px-2 py-1 rounded-md border ${active ? "bg-primary text-primary-foreground border-transparent" : "bg-card border-border/50"} hover-lift text-xs`}
                aria-pressed={active}
                aria-label={d}
              >
                {d}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
