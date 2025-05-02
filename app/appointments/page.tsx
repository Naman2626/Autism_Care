"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "./firebaseConfig";

export default function AppointmentsPage() {
  const specialists = [
    { id: 1, name: "Dr. Emily Johnson", specialty: "Child Psychologist", availableSlot: "Mon, 10:00 AM" },
    { id: 2, name: "Dr. Michael Lee", specialty: "Occupational Therapist", availableSlot: "Tue, 2:00 PM" },
    { id: 3, name: "Dr. Sarah Williams", specialty: "Speech Therapist", availableSlot: "Wed, 11:00 AM" },
    { id: 4, name: "Dr. David Brown", specialty: "Behavioral Therapist", availableSlot: "Thu, 3:00 PM" },
  ];

  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<{ [key: number]: { date: string; time: string } }>({});

  const handleDateChange = (id: number, date: string) => {
    setAppointments((prev) => ({
      ...prev,
      [id]: { ...prev[id], date },
    }));
  };

  const handleTimeChange = (id: number, time: string) => {
    setAppointments((prev) => ({
      ...prev,
      [id]: { ...prev[id], time },
    }));
  };

  const bookAppointment = async (specialist: { id: number; name: string; specialty: string; availableSlot: string }) => {
    const appointmentDetails = appointments[specialist.id];
    if (!appointmentDetails?.date || !appointmentDetails?.time) {
      alert("Please select a date and time for the appointment.");
      return;
    }

    setLoading(true);
    try {
      const appointment = {
        doctorName: specialist.name,
        specialty: specialist.specialty,
        slot: `${appointmentDetails.date} at ${appointmentDetails.time}`,
        bookedAt: new Date().toISOString(),
      };

      // Add appointment to Firestore
      const docRef = await addDoc(collection(db, "appointments"), appointment);
      console.log("Appointment booked successfully with ID:", docRef.id);

      alert(`Appointment with ${specialist.name} booked successfully!`);
      setAppointments((prev) => ({
        ...prev,
        [specialist.id]: { date: "", time: "" },
      }));
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Book an Appointment</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {specialists.map((specialist) => (
          <Card
            key={specialist.id}
            className="bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <CardHeader>
              <CardTitle>{specialist.name}</CardTitle>
              <CardDescription>{specialist.specialty}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Next available: {specialist.availableSlot}</p>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Select Date</label>
                <input
                  type="date"
                  value={appointments[specialist.id]?.date || ""}
                  onChange={(e) => handleDateChange(specialist.id, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Select Time</label>
                <input
                  type="time"
                  value={appointments[specialist.id]?.time || ""}
                  onChange={(e) => handleTimeChange(specialist.id, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => bookAppointment(specialist)}
                disabled={loading}
              >
                {loading ? "Booking..." : "Book Appointment"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}