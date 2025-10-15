import { Suspense } from "react"
import { RecipeSearch } from "@/components/recipe-search"

export default function HomePage() {
  return (
    <main className="min-h-dvh">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/40 transition-colors">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/placeholder-logo.svg" alt="Smart Recipe Generator logo" className="h-6 w-6" />
            <h1 className="text-balance font-semibold">Smart Recipe Generator</h1>
          </div>
          <nav className="flex items-center gap-2">
            <a href="#app" className="text-sm hover:underline">
              App
            </a>
            <a href="#how-it-works" className="text-sm hover:underline">
              How it works
            </a>
          </nav>
        </div>
      </header>

      {/* App */}
      <section id="app" className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
          <RecipeSearch />
        </Suspense>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-border/60 bg-card/40">
        <div className="mx-auto max-w-5xl px-4 py-8 grid gap-6 md:grid-cols-3">
          <div className="p-4 rounded-lg border border-border/60 bg-card transition-transform duration-200 hover:-translate-y-0.5">
            <h3 className="font-medium mb-2">1) Add ingredients</h3>
            <p className="text-sm text-muted-foreground">
              Type or upload a photo of your pantry. We&apos;ll OCR the image and extract ingredient names you can
              confirm and edit.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border/60 bg-card transition-transform duration-200 hover:-translate-y-0.5">
            <h3 className="font-medium mb-2">2) Set preferences</h3>
            <p className="text-sm text-muted-foreground">
              Choose dietary preferences, cuisine, difficulty, and time. We use substitutions when possible.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border/60 bg-card transition-transform duration-200 hover:-translate-y-0.5">
            <h3 className="font-medium mb-2">3) Get recipes</h3>
            <p className="text-sm text-muted-foreground">
              See matched recipes with nutrition per serving. Save your favorites and rate them to get suggestions.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Smart Recipe Generator
        </div>
      </footer>
    </main>
  )
}
