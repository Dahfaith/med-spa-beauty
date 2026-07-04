"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminBookingsPage() {
  const supabase = createClient();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    if (!error && data) setBookings(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", id);
    if (error) alert("Error updating status: " + error.message);
    else fetchBookings();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) alert("Error deleting: " + error.message);
    else fetchBookings();
  };

  const getStatusColor = (status: string) => {
    if (status === 'Pending') return 'bg-yellow-100 text-yellow-800';
    if (status === 'Confirmed') return 'bg-blue-100 text-blue-800';
    if (status === 'Completed') return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6 md:mb-8">Client Inquiries & Bookings</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* MOBILE VIEW (Cards) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {bookings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No inquiries found.</p>
            ) : (
              bookings.map((booking) => (
                <div key={booking.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{booking.first_name} {booking.last_name}</h3>
                      <p className="text-sm text-gray-500">{booking.phone}</p>
                    </div>
                    <select 
                      value={booking.status} 
                      onChange={(e) => updateStatus(booking.id, e.target.value)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full outline-none ${getStatusColor(booking.status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div className="mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="font-medium text-primary mb-1">{booking.service_type}</p>
                    {booking.booking_date && (
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        🗓 {booking.booking_date} {booking.booking_time && `at ${formatTime(booking.booking_time)}`}
                      </p>
                    )}
                    {booking.duration_minutes && (
                      <p className="text-xs text-gray-400 mt-1">⏱ {booking.duration_minutes} mins</p>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-4 break-all">
                    ✉️ {booking.email}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => setSelectedMessage(booking.message || "No message provided.")}
                      className="text-secondary font-medium text-sm px-3 py-1.5 bg-secondary/10 rounded-lg"
                    >
                      View Message
                    </button>
                    <button 
                      onClick={() => handleDelete(booking.id)}
                      className="text-red-500 font-medium text-sm px-3 py-1.5 bg-red-50 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* DESKTOP VIEW (Table) */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="py-4 px-6 font-medium text-gray-600">Client Name</th>
                    <th className="py-4 px-6 font-medium text-gray-600">Contact</th>
                    <th className="py-4 px-6 font-medium text-gray-600">Service & Schedule</th>
                    <th className="py-4 px-6 font-medium text-gray-600">Status</th>
                    <th className="py-4 px-6 font-medium text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                      <td className="py-4 px-6 font-medium text-gray-900">{booking.first_name} {booking.last_name}</td>
                      <td className="py-4 px-6 text-gray-600">
                        {booking.email}<br/>
                        <span className="text-xs text-gray-400">{booking.phone}</span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        <span className="font-medium text-primary">{booking.service_type}</span>
                        {booking.booking_date && (
                          <div className="text-sm mt-1 flex items-center gap-1 text-gray-500">
                            🗓 {booking.booking_date} 
                            {booking.booking_time && ` at ${formatTime(booking.booking_time)}`}
                          </div>
                        )}
                        {booking.duration_minutes && (
                          <div className="text-xs text-gray-400 mt-0.5">⏱ {booking.duration_minutes} mins</div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <select 
                          value={booking.status} 
                          onChange={(e) => updateStatus(booking.id, e.target.value)}
                          className={`text-xs font-semibold px-2 py-1 rounded-full outline-none ${getStatusColor(booking.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => setSelectedMessage(booking.message || "No message provided.")}
                          className="text-secondary hover:underline mr-4 font-medium text-sm"
                        >
                          View Message
                        </button>
                        <button 
                          onClick={() => handleDelete(booking.id)}
                          className="text-red-500 hover:underline font-medium text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">No inquiries found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 relative">
            <h3 className="text-xl font-bold font-serif mb-4 text-primary">Client Message</h3>
            <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-100">{selectedMessage}</p>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedMessage(null)} className="px-6 py-2 bg-primary text-white rounded-full font-medium">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
