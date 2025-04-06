"use client"

import type React from "react"

import Link from "next/link"
import { LayoutDashboard, Map, BarChart3, AlertTriangle, Settings, FileText, HelpCircle } from "lucide-react"

export function MobileNav() {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            GreenTrack
          </span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          <NavItem href="/dashboard" icon={<LayoutDashboard className="mr-2 h-4 w-4" />} label="Dashboard" active />
          <NavItem href="/map" icon={<Map className="mr-2 h-4 w-4" />} label="Map Explorer" />
          <NavItem href="/analytics" icon={<BarChart3 className="mr-2 h-4 w-4" />} label="Analytics" />
          <NavItem href="/alerts" icon={<AlertTriangle className="mr-2 h-4 w-4" />} label="Alerts" />
          <NavItem href="/reports" icon={<FileText className="mr-2 h-4 w-4" />} label="Reports" />
          <NavItem href="/settings" icon={<Settings className="mr-2 h-4 w-4" />} label="Settings" />
          <NavItem href="/help" icon={<HelpCircle className="mr-2 h-4 w-4" />} label="Help & Support" />
        </nav>
      </div>
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground text-center">
          GreenTrack v1.0.0
        </p>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active?: boolean
}

function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </Link>
  )
}

