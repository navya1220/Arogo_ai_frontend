"use client";
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/dashboard-layout"

import { useToast } from "@/components/ui/use-toast"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

    if (!isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please login to access the dashboard",
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

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Users</CardTitle>
              <CardDescription>User growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
              <div className="mt-4 h-20 bg-muted rounded-md"></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Revenue</CardTitle>
              <CardDescription>Monthly revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$12,345</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
              <div className="mt-4 h-20 bg-muted rounded-md"></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Current active users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">243</div>
              <p className="text-xs text-muted-foreground">+18% from yesterday</p>
              <div className="mt-4 h-20 bg-muted rounded-md"></div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs">{i}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Activity {i}</p>
                      <p className="text-xs text-muted-foreground">Description of activity {i}</p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      {i} hour{i !== 1 ? "s" : ""} ago
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

