"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import DoctorSidebar from "@/components/doctor-sidebar"

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is authenticated and is a doctor
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
    const userRole = localStorage.getItem("userRole")

    if (!isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please login to access this page",
        variant: "destructive",
      })
      router.push("/login")
    } else if (userRole !== "doctor") {
      toast({
        title: "Unauthorized",
        description: "This page is only for doctors",
        variant: "destructive",
      })
      router.push("/login")
    } else {
      setIsLoading(false)
    }
  }, [router, toast])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return <DoctorSidebar>{children}</DoctorSidebar>
}

