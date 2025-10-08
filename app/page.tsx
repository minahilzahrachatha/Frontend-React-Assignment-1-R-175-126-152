"use client"

import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom"
import { VulnScanProvider } from "@/components/vulnscan/store"
import { HomePage } from "@/components/vulnscan/pages/home"
import { ScannerPage } from "@/components/vulnscan/pages/scanner"
import { ReportsPage } from "@/components/vulnscan/pages/reports"
import { DashboardPage } from "@/components/vulnscan/pages/dashboard"
import { ServicesPage } from "@/components/vulnscan/pages/services"
import { AboutPage } from "@/components/vulnscan/pages/about"
import { ContactPage } from "@/components/vulnscan/pages/contact"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Simple top nav with React Router
function Nav() {
  const linkBase =
    "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
  const linkActive = "bg-primary text-primary-foreground hover:bg-primary/90"

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/scanner", label: "Scanner" },
    { to: "/reports", label: "Reports" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/services", label: "Services" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ]

  return (
    <header className="border-b">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="font-semibold tracking-tight">
              <span className="text-primary">Vuln</span>
              <span className="text-foreground">Scan</span>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => cn(linkBase, isActive && linkActive)}
                  end={item.to === "/"}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <NavLink to="/scanner">
              <Button size="sm">New Scan</Button>
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  )
}

export default function VulnScanApp() {
  return (
    <BrowserRouter>
      <VulnScanProvider>
        <div className="min-h-dvh flex flex-col">
          <Nav />
          <main className="flex-1">
            <div className="mx-auto max-w-6xl p-4">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/scanner" element={<ScannerPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
            </div>
          </main>
          <footer className="border-t">
            <div className="mx-auto max-w-6xl p-4 text-sm text-muted-foreground">
              {"© "} {new Date().getFullYear()} {" VulnScan — Simulated security scanning for demo purposes only."}
            </div>
          </footer>
        </div>
      </VulnScanProvider>
    </BrowserRouter>
  )
}
