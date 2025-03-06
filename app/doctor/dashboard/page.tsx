"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Appointment {
  id: string
  patientName: string
  date: string
  time: string
  age: number
  reason: string
  status: "upcoming" | "past"
}

export default function DoctorDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]) // Define state with Appointment[]
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("https://arogo-ai-2.onrender.com/api/patients")
        const data: Appointment[] = await response.json() // Ensure response matches the type
        setAppointments(data)
      } catch (error) {
        console.error("Error fetching appointments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  const upcomingAppointments = appointments.filter((app) => app.status === "upcoming")
  const pastAppointments = appointments.filter((app) => app.status === "past")

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Patients</CardTitle>
            <CardDescription>All-time patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{appointments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingAppointments.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
          <TabsTrigger value="past">Past Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {loading ? (
            <p>Loading...</p>
          ) : upcomingAppointments.length > 0 ? (
            <div className="grid gap-4">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-6">
                    <h3 className="font-bold">{appointment.patientName}</h3>
                    <p className="text-sm">{appointment.date} at {appointment.time}</p>
                    <p className="text-sm">Age: {appointment.age}</p>
                    <p className="text-sm">Reason: {appointment.reason}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>No upcoming appointments.</p>
          )}
        </TabsContent>

        <TabsContent value="past">
          {loading ? (
            <p>Loading...</p>
          ) : pastAppointments.length > 0 ? (
            <div className="grid gap-4">
              {pastAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-6">
                    <h3 className="font-bold">{appointment.patientName}</h3>
                    <p className="text-sm">{appointment.date} at {appointment.time}</p>
                    <p className="text-sm">Age: {appointment.age}</p>
                    <p className="text-sm">Reason: {appointment.reason}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>No past appointments.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
