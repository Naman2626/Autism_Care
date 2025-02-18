import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage: 'url(/images/background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Welcome to Autism Care</h1>
          <p className="text-xl md:text-2xl mb-8">Supporting families and individuals on the autism spectrum</p>
          <Link href="#services">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Key Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-card hover:bg-accent hover:text-accent-foreground transition-colors">
              <CardHeader>
                <CardTitle>Prediction Tool</CardTitle>
                <CardDescription>Assess autism traits</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/prediction">
                  <Button className="w-full">Start Assessment</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="bg-card hover:bg-accent hover:text-accent-foreground transition-colors">
              <CardHeader>
                <CardTitle>Community Forum</CardTitle>
                <CardDescription>Connect and share</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/community">
                  <Button className="w-full">Join Discussions</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="bg-card hover:bg-accent hover:text-accent-foreground transition-colors">
              <CardHeader>
                <CardTitle>Book Appointments</CardTitle>
                <CardDescription>Schedule consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/appointments">
                  <Button className="w-full">Find Specialists</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="bg-card hover:bg-accent hover:text-accent-foreground transition-colors">
              <CardHeader>
                <CardTitle>Resources</CardTitle>
                <CardDescription>Learn and get support</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/resources">
                  <Button className="w-full">Explore Resources</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">How We Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Early Intervention",
                description: "Early identification and support for better outcomes",
                icon: "🌟"
              },
              {
                title: "Family Support",
                description: "Comprehensive resources and guidance for families",
                icon: "👨‍👩‍👧‍👦"
              },
              {
                title: "Specialized Care",
                description: "Personalized care plans tailored to individual needs",
                icon: "❤️"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "1000+", label: "Families Helped" },
              { number: "50+", label: "Specialists" },
              { number: "15+", label: "Years Experience" },
              { number: "24/7", label: "Support Available" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">What Families Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "The support we received has been life-changing for our family.",
                author: "Sarah M.",
                role: "Parent"
              },
              {
                quote: "Professional, caring, and truly dedicated to helping our children succeed.",
                author: "John D.",
                role: "Parent"
              },
              {
                quote: "A wonderful resource for families navigating autism care.",
                author: "Emily R.",
                role: "Parent"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                <div className="font-semibold">{testimonial.author}</div>
                <div className="text-gray-500 text-sm">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Contact us today to learn how we can help your family</p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

