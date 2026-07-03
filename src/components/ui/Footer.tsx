import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-16">
      <div className="container mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-white text-primary rounded-full flex items-center justify-center font-serif font-bold text-xl">M</div>
            <div>
              <span className="font-serif font-bold text-white text-xl tracking-tight block leading-tight">Med Spa &</span>
              <span className="text-secondary text-sm font-medium tracking-widest uppercase block leading-tight">Beauty Arena</span>
            </div>
          </div>
          <p className="text-gray-300 font-light text-sm leading-relaxed">
            Elevating natural beauty through world-class aesthetic treatments and industry-leading professional training in Nigeria.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-6">Quick Links</h4>
          <ul className="space-y-3 text-gray-300 font-light text-sm">
            <li><Link href="/about" className="hover:text-secondary transition-colors">About Us</Link></li>
            <li><Link href="/services" className="hover:text-secondary transition-colors">Spa Services</Link></li>
            <li><Link href="/academy" className="hover:text-secondary transition-colors">Beauty Academy</Link></li>
            <li><Link href="/gallery" className="hover:text-secondary transition-colors">Our Gallery</Link></li>
            <li><Link href="/contact" className="hover:text-secondary transition-colors">Contact</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-6">Contact Info</h4>
          <ul className="space-y-3 text-gray-300 font-light text-sm">
            <li>123 Beauty Avenue, Victoria Island</li>
            <li>Lagos, Nigeria</li>
            <li>+234 915 348 9582</li>
            <li>hello@medspabeauty.com</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-6">Newsletter</h4>
          <p className="text-gray-300 font-light text-sm mb-4">Subscribe to receive exclusive offers and beauty tips.</p>
          <div className="flex">
            <input type="email" placeholder="Your email address" className="bg-white/10 px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-secondary text-sm" />
            <button className="bg-secondary px-4 py-2 rounded-r-md font-bold text-sm">Join</button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 font-light">
        <p>&copy; {new Date().getFullYear()} Med Spa & Beauty Arena. All rights reserved.</p>
        <p className="mt-4 md:mt-0">
          Designed by <a href="#" className="text-secondary font-medium hover:underline">Visioreach Concepts</a>
        </p>
      </div>
    </footer>
  );
}
