import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const steps = [
  {
    step: "01",
    title: "Upload PDFs",
    description:
      "Add documents to your internal evidence store. They are chunked and indexed for retrieval.",
  },
  {
    step: "02",
    title: "Submit a claim",
    description:
      "Paste a factual statement or headline. ClearView searches internal evidence first.",
  },
  {
    step: "03",
    title: "Get a grounded verdict",
    description:
      "Receive a final verdict with justification and structured source metadata.",
  },
] as const

export function LandingHowItWorks() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 max-w-xl">
          <h2 className="font-heading text-sm font-medium">How it works</h2>
          <p className="text-muted-foreground mt-2 text-xs/relaxed">
            Three steps from raw documents to a traceable credibility decision.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map(({ step, title, description }) => (
            <Card key={step}>
              <CardHeader className="gap-2">
                <p className="text-muted-foreground text-[0.65rem] tabular-nums">
                  {step}
                </p>
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
