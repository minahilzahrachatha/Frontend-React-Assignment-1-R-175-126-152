import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { NavLink } from "react-router-dom"

export function HomePage() {
  return (
    <section className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="text-3xl font-semibold text-balance">{"VulnScan — Simulated Website Vulnerability Scanner"}</h1>
        <p className="text-muted-foreground max-w-2xl">
          {
            "Run URL-based scans, schedule recurring checks, and download JSON reports. This is a frontend-only demo—no data leaves your browser."
          }
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Quick Scan</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-muted-foreground">{"Scan a single URL for common risks."}</p>
            <NavLink to="/scanner">
              <Button>Start</Button>
            </NavLink>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-muted-foreground">{"Browse past results and download JSON."}</p>
            <NavLink to="/reports">
              <Button variant="secondary">Open</Button>
            </NavLink>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scheduler</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-muted-foreground">{"Run scans automatically while the app is open."}</p>
            <NavLink to="/dashboard">
              <Button variant="outline">Manage</Button>
            </NavLink>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
