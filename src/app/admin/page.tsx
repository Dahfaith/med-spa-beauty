export default function AdminDashboardPage() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Pending Bookings", value: "12", trend: "+2 from yesterday" },
          { label: "Total Services", value: "24", trend: "Active" },
          { label: "Academy Courses", value: "3", trend: "Active" },
          { label: "Total Revenue", value: "₦4.2M", trend: "This month" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-xs text-secondary mt-2">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold mb-6">Recent Bookings & Inquiries</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Placeholder Rows */}
              {[1, 2, 3, 4].map((row) => (
                <tr key={row} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">Jane Doe</td>
                  <td className="py-3 px-4 text-sm text-gray-600">Spa Treatment</td>
                  <td className="py-3 px-4 text-sm text-gray-600">Today, 2:30 PM</td>
                  <td className="py-3 px-4">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">Pending</span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-primary hover:underline text-sm font-medium">Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
