import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ServicesPage() {
  const services = [
    {
      title: "Early Intervention",
      description: "Specialized programs for children under 5",
      details: "Our early intervention programs focus on developing communication, social, and cognitive skills during crucial developmental years."
    },
    {
      title: "Behavioral Therapy",
      description: "ABA and other evidence-based approaches",
      details: "We offer various behavioral therapy approaches, including Applied Behavior Analysis (ABA), tailored to each individual's needs."
    },
    {
      title: "Speech Therapy",
      description: "Communication skill development",
      details: "Our speech therapists work on both verbal and non-verbal communication skills, including alternative communication methods when needed."
    },
    {
      title: "Occupational Therapy",
      description: "Daily living skills support",
      details: "We help develop fine motor skills, sensory processing, and daily living skills for greater independence."
    },
    {
      title: "Family Support",
      description: "Guidance and resources for families",
      details: "We provide training, counseling, and support groups for families to better understand and support their loved ones."
    },
    {
      title: "Social Skills Groups",
      description: "Peer interaction programs",
      details: "Structured group activities to develop social skills and build friendships in a supportive environment."
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{service.details}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 