"use client"

import * as React from "react"
import { ExternalLink } from "lucide-react"
import { toast } from "sonner"

import { isApiError, verifyNews } from "@/backend"
import type { VerifyNewsResponse } from "@/backend"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"

function verdictBadgeVariant(
  verdict: string | null | undefined
): React.ComponentProps<typeof Badge>["variant"] {
  if (!verdict) {
    return "outline"
  }
  if (verdict === "True") {
    return "default"
  }
  if (verdict === "False") {
    return "destructive"
  }
  return "secondary"
}

export default function FactCheckPage() {
  const [claim, setClaim] = React.useState("")
  const [pending, setPending] = React.useState(false)
  const [result, setResult] = React.useState<VerifyNewsResponse | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = claim.trim()
    if (!trimmed) {
      toast.error("Enter a claim to verify.")
      return
    }
    setPending(true)
    setResult(null)
    try {
      const data = await verifyNews(trimmed)
      setResult(data)
    } catch (error) {
      const message = isApiError(error) ? error.message : "Verification failed."
      toast.error(message)
    } finally {
      setPending(false)
    }
  }

  const final = result?.result
  const confidencePct = Math.round(
    Math.min(100, Math.max(0, ((final?.confidence ?? 0) as number) * 100))
  )

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="font-heading text-sm font-medium">Fact Check</h1>
        <p className="mt-1 text-xs/relaxed text-muted-foreground">
          Submit a factual claim or headline. Results combine your indexed
          documents with optional web evidence.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-sm">Claim</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="claim">Statement to verify</Label>
              <Textarea
                id="claim"
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
                placeholder="e.g. NASA confirmed liquid water on the surface of Mars in 2025."
                className="min-h-28"
                disabled={pending}
              />
            </div>
            <Button type="submit" disabled={pending || !claim.trim()}>
              {pending ? "Verifying…" : "Verify claim"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {!result && pending && (
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent className="grid gap-3">
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader className="gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="font-heading text-sm">Result</CardTitle>
                <Badge variant={verdictBadgeVariant(final?.final_verdict)}>
                  {final?.final_verdict ?? "—"}
                </Badge>
              </div>
              <div className="grid gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Confidence
                  </span>
                  <Progress value={confidencePct} className="max-w-xs flex-1" />
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {final?.confidence != null ? `${confidencePct}%` : "—"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(final?.sources_used?.length ? final.sources_used : []).map(
                    (s) => (
                      <Badge key={s} variant="outline">
                        {s}
                      </Badge>
                    )
                  )}
                  {(!final?.sources_used ||
                    final.sources_used.length === 0) && (
                    <Badge variant="outline">sources: —</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              {final?.justification ? (
                <p className="text-xs/relaxed">{final.justification}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No justification returned.
                </p>
              )}

              <details className="border border-border">
                <summary className="cursor-pointer bg-muted/40 px-3 py-2 text-xs font-medium">
                  Internal evaluation (pre–web search)
                </summary>
                <div className="grid gap-2 p-3 text-xs">
                  <p>
                    <span className="text-muted-foreground">Verdict: </span>
                    {result.evaluation?.verdict ?? "—"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">
                      Evidence strength:{" "}
                    </span>
                    {result.evaluation?.evidence_strength ?? "—"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Confidence: </span>
                    {result.evaluation?.confidence != null
                      ? `${Math.round(result.evaluation.confidence * 100)}%`
                      : "—"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">
                      Needs external search:{" "}
                    </span>
                    {result.evaluation?.needs_external_search == null
                      ? "—"
                      : result.evaluation.needs_external_search
                        ? "Yes"
                        : "No"}
                  </p>
                  {result.evaluation?.reason ? (
                    <p className="text-xs/relaxed">
                      {result.evaluation.reason}
                    </p>
                  ) : null}
                </div>
              </details>

              <div className="grid gap-2">
                <h3 className="text-xs font-medium">External sources</h3>
                {(result.external_sources?.length ?? 0) === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No external sources were used (internal evidence was
                    sufficient).
                  </p>
                ) : (
                  <ul className="grid gap-3">
                    {result.external_sources?.map((src, i) => (
                      <li key={`${src.url ?? ""}-${i}`}>
                        <Card>
                          <CardContent className="grid gap-2 p-3">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <p className="min-w-0 flex-1 text-xs font-medium">
                                {src.title ?? "Untitled"}
                              </p>
                              {src.score != null && (
                                <Badge
                                  variant="secondary"
                                  className="shrink-0 tabular-nums"
                                >
                                  {src.score.toFixed(2)}
                                </Badge>
                              )}
                            </div>
                            {src.url ? (
                              <a
                                href={src.url}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="inline-flex items-center gap-1 text-xs text-primary underline-offset-4 hover:underline"
                              >
                                {src.url}
                                <ExternalLink className="size-3 shrink-0" />
                              </a>
                            ) : null}
                            {src.description ? (
                              <p className="text-xs/relaxed text-muted-foreground">
                                {src.description}
                              </p>
                            ) : null}
                            {src.published_date ? (
                              <p className="text-[0.65rem] text-muted-foreground">
                                Published: {src.published_date}
                              </p>
                            ) : null}
                          </CardContent>
                        </Card>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
