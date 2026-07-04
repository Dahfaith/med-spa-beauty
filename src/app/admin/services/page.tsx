"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminServicesPage() {
  const supabase = createClient();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Medical Aesthetics",
    description: "",
    duration: "",
    duration_minutes: 60,
    recovery_time: "",
    image_url: ""
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase.from("services").select("*").order("created_at", { ascending: false });
    if (!error && data) setServices(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let error;
    if (editId) {
      const { error: updateError } = await supabase.from("services").update(formData).eq("id", editId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("services").insert([formData]);
      error = insertError;
    }

    if (!error) {
      setIsModalOpen(false);
      setEditId(null);
      setFormData({ title: "", category: "Medical Aesthetics", description: "", duration: "", duration_minutes: 60, recovery_time: "", image_url: "" });
      fetchServices();
    } else {
      alert("Error saving service: " + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      alert("Error deleting service: " + error.message);
    } else {
      fetchServices();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold font-serif text-gray-900">Manage Services</h2>
        <button 
          onClick={() => {
            setEditId(null);
            setFormData({ title: "", category: "Medical Aesthetics", description: "", duration: "", duration_minutes: 60, recovery_time: "", image_url: "" });
            setIsModalOpen(true);
          }}
          className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          + Add New Service
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="py-4 px-6 font-medium text-gray-600">Image</th>
                <th className="py-4 px-6 font-medium text-gray-600">Title</th>
                <th className="py-4 px-6 font-medium text-gray-600">Category</th>
                <th className="py-4 px-6 font-medium text-gray-600">Duration</th>
                <th className="py-4 px-6 font-medium text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                  <td className="py-4 px-6">
                    {service.image_url ? (
                      <img src={service.image_url} alt={service.title} className="w-16 h-16 rounded object-cover" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded"></div>
                    )}
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">{service.title}</td>
                  <td className="py-4 px-6 text-gray-600">{service.category}</td>
                  <td className="py-4 px-6 text-gray-600">{service.duration}</td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => {
                        setEditId(service.id);
                        setFormData({
                          title: service.title || "",
                          category: service.category || "Medical Aesthetics",
                          description: service.description || "",
                          duration: service.duration || "",
                          duration_minutes: service.duration_minutes || 60,
                          recovery_time: service.recovery_time || "",
                          image_url: service.image_url || ""
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-secondary hover:underline mr-4 font-medium text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(service.id)}
                      className="text-red-500 hover:underline font-medium text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">No services found. Click "Add New Service" to create one.</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 text-2xl leading-none"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold font-serif mb-6 text-primary">Add New Service</h3>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Title</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-secondary focus:border-secondary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-secondary focus:border-secondary outline-none">
                    <option>Medical Aesthetics</option>
                    <option>Spa Treatments</option>
                    <option>Body Contouring</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration Display text (e.g. 45 mins)</label>
                  <input value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-secondary focus:border-secondary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exact Time (Minutes)</label>
                  <input type="number" required min="15" step="15" value={formData.duration_minutes} onChange={e => setFormData({...formData, duration_minutes: parseInt(e.target.value)})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-secondary focus:border-secondary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recovery Time</label>
                  <input value={formData.recovery_time} onChange={e => setFormData({...formData, recovery_time: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-secondary focus:border-secondary outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-secondary focus:border-secondary outline-none resize-none"></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                <ImageUpload onUpload={(url) => setFormData({...formData, image_url: url})} />
              </div>

              <div className="pt-4 flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90">Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
