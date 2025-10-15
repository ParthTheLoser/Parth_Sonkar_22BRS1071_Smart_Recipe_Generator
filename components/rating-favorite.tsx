"use client"

import { useEffect, useState } from "react"

type Props = {
  recipeId: string
}

export function RatingFavorite({ recipeId }: Props) {
  const [rating, setRating] = useState<number>(0)
  const [fav, setFav] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem("ratings")
    const map: Record<string, number> = raw ? JSON.parse(raw) : {}
    setRating(map[recipeId] ?? 0)
    const favRaw = localStorage.getItem("favorites")
    const favs: Record<string, boolean> = favRaw ? JSON.parse(favRaw) : {}
    setFav(!!favs[recipeId])
  }, [recipeId])

  function saveRating(v: number) {
    setRating(v)
    const raw = localStorage.getItem("ratings")
    const map: Record<string, number> = raw ? JSON.parse(raw) : {}
    map[recipeId] = v
    localStorage.setItem("ratings", JSON.stringify(map))
  }

  function toggleFav() {
    const next = !fav
    setFav(next)
    const raw = localStorage.getItem("favorites")
    const map: Record<string, boolean> = raw ? JSON.parse(raw) : {}
    map[recipeId] = next
    localStorage.setItem("favorites", JSON.stringify(map))
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => saveRating(n)}
            className="group"
            aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
            title={`${n} star${n > 1 ? "s" : ""}`}
          >
            <Star filled={n <= rating} />
          </button>
        ))}
      </div>
      <button
        onClick={toggleFav}
        aria-label={fav ? "Remove favorite" : "Add favorite"}
        className={`px-2 py-1 rounded-md border ${fav ? "bg-accent text-accent-foreground border-transparent" : "bg-card border-border/50"} hover-lift text-xs`}
      >
        {fav ? "Saved" : "Save"}
      </button>
    </div>
  )
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-5 w-5 ${filled ? "text-accent" : "text-muted-foreground/50"} transition-transform duration-150 group-hover:scale-110`}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z" />
    </svg>
  )
}
