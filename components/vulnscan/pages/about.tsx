export function AboutPage() {
  return (
    <section className="grid gap-4">
      <h1 className="text-2xl font-semibold">About VulnScan</h1>
      <p className="text-muted-foreground max-w-2xl">
        {
          "VulnScan is a demo application that simulates vulnerability scanning entirely in the browser. No data is sent to a server; all state persists to localStorage."
        }
      </p>
      <ul className="list-disc pl-6 text-muted-foreground">
        <li>{"URL-based simulation with deterministic results."}</li>
        <li>{"Downloadable JSON reports."}</li>
        <li>{"In-app scheduler runs while the tab is open."}</li>
      </ul>
    </section>
  )
}
