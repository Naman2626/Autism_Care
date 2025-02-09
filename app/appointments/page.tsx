import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AppointmentsPage() {
  const specialists = [
    { id: 1, name: "Dr. Emily Johnson", specialty: "Child Psychologist", availableSlot: "Mon, 10:00 AM" },
    { id: 2, name: "Dr. Michael Lee", specialty: "Occupational Therapist", availableSlot: "Tue, 2:00 PM" },
    { id: 3, name: "Dr. Sarah Williams", specialty: "Speech Therapist", availableSlot: "Wed, 11:00 AM" },
    { id: 4, name: "Dr. David Brown", specialty: "Behavioral Therapist", availableSlot: "Thu, 3:00 PM" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Book an Appointment</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {specialists.map((specialist) => (
          <Card key={specialist.id} className="bg-card hover:bg-accent hover:text-accent-foreground transition-colors">
            <CardHeader>
              <CardTitle>{specialist.name}</CardTitle>
              <CardDescription>{specialist.specialty}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Next available: {specialist.availableSlot}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Book Appointment</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

