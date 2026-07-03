"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Menu, X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isLoginPage = pathname === "/admin/login";

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const NavLinks = () => (
    <ul className="space-y-1 px-3">
      {[
        { name: "Dashboard", path: "/admin" },
        { name: "Manage Services", path: "/admin/services" },
        { name: "Manage Courses", path: "/admin/courses" },
        { name: "Manage Team", path: "/admin/team" },
        { name: "Gallery Images", path: "/admin/gallery" },
        { name: "Testimonials", path: "/admin/testimonials" },
        { name: "Bookings", path: "/admin/bookings" },
        { name: "Settings", path: "/admin/settings" },
      ].map((link) => (
        <li key={link.path}>
          <Link
            href={link.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-primary text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-serif font-bold">Admin Portal</h2>
          <p className="text-xs text-secondary mt-1">Med Spa & Beauty Arena</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleSignOut}
            className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md transition-colors text-sm"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      
      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-primary text-white z-50 transform transition-transform duration-300 md:hidden flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-serif font-bold">Admin Portal</h2>
            <p className="text-xs text-secondary mt-1">Med Spa & Beauty Arena</p>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-secondary">
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleSignOut}
            className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md transition-colors text-sm"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50 text-gray-900">
        <header className="bg-white shadow-sm h-16 shrink-0 flex items-center px-4 md:px-8 justify-between">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-primary p-2 -ml-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold hidden sm:block">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">Admin User</span>
            <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold">A</div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
