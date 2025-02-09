export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Autism Care</h3>
            <p className="text-gray-300">
              Supporting families and individuals affected by autism with care and compassion.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/services" className="text-gray-300 hover:text-white">Services</a></li>
              <li><a href="/resources" className="text-gray-300 hover:text-white">Resources</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: info@autismcare.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Address: 123 Care Street, City, State</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Autism Care. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 