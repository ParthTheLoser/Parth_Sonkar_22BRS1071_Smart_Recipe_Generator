import type { Recipe } from "./recipes"

const SUBSTITUTIONS: Record<string, string[]> = {
  yogurt: ["sour cream", "buttermilk"],
  "sour cream": ["yogurt"],
  spaghetti: ["pasta", "linguine", "fettuccine"],
  cheddar: ["colby", "jack", "gouda"],
  mozzarella: ["provolone"],
  coriander: ["cilantro"],
  scallion: ["green onion"],
  chickpeas: ["garbanzo beans"],
  "kidney beans": ["black beans", "pinto beans"],
  lime: ["lemon"],
  lemon: ["lime"],
  butter: ["olive oil", "ghee"],
  "olive oil": ["canola oil", "vegetable oil"],
  rice: ["quinoa", "couscous"],
  "bread crumbs": ["panko", "crushed crackers"],
}

export function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function appliesDiet(recipe: Recipe, dietary: string[]) {
  return dietary.every((tag) => recipe.dietary.includes(tag as any))
}

function hasCuisine(recipe: Recipe, cuisine?: string) {
  if (!cuisine) return true
  return recipe.cuisine.toLowerCase() === cuisine.toLowerCase()
}

function hasDifficulty(recipe: Recipe, diff?: string) {
  if (!diff) return true
  return recipe.difficulty === diff
}

function withinTime(recipe: Recipe, max: number) {
  return recipe.totalMinutes <= max
}

function ingredientMatchScore(have: string[], need: string[]) {
  const H = new Set(have.map(normalize))
  let score = 0
  let matched = 0
  for (const n of need) {
    const nNorm = normalize(n)
    const direct = Array.from(H).some((h) => nNorm.includes(h) || h.includes(nNorm))
    if (direct) {
      score += 3
      matched += 1
      continue
    }
    // substitutions
    const subs = SUBSTITUTIONS[nNorm] || []
    const hadSub = subs.some((s) => Array.from(H).some((h) => normalize(s).includes(h) || h.includes(normalize(s))))
    if (hadSub) {
      score += 1.5
      continue
    }
    // pantry items small penalty
    if (/(salt|pepper|water|oil|butter)/i.test(nNorm)) {
      score += 1
      continue
    }
    // missing penalty
    score -= 1
  }
  // bonus for higher coverage
  score += (matched / Math.max(need.length, 1)) * 5
  return score
}

export function matchRecipes(opts: {
  ingredients: string[]
  recipes: Recipe[]
  dietary: string[]
  cuisine?: string
  difficulty?: "easy" | "medium" | "hard"
  maxTime: number
  servings: number
  query?: string
  limit?: number
}): Recipe[] {
  const have = opts.ingredients.map(normalize)
  const filtered = opts.recipes.filter(
    (r) =>
      appliesDiet(r, opts.dietary) &&
      hasCuisine(r, opts.cuisine) &&
      hasDifficulty(r, opts.difficulty) &&
      withinTime(r, opts.maxTime) &&
      (!opts.query || r.title.toLowerCase().includes(opts.query.toLowerCase())),
  )
  const scored = filtered
    .map((r) => {
      const need = r.ingredients.map((i) => i.text)
      const score = ingredientMatchScore(have, need)
      return { r, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, opts.limit ?? 20)
    .map((s) => s.r)

  return scored
}
