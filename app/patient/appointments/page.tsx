"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"

const API_URL = "https://arogo-ai-2.onrender.com/api/appointments"

// Define the Appointment interface
interface Appointment {
  _id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: "upcoming" | "past";
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get<Appointment[]>(API_URL);
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (id: string) => {
    if (!id) return;
  
    try {
      console.log("Attempting to cancel appointment with ID:", id);
  
      const response = await axios.delete(`${API_URL}/${id}`);
  
      if (response.status === 200) {
        setAppointments((prev) => prev.filter((app) => app._id !== id));
        toast({
          title: "Appointment Cancelled",
          description: "Your appointment has been successfully cancelled.",
        });
      } else {
        throw new Error(`Failed to delete appointment: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error("Error cancelling appointment:", error.response ? error.response.data : error.message);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to cancel the appointment. Please try again.",
        variant: "destructive",
      });
    }
    setAppointmentToCancel(null);
  };
  

  const upcomingAppointments = appointments.filter((app) => app.status === "upcoming");
  const pastAppointments = appointments.filter((app) => app.status === "past");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>

      {loading ? (
        <p className="text-center">Loading appointments...</p>
      ) : (
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
  {upcomingAppointments.length > 0 ? (
    <div className="grid gap-4">
      {upcomingAppointments.map((appointment) => (
        <Card key={appointment._id}>  {/* Ensure key is unique */}
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-bold">{appointment.doctorName}</h3>
                <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                <p className="text-sm">
                  {appointment.date} at {appointment.time}
                </p>
              </div>

              <Dialog
                open={appointmentToCancel === appointment._id}
                onOpenChange={(open) => !open && setAppointmentToCancel(null)}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="mt-4 md:mt-0"
                    onClick={() => setAppointmentToCancel(appointment._id)}
                  >
                    Cancel Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel Appointment</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to cancel your appointment with{" "}
                      {appointment.doctorName} on {appointment.date} at {appointment.time}?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAppointmentToCancel(null)}>
                      Keep Appointment
                    </Button>
                    <Button variant="destructive" onClick={() => handleCancelAppointment(appointment._id)}>
                      Cancel Appointment
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <div className="text-center py-12">
      <p className="text-muted-foreground">You have no upcoming appointments.</p>
    </div>
  )}
</TabsContent>


          <TabsContent value="past">
            {pastAppointments.length > 0 ? (
              <div className="grid gap-4">
                {pastAppointments.map((appointment) => (
                  <Card key={appointment._id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-bold">{appointment.doctorName}</h3>
                          <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                          <p className="text-sm">
                            {appointment.date} at {appointment.time}
                          </p>
                        </div>
                        <Button variant="outline" className="mt-4 md:mt-0">
                          Book Again
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">You have no past appointments.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
