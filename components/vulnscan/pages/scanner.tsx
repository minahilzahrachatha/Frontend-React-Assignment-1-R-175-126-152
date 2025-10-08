"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useVulnScan } from "../store"
import { isValidUrl, downloadJson } from "../utils"
import type { ScanRecord } from "../types"

export function ScannerPage() {
  const { runScan, scheduleScan } = useVulnScan()
  const [url, setUrl] = useState("")
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<ScanRecord | null>(null)
  const [freq, setFreq] = useState(60)

  async function onScan() {
    if (!isValidUrl(url)) return alert("Please enter a valid http(s) URL.")
    setBusy(true)
    try {
      const r = await runScan(url)
      setResult(r)
    } finally {
      setBusy(false)
    }
  }

  function onDownload() {
    if (!result) return
    downloadJson(`vulnscan-report-${result.id}.json`, result)
  }

  function onSchedule() {
    if (!isValidUrl(url)) return alert("Please enter a valid http(s) URL.")
    scheduleScan(url, freq)
    alert("Scheduled! It will run while this app is open.")
  }

  return (
    <section className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Vulnerability Scan</CardTitle>
          <CardDescription>{"Enter a URL to simulate a vulnerability scan."}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="url">Target URL</Label>
            <Input
              id="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={busy}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={onScan} disabled={busy}>
              {busy ? "Scanning…" : "Run Scan"}
            </Button>
            <Button variant="secondary" onClick={onDownload} disabled={!result}>
              Download Report
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex items-center gap-4 flex-wrap">
          <div className="grid gap-2">
            <Label htmlFor="freq">Schedule every (minutes)</Label>
            <Input
              id="freq"
              type="number"
              min={5}
              step={5}
              value={freq}
              onChange={(e) => setFreq(Number.parseInt(e.target.value || "0", 10))}
              className="w-40"
            />
          </div>
          <Button variant="outline" onClick={onSchedule}>
            Schedule
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>{"Simulated findings for the most recent scan."}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <SeverityPill label="Critical" value={result.summary.critical} tone="critical" />
              <SeverityPill label="High" value={result.summary.high} tone="high" />
              <SeverityPill label="Medium" value={result.summary.medium} tone="medium" />
              <SeverityPill label="Low" value={result.summary.low} tone="low" />
              <SeverityPill label="Info" value={result.summary.info} tone="info" />
            </div>
            <ul className="divide-y rounded-md border">
              {result.findings.map((f) => (
                <li key={f.id} className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">{f.title}</div>
                    <span className="text-xs text-muted-foreground">{f.cwe}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{f.description}</div>
                  <div className="text-xs mt-1">
                    {"Path: "}
                    {f.urlPath}
                  </div>
                  <div className="text-xs">
                    {"Severity: "}
                    {f.severity}
                    {" | CVSS: "}
                    {f.cvss}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </section>
  )
}

function SeverityPill({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: "critical" | "high" | "medium" | "low" | "info"
}) {
  const toneClass: Record<typeof tone, string> = {
    critical: "bg-destructive text-destructive-foreground",
    high: "bg-primary text-primary-foreground",
    medium: "bg-secondary text-secondary-foreground",
    low: "bg-accent text-accent-foreground",
    info: "bg-muted text-muted-foreground",
  } as any
  return (
    <div className={`rounded-md px-3 py-2 text-sm ${toneClass[tone]}`}>
      <div className="font-medium">{label}</div>
      <div>{value}</div>
    </div>
  )
}
