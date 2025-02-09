import Link from 'next/link'
import { Button } from '../ui/button'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Autism Care
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/services">
              <Button variant="ghost">Services</Button>
            </Link>
            <Link href="/resources">
              <Button variant="ghost">Resources</Button>
            </Link>
            <Link href="/contact">
              <Button variant="default">Contact Us</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 