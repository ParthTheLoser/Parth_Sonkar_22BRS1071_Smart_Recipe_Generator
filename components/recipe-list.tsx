"use client"

import { RecipeCard } from "./recipe-card"
import type { Recipe } from "@/lib/recipes"
import { Empty } from "@/components/ui/empty"

export function RecipeList({ recipes, servings }: { recipes: Recipe[]; servings: number }) {
  if (!recipes.length) {
    return (
      <Empty
        className="border"
        title="No recipes found"
        description="Try adding more ingredients or removing some filters."
      />
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((r, idx) => (
        <div key={r.id} style={{ animationDelay: `${idx * 30}ms` }} className="will-change-transform">
          <RecipeCard recipe={r} servings={servings} />
        </div>
      ))}
    </div>
  )
}
