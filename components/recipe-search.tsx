"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IngredientInput } from "./ingredient-input"
import { RecipeList } from "./recipe-list"
import { matchRecipes } from "@/lib/match"
import { allRecipes, cuisines, type Recipe } from "@/lib/recipes"

type Dietary = "vegan" | "vegetarian" | "gluten-free" | "dairy-free" | "nut-free"

export function RecipeSearch() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [dietary, setDietary] = useState<Record<Dietary, boolean>>({
    vegan: false,
    vegetarian: false,
    "gluten-free": false,
    "dairy-free": false,
    "nut-free": false,
  })
  const [cuisine, setCuisine] = useState<string>("any")
  const [difficulty, setDifficulty] = useState<"any" | "easy" | "medium" | "hard">("any")
  const [maxTime, setMaxTime] = useState<number>(60)
  const [servings, setServings] = useState<number>(2)
  const [query, setQuery] = useState("")

  const activeDietary = useMemo(
    () =>
      Object.entries(dietary)
        .filter(([, v]) => v)
        .map(([k]) => k as Dietary),
    [dietary],
  )

  const results = useMemo(() => {
    return matchRecipes({
      ingredients,
      recipes: allRecipes,
      dietary: activeDietary,
      cuisine: cuisine === "any" ? undefined : cuisine,
      difficulty: difficulty === "any" ? undefined : difficulty,
      maxTime,
      servings,
      query,
      limit: 20,
    })
  }, [ingredients, activeDietary, cuisine, difficulty, maxTime, servings, query])

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-pretty">Find recipes with what you have</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <IngredientInput value={ingredients} onChange={setIngredients} />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm text-muted-foreground">Search by name</span>
                <Input
                  placeholder="e.g., pasta, curry, salad"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>

              <div className="grid gap-2">
                <span className="text-sm text-muted-foreground">Dietary preferences</span>
                <div className="grid grid-cols-2 gap-3">
                  {(["vegan", "vegetarian", "gluten-free", "dairy-free", "nut-free"] as Dietary[]).map((key) => (
                    <label key={key} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={dietary[key]}
                        onCheckedChange={(v) => setDietary((prev) => ({ ...prev, [key]: Boolean(v) }))}
                      />
                      <span className="capitalize">{key.replace("-", " ")}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <span className="text-sm text-muted-foreground">Cuisine</span>
                <Select value={cuisine} onValueChange={(v) => setCuisine(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    {cuisines.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <span className="text-sm text-muted-foreground">Difficulty</span>
                <Select value={difficulty} onValueChange={(v: any) => setDifficulty(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <label className="grid gap-2">
                <span className="text-sm text-muted-foreground">Max total time (minutes): {maxTime}</span>
                <Slider value={[maxTime]} min={5} max={120} step={5} onValueChange={(v) => setMaxTime(v[0])} />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-muted-foreground">Servings: {servings}</span>
                <Slider value={[servings]} min={1} max={8} step={1} onValueChange={(v) => setServings(v[0])} />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setIngredients([])
                setDietary({
                  vegan: false,
                  vegetarian: false,
                  "gluten-free": false,
                  "dairy-free": false,
                  "nut-free": false,
                })
                setCuisine("any")
                setDifficulty("any")
                setMaxTime(60)
                setServings(2)
                setQuery("")
              }}
            >
              Reset
            </Button>
            <Button>Show Matches</Button>
          </div>
        </CardContent>
      </Card>

      <RecipeList recipes={results as Recipe[]} servings={servings} />
    </div>
  )
}
