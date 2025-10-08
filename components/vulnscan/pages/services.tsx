import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    title: "Web App Scan",
    desc: "Simulate checks for common web vulnerabilities like XSS, SQL Injection, and CSP issues.",
  },
  {
    title: "API Scan",
    desc: "Inspect REST endpoints for security headers, input validation, and authentication gaps.",
  },
  {
    title: "Compliance Checks",
    desc: "Lightweight verification of baseline controls and best-practice configurations.",
  },
]

export function ServicesPage() {
  return (
    <section className="grid gap-6">
      <h1 className="text-2xl font-semibold">Services</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {services.map((s) => (
          <Card key={s.title}>
            <CardHeader>
              <CardTitle>{s.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">{s.desc}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
