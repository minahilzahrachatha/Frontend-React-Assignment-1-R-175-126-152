"use client"

import React from "react"
import type { ScanRecord, Schedule } from "./types"
import { loadScans, saveScans, loadSchedules, saveSchedules } from "./storage"
import { simulateScan } from "./utils"

type Ctx = {
  scans: ScanRecord[]
  schedules: Schedule[]
  runScan: (url: string) => Promise<ScanRecord>
  removeScan: (id: string) => void
  scheduleScan: (url: string, frequencyMinutes: number) => Schedule
  toggleSchedule: (id: string) => void
  removeSchedule: (id: string) => void
}

const VulnScanContext = React.createContext<Ctx | null>(null)

export function VulnScanProvider({ children }: { children: React.ReactNode }) {
  const [scans, setScans] = React.useState<ScanRecord[]>([])
  const [schedules, setSchedules] = React.useState<Schedule[]>([])

  // load on mount
  React.useEffect(() => {
    setScans(loadScans())
    setSchedules(loadSchedules())
  }, [])

  // persist
  React.useEffect(() => {
    saveScans(scans)
  }, [scans])
  React.useEffect(() => {
    saveSchedules(schedules)
  }, [schedules])

  const runScan = React.useCallback(async (url: string) => {
    // optimistic queued state optional; simulate then append
    const result = await simulateScan(url)
    setScans((prev) => [result, ...prev])
    return result
  }, [])

  const removeScan = React.useCallback((id: string) => {
    setScans((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const scheduleScan = React.useCallback((url: string, frequencyMinutes: number) => {
    const now = Date.now()
    const sched: Schedule = {
      id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
      url,
      frequencyMinutes,
      active: true,
      createdAt: now,
      lastRunAt: undefined,
      nextRunAt: now + frequencyMinutes * 60_000,
    }
    setSchedules((prev) => [sched, ...prev])
    return sched
  }, [])

  const toggleSchedule = React.useCallback((id: string) => {
    setSchedules((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)))
  }, [])

  const removeSchedule = React.useCallback((id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id))
  }, [])

  // Lightweight scheduler loop: checks every 30s for due tasks while tab is open
  React.useEffect(() => {
    const INT_MS = 30_000
    let mounted = true

    async function tick() {
      if (!mounted) return
      const now = Date.now()
      const due = schedules.filter((s) => s.active && (s.nextRunAt ?? 0) <= now)
      for (const s of due) {
        // Run scans sequentially to simplify
        const rec = await simulateScan(s.url)
        setScans((prev) => [rec, ...prev])
        setSchedules((prev) =>
          prev.map((p) =>
            p.id === s.id
              ? {
                  ...p,
                  lastRunAt: now,
                  nextRunAt: now + p.frequencyMinutes * 60_000,
                }
              : p,
          ),
        )
      }
    }

    // Run immediately once and then interval
    tick()
    const id = setInterval(tick, INT_MS)
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [schedules])

  const value: Ctx = {
    scans,
    schedules,
    runScan,
    removeScan,
    scheduleScan,
    toggleSchedule,
    removeSchedule,
  }

  return <VulnScanContext.Provider value={value}>{children}</VulnScanContext.Provider>
}

export function useVulnScan() {
  const ctx = React.useContext(VulnScanContext)
  if (!ctx) throw new Error("useVulnScan must be used within VulnScanProvider")
  return ctx
}
