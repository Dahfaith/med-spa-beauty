import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch counts for the stats cards
  const { count: pendingBookingsCount } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("status", "Pending");

  const { count: servicesCount } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true });

  const { count: coursesCount } = await supabase
    .from("courses")
    .select("*", { count: "exact", head: true });

  const { count: testimonialsCount } = await supabase
    .from("testimonials")
    .select("*", { count: "exact", head: true });

  // Fetch top 5 most recent bookings
  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium mb-1">Pending Bookings</p>
          <h3 className="text-3xl font-bold text-gray-900">{pendingBookingsCount || 0}</h3>
          <p className="text-xs text-secondary mt-2">Requires Action</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium mb-1">Total Services</p>
          <h3 className="text-3xl font-bold text-gray-900">{servicesCount || 0}</h3>
          <p className="text-xs text-green-600 mt-2">Active</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium mb-1">Academy Courses</p>
          <h3 className="text-3xl font-bold text-gray-900">{coursesCount || 0}</h3>
          <p className="text-xs text-green-600 mt-2">Active</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium mb-1">Total Testimonials</p>
          <h3 className="text-3xl font-bold text-gray-900">{testimonialsCount || 0}</h3>
          <p className="text-xs text-green-600 mt-2">Published</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Recent Bookings & Inquiries</h2>
          <Link href="/admin/bookings" className="text-sm text-primary hover:underline font-medium">
            View All
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Service Type</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings && recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{booking.first_name} {booking.last_name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{booking.service_type || "General Inquiry"}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link href="/admin/bookings" className="text-primary hover:underline text-sm font-medium">
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
