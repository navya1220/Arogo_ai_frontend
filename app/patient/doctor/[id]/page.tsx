
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

const API_URL = "http://localhost:5000/api/doctors/"

export default function DoctorProfilePage() {
  const params = useParams()
  const doctorId = params?.id as string
  const [doctor, setDoctor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()


  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`${API_URL}${doctorId}`)
        if (!response.ok) throw new Error("Failed to fetch doctor details")
        const data = await response.json()
        setDoctor(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctor()
  }, [doctorId])

  if (loading) return <p className="p-6 text-center">Loading...</p>
  if (error)
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="mb-4">{error}</p>
        <Button onClick={() => router.push("/patient/search")}>Back to Search</Button>
      </div>
    )

  if (!doctor) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Doctor Not Found</h1>
        <p className="mb-4">The doctor you're looking for doesn't exist.</p>
        <Button onClick={() => router.push("/patient/search")}>Back to Search</Button>
      </div>
    )
  }

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      toast({
        title: "Error",
        description: "Please select a time slot",
        variant: "destructive",
      })
      return
    }
  
    const [date, time] = selectedSlot.split("-")
  
    const appointmentData = {
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date,
      time,
      reason: "Consultation",
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      })
  
      if (!response.ok) {
        const errorResponse = await response.json()
        throw new Error(errorResponse.message || "Failed to book appointment")
      }
  
      toast({
        title: "Appointment Booked!",
        description: `Your appointment with ${doctor.name} has been scheduled.`,
      })
  
      setIsDialogOpen(false)
      router.push("/patient/appointments")
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to book appointment",
        variant: "destructive",
      })
    }
  }
  
  return (
    <div className="p-6">
      <Button variant="outline" className="mb-6" onClick={() => router.push("/patient/search")}>
        Back to Search
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <img
                  src={doctor.image || "/placeholder.svg"}
                  alt={doctor.name}
                  className="h-40 w-40 rounded-full mb-4 object-cover"
                />
                <h2 className="text-2xl font-bold">{doctor.name}</h2>
                <p className="text-blue-600 dark:text-blue-400">{doctor.specialty}</p>
                <p className="text-sm text-muted-foreground">{doctor.experience} years experience</p>
                <p className="text-sm text-muted-foreground">{doctor.location}</p>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="mt-4 w-full">Book Appointment</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Book an Appointment</DialogTitle>
                      <DialogDescription>
                        Select an available time slot to book your appointment with {doctor.name}.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                      <RadioGroup value={selectedSlot || ""} onValueChange={setSelectedSlot}>
                        {doctor.availableSlots.map((slot: any) => (
                          <div key={slot.id} className="flex items-center space-x-2 mb-2 p-2 border rounded-md">
                            <RadioGroupItem value={`${slot.date}-${slot.time}`} id={`slot-${slot.id}`} />
                            <Label htmlFor={`slot-${slot.id}`} className="flex-1">
                              {slot.date} at {slot.time}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleBookAppointment}>Confirm Booking</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{doctor.bio}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Education & Qualifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{doctor.education}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside">
                {doctor.availableSlots.map((slot: any) => (
                  <li key={slot.id}>
                    {slot.date} at {slot.time}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
