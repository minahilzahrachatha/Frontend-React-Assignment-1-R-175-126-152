// Deterministic pseudo-random generator and scan simulator
import type { Severity, Vulnerability, ScanRecord } from "./types"

function hashString(s: string) {
  // Simple xorshift-like hash to seed PRNG
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

const vulnCatalog: Array<Omit<Vulnerability, "id" | "severity" | "urlPath" | "cvss">> = [
  { title: "Reflected XSS", description: "Unescaped user input is reflected in the response." },
  { title: "SQL Injection", description: "Unsanitized parameters used in SQL queries." },
  { title: "Insecure Cookies", description: "Missing HttpOnly or Secure flags on cookies." },
  { title: "Directory Listing", description: "Server exposes directory contents." },
  { title: "Outdated Dependency", description: "Third-party library with known vulnerabilities." },
  { title: "Open Redirect", description: "Unvalidated redirects to external domains." },
  { title: "CSRF Risk", description: "Missing CSRF tokens for state-changing requests." },
  { title: "Sensitive Info in Headers", description: "Leaky server/version headers." },
  { title: "Weak CSP", description: "Content-Security-Policy is missing or weak." },
  { title: "Verbose Error Handling", description: "Stack traces or debug info exposed." },
]

const severities: Severity[] = ["critical", "high", "medium", "low", "info"]

export async function simulateScan(url: string): Promise<ScanRecord> {
  const seed = hashString(url)
  const rand = mulberry32(seed)
  const startedAt = Date.now()

  // Simulate scanning delay
  const delay = 1200 + Math.floor(rand() * 1200)
  await new Promise((res) => setTimeout(res, delay))

  const findingsCount = 4 + Math.floor(rand() * 7) // 4-10
  const findings: Vulnerability[] = []
  for (let i = 0; i < findingsCount; i++) {
    const base = vulnCatalog[Math.floor(rand() * vulnCatalog.length)]
    const sev = severities[Math.floor(rand() * severities.length)]
    const cvss = Math.round(rand() * 10 * 10) / 10 // 0.0-10.0
    const pathPick = ["/login", "/search", "/api", "/profile", "/", "/admin"][Math.floor(rand() * 6)]
    findings.push({
      id: `${seed}-${i}`,
      title: base.title,
      description: base.description,
      severity: sev,
      cwe: `CWE-${Math.floor(20 + rand() * 800)}`,
      cvss,
      urlPath: pathPick,
    })
  }

  const summary = findings.reduce(
    (acc, f) => {
      acc[f.severity]++
      return acc
    },
    { critical: 0, high: 0, medium: 0, low: 0, info: 0 } as ScanRecord["summary"],
  )
  // Simple score weighted by severity counts
  const score = summary.critical * 30 + summary.high * 20 + summary.medium * 10 + summary.low * 5 + summary.info * 1

  const record: ScanRecord = {
    id: `${startedAt}-${seed}`,
    url,
    startedAt,
    finishedAt: startedAt + delay,
    status: "completed",
    findings,
    score,
    summary,
  }
  return record
}

export function isValidUrl(input: string) {
  try {
    const u = new URL(input)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
