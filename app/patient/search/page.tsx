"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// API Endpoint
const API_URL = "https://arogo-ai-2.onrender.com/api/doctors/";

// Define the Doctor interface
interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  location: string;
  experience: number;
  image?: string;
}

export default function DoctorSearchPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [specialty, setSpecialty] = useState<string>("All Specialties");
  const [location, setLocation] = useState<string>("All Locations");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch doctors");

        const data: Doctor[] = await response.json();
        setDoctors(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Extract unique specialties and locations from API data
  const specialties = ["All Specialties", ...new Set(doctors.map((doc) => doc.specialty))];
  const locations = ["All Locations", ...new Set(doctors.map((doc) => doc.location))];

  // Filter doctors based on search criteria
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialty === "All Specialties" || doctor.specialty === specialty;
    const matchesLocation = location === "All Locations" || doctor.location === location;

    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Find a Doctor</h1>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div>
          <Label htmlFor="search">Doctor's Name</Label>
          <Input
            id="search"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="specialty">Specialty</Label>
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger id="specialty">
              <SelectValue placeholder="Select specialty" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger id="location">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading doctors...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <p>Error: {error}</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <Card key={doctor._id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center p-6">
                    <img
                      src={doctor.image || "/placeholder.svg"}
                      alt={doctor.name}
                      className="h-16 w-16 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h3 className="font-bold">{doctor.name}</h3>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                      <p className="text-sm">{doctor.experience} years experience</p>
                      <p className="text-sm">{doctor.location}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 p-4">
                  <Button asChild className="w-full">
                    <Link href={`/patient/doctor/${doctor._id}`}>View Profile</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No doctors found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
