// Types shared across the app

export type Severity = "critical" | "high" | "medium" | "low" | "info"

export type Vulnerability = {
  id: string
  title: string
  description: string
  severity: Severity
  cwe?: string
  cvss?: number
  urlPath?: string
}

export type ScanStatus = "queued" | "running" | "completed" | "failed" | "cancelled"

export type ScanRecord = {
  id: string
  url: string
  startedAt: number
  finishedAt?: number
  status: ScanStatus
  findings: Vulnerability[]
  score: number // 0-100 where higher is worse (more severe)
  summary: {
    critical: number
    high: number
    medium: number
    low: number
    info: number
  }
}

export type Schedule = {
  id: string
  url: string
  frequencyMinutes: number
  active: boolean
  createdAt: number
  lastRunAt?: number
  nextRunAt?: number
}
