import { Globe, Layers, Scale, Search } from "lucide-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const items = [
  {
    title: "Evidence-grounded verdicts",
    description:
      "Every conclusion is tied to retrieved chunks from your trusted documents or vetted web results—not vibes.",
    icon: Scale,
  },
  {
    title: "Internal PDF knowledge base",
    description:
      "Upload PDFs, index them into your vector store, and verify against your own institutional record.",
    icon: Layers,
  },
  {
    title: "External web fallback",
    description:
      "When internal evidence is thin, ClearView automatically searches the open web and cites what it used.",
    icon: Globe,
  },
  {
    title: "Confidence & source transparency",
    description:
      "See model confidence, which channels were used, and structured metadata for external articles.",
    icon: Search,
  },
] as const

export function LandingFeatures() {
  return (
    <section className="border-b border-border py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 max-w-xl">
          <h2 className="font-heading text-sm font-medium">
            Why teams use ClearView
          </h2>
          <p className="mt-2 text-xs/relaxed text-muted-foreground">
            Built for newsrooms, research desks, and compliance teams who need
            defensible, evidence-backed answers.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map(({ title, description, icon: Icon }) => (
            <Card key={title}>
              <CardHeader className="gap-2">
                <Icon className="size-4 text-muted-foreground" aria-hidden />
                <CardTitle className="font-heading text-sm">{title}</CardTitle>
                <CardDescription className="text-xs/relaxed">
                  {description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
