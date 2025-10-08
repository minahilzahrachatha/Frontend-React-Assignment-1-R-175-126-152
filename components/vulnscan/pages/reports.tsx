"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useVulnScan } from "../store"
import { downloadJson } from "../utils"

export function ReportsPage() {
  const { scans, removeScan } = useVulnScan()
  const [q, setQ] = useState("")

  const filtered = useMemo(() => {
    if (!q) return scans
    return scans.filter((s) => s.url.toLowerCase().includes(q.toLowerCase()))
  }, [scans, q])

  return (
    <section className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-2">
            <Input placeholder="Filter by URL…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left border-b">
                <tr>
                  <th className="py-2 pr-2">URL</th>
                  <th className="py-2 pr-2">Started</th>
                  <th className="py-2 pr-2">Findings</th>
                  <th className="py-2 pr-2">Score</th>
                  <th className="py-2 pr-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b last:border-0 align-top">
                    <td className="py-2 pr-2">{s.url}</td>
                    <td className="py-2 pr-2">{new Date(s.startedAt).toLocaleString()}</td>
                    <td className="py-2 pr-2">
                      {"C:"}
                      {s.summary.critical} {"H:"}
                      {s.summary.high} {"M:"}
                      {s.summary.medium} {"L:"}
                      {s.summary.low} {"I:"}
                      {s.summary.info}
                    </td>
                    <td className="py-2 pr-2">{s.score}</td>
                    <td className="py-2 pr-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => downloadJson(`vulnscan-report-${s.id}.json`, s)}
                      >
                        Download
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => removeScan(s.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td className="py-6 text-muted-foreground" colSpan={5}>
                      {"No reports found."}
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
