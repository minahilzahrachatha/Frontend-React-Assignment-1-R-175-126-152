"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useVulnScan } from "../store"

export function DashboardPage() {
  const { scans, schedules, toggleSchedule, removeSchedule } = useVulnScan()

  const totals = useMemo(() => {
    return scans.reduce(
      (acc, s) => {
        acc.scans++
        acc.critical += s.summary.critical
        acc.high += s.summary.high
        acc.medium += s.summary.medium
        acc.low += s.summary.low
        acc.info += s.summary.info
        acc.score += s.score
        return acc
      },
      {
        scans: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        info: 0,
        score: 0,
      },
    )
  }, [scans])

  return (
    <section className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-5">
        <StatCard label="Total Scans" value={totals.scans} />
        <StatCard label="Critical" value={totals.critical} tone="destructive" />
        <StatCard label="High" value={totals.high} tone="primary" />
        <StatCard label="Medium" value={totals.medium} tone="secondary" />
        <StatCard label="Score Sum" value={totals.score} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Scans</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left border-b">
                <tr>
                  <th className="py-2 pr-2">URL</th>
                  <th className="py-2 pr-2">Frequency</th>
                  <th className="py-2 pr-2">Status</th>
                  <th className="py-2 pr-2">Next Run</th>
                  <th className="py-2 pr-2">Last Run</th>
                  <th className="py-2 pr-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((s) => (
                  <tr key={s.id} className="border-b last:border-0 align-top">
                    <td className="py-2 pr-2">{s.url}</td>
                    <td className="py-2 pr-2">
                      {s.frequencyMinutes}
                      {" min"}
                    </td>
                    <td className="py-2 pr-2">{s.active ? "Active" : "Paused"}</td>
                    <td className="py-2 pr-2">{s.nextRunAt ? new Date(s.nextRunAt).toLocaleString() : "—"}</td>
                    <td className="py-2 pr-2">{s.lastRunAt ? new Date(s.lastRunAt).toLocaleString() : "—"}</td>
                    <td className="py-2 pr-2 flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => toggleSchedule(s.id)}>
                        {s.active ? "Pause" : "Resume"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => removeSchedule(s.id)}>
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
                {schedules.length === 0 && (
                  <tr>
                    <td className="py-6 text-muted-foreground" colSpan={6}>
                      {"No scheduled scans yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone?: "primary" | "secondary" | "destructive"
}) {
  const toneClass =
    tone === "destructive"
      ? "bg-destructive text-destructive-foreground"
      : tone === "primary"
        ? "bg-primary text-primary-foreground"
        : tone === "secondary"
          ? "bg-secondary text-secondary-foreground"
          : "bg-muted text-muted-foreground"
  return (
    <Card className={toneClass}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{label}</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-semibold">{value}</CardContent>
    </Card>
  )
}
