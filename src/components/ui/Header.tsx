"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Academy", path: "/academy" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-serif font-bold text-xl">M</div>
          <div>
            <span className="font-serif font-bold text-primary text-xl tracking-tight block leading-tight">Med Spa &</span>
            <span className="text-secondary text-sm font-medium tracking-widest uppercase block leading-tight">Beauty Arena</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.path} className="text-gray-600 hover:text-primary font-medium text-sm uppercase tracking-wider transition-colors">
              {link.name}
            </Link>
          ))}
          <Link href="/contact" className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-sm">
            Book Appointment
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger className="text-primary p-2 focus:outline-none">
              <Menu size={28} />
            </SheetTrigger>
            <SheetContent side="right" className="bg-soft-cream border-l-0 w-[85vw] sm:w-[400px] flex flex-col items-center pt-20">
              <div className="mb-12 text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-serif font-bold text-3xl mx-auto mb-4">M</div>
                <span className="font-serif font-bold text-primary text-2xl tracking-tight block leading-tight">Med Spa &</span>
                <span className="text-secondary text-sm font-medium tracking-widest uppercase block leading-tight">Beauty Arena</span>
              </div>
              
              <nav className="flex flex-col items-center gap-8 w-full">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.path} 
                    className="text-primary text-2xl font-serif hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="w-12 h-px bg-primary/20 my-4"></div>
                
                <Link href="/contact" className="bg-secondary text-white w-3/4 text-center px-6 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-secondary/90 transition-all hover:-translate-y-1 mt-4">
                  Book Appointment
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
