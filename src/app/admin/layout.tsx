"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  
  const isLoginPage = pathname === "/admin/login";

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-serif font-bold">Admin Portal</h2>
          <p className="text-xs text-secondary mt-1">Med Spa & Beauty Arena</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
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
                  className="block px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
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
      <main className="flex-1 overflow-y-auto bg-gray-50 text-gray-900">
        <header className="bg-white shadow-sm h-16 flex items-center px-8 justify-between">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Admin User</span>
            <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold">A</div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
