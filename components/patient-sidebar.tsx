"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Search, Calendar, User, LogOut, Menu, X, Moon, Sun } from "lucide-react"

interface PatientSidebarProps {
  children: React.ReactNode
}

export default function PatientSidebar({ children }: PatientSidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    })
    router.push("/login")
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark")
    } else {
      document.documentElement.classList.add("dark")
    }
    setIsDarkMode(!isDarkMode)
  }

  const navItems = [
    { name: "Find Doctors", href: "/patient/search", icon: Search },
    { name: "My Appointments", href: "/patient/appointments", icon: Calendar },
    { name: "Profile", href: "/patient/profile", icon: User },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar toggle */}
      <button className="fixed top-4 left-4 z-50 md:hidden" onClick={toggleSidebar}>
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-center border-b px-4">
            <h1 className="text-xl font-bold">MediBook</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 ${
                  pathname === item.href ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200" : ""
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          <div className="border-t p-4 space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="mr-3 h-5 w-5" /> : <Moon className="mr-3 h-5 w-5" />}
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 dark:bg-gray-800 md:px-6">
          <h2 className="text-lg font-medium md:hidden">MediBook</h2>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

