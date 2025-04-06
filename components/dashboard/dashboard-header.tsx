"use client"

import { useState } from "react"
import { Bell, Menu, User, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import Link from "next/link"

export default function DashboardHeader() {
  const [showReports, setShowReports] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-green-100 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden mr-2 hover:bg-green-50">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <MobileNav />
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex">
            <Link href="/" className="flex items-center space-x-3">
              <span className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">GreenTrack</span>
              <div className="h-6 w-px bg-green-200" />
              <span className="text-sm font-medium text-green-800">Deforestation Dashboard</span>
            </Link>
          </div>
          <div className="md:hidden">
            <Link href="/" className="text-lg font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
              GreenTrack
            </Link>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <DropdownMenu open={showReports} onOpenChange={setShowReports}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 h-9 border-green-200 hover:bg-green-50">
                <FileText className="h-4 w-4 text-green-700" />
                <span className="hidden sm:inline text-green-800">Reports</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-green-800">Deforestation Reports</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/reports/deforestation/2023" className="flex w-full text-green-800">
                  Annual Report 2023
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/reports/deforestation/2022" className="flex w-full text-green-800">
                  Annual Report 2022
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/reports/deforestation/2021" className="flex w-full text-green-800">
                  Annual Report 2021
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/reports/deforestation/2020" className="flex w-full text-green-800">
                  Annual Report 2020
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/reports/deforestation/custom" className="flex w-full text-green-800">
                  Generate Custom Report
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="icon" className="h-9 w-9 relative border-green-200 hover:bg-green-50">
            <Bell className="h-4 w-4 text-green-700" />
            <span className="sr-only">Notifications</span>
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-[10px] font-medium text-white flex items-center justify-center">3</span>
          </Button>

          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-green-50">
            <User className="h-5 w-5 text-green-700" />
            <span className="sr-only">User account</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

