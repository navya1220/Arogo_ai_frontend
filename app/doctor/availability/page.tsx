"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calender"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

const timeSlots = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
]

export default function AvailabilityPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const { toast } = useToast()

  const handleSlotToggle = (time: string) => {
    setSelectedSlots((prev) => (prev.includes(time) ? prev.filter((slot) => slot !== time) : [...prev, time]))
  }

  const handleSaveAvailability = () => {
    // In a real app, you would send this data to your API
    console.log({
      date: date?.toISOString().split("T")[0],
      slots: selectedSlots,
    })

    toast({
      title: "Availability Saved",
      description: `Your availability for ${date?.toLocaleDateString()} has been updated.`,
    })
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Set Your Availability</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>Choose a date to set your availability</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Time Slots</CardTitle>
            <CardDescription>
              {date ? `Select available time slots for ${date.toLocaleDateString()}` : "Please select a date first"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {timeSlots.map((time) => (
                <div key={time} className="flex items-center space-x-2">
                  <Checkbox
                    id={`slot-${time}`}
                    checked={selectedSlots.includes(time)}
                    onCheckedChange={() => handleSlotToggle(time)}
                  />
                  <Label htmlFor={`slot-${time}`}>{time}</Label>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveAvailability} disabled={!date || selectedSlots.length === 0}>
              Save Availability
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

