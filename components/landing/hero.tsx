import Link from "next/link"
import { BookOpen } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function LandingHero() {
  return (
    <section className="border-border border-b">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:py-20">
        <div className="flex min-w-0 flex-col gap-4">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Evidence-grounded verification
          </p>
          <h1 className="font-heading text-balance text-xl font-medium md:text-2xl">
            Verify any claim with evidence you can trace.
          </h1>
          <p className="text-muted-foreground text-xs/relaxed md:text-sm/relaxed">
            ClearView evaluates a claim against your internal PDF knowledge base,
            then falls back to external web search when internal evidence is weak.
            Verdicts arrive with citations and metadata for every external source.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild>
              <Link href="/dashboard/fact-check">Get started</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">View dashboard</Link>
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader className="gap-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="font-heading text-sm">Sample result</CardTitle>
              <Badge variant="secondary">Misleading</Badge>
            </div>
            <CardDescription className="text-xs">
              Confidence from synthesized evidence
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-1">
              <p className="text-muted-foreground text-xs">Confidence</p>
              <Progress value={66} />
              <p className="text-muted-foreground text-[0.65rem] tabular-nums">
                66%
              </p>
            </div>
            <p className="text-xs/relaxed">
              External source [1] narrows the claim relative to what was actually
              reported—your team sees the full justification in production.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline">sources: external</Badge>
              <Badge variant="outline">sources: internal</Badge>
            </div>
            <div className="flex items-start gap-2 border-border border-t pt-3">
              <BookOpen className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <p className="text-muted-foreground text-[0.65rem] leading-snug">
                Titles, URLs, snippets, relevance scores, and dates are returned for
                each external hit.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
