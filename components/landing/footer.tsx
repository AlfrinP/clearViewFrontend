import Link from "next/link"

export function LandingFooter() {
  return (
    <footer className="border-border border-t py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} ClearView
        </p>
        <div className="flex flex-wrap gap-4 text-xs">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <span className="text-muted-foreground">
            Press <kbd className="px-1">d</kbd> to toggle theme
          </span>
        </div>
      </div>
    </footer>
  )
}
