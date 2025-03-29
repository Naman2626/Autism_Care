"use client";

// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBax2WKSy4JZfCT75NLGb2Aj03ibiGAREI",
  authDomain: "autismcare-deef8.firebaseapp.com",
  projectId: "autismcare-deef8",
  storageBucket: "autismcare-deef8.firebasestorage.app",
  messagingSenderId: "702574842049",
  appId: "1:702574842049:web:79323cc224ce16c7b8c440",
  measurementId: "G-5C3HCQ54J5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";

export default function AppointmentsPage() {
  const specialists = [
    { id: 1, name: "Dr. Emily Johnson", specialty: "Child Psychologist", availableSlot: "Mon, 10:00 AM" },
    { id: 2, name: "Dr. Michael Lee", specialty: "Occupational Therapist", availableSlot: "Tue, 2:00 PM" },
    { id: 3, name: "Dr. Sarah Williams", specialty: "Speech Therapist", availableSlot: "Wed, 11:00 AM" },
    { id: 4, name: "Dr. David Brown", specialty: "Behavioral Therapist", availableSlot: "Thu, 3:00 PM" },
  ];

  const [loading, setLoading] = useState(false);

  const bookAppointment = async (specialist: { id: number; name: string; specialty: string; availableSlot: string }) => {
    setLoading(true);
    try {
      console.log("Booking appointment for:", specialist);

      const appointment = {
        doctorName: specialist.name,
        specialty: specialist.specialty,
        slot: specialist.availableSlot,
        bookedAt: new Date().toISOString(),
      };

      console.log("Appointment data:", appointment);

      // Add appointment to Firestore
      const docRef = await addDoc(collection(db, "appointments"), appointment);
      console.log("Appointment booked successfully with ID:", docRef.id);

      alert(`Appointment with ${specialist.name} booked successfully!`);
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

