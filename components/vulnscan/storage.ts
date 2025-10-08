// LocalStorage persistence helpers
import type { ScanRecord, Schedule } from "./types"

const SCANS_KEY = "vulnscan:scans"
const SCHED_KEY = "vulnscan:schedules"

export function loadScans(): ScanRecord[] {
  try {
    const raw = localStorage.getItem(SCANS_KEY)
    if (!raw) return []
    const parsed: ScanRecord[] = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveScans(scans: ScanRecord[]) {
  localStorage.setItem(SCANS_KEY, JSON.stringify(scans))
}

export function loadSchedules(): Schedule[] {
  try {
    const raw = localStorage.getItem(SCHED_KEY)
    if (!raw) return []
    const parsed: Schedule[] = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveSchedules(schedules: Schedule[]) {
  localStorage.setItem(SCHED_KEY, JSON.stringify(schedules))
}
