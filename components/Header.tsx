import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <nav className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <Link href="/" className="text-2xl font-bold mb-4 sm:mb-0">
          Autism Support System
        </Link>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/prediction">
            <Button variant="secondary">Prediction</Button>
          </Link>
          <Link href="/community">
            <Button variant="secondary">Community</Button>
          </Link>
          <Link href="/appointments">
            <Button variant="secondary">Appointments</Button>
          </Link>
          <Link href="/resources">
            <Button variant="secondary">Resources</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}

