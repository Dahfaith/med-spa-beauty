"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminTestimonialsPage() {
  const supabase = createClient();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", role: "", content: "", rating: 5 });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    if (!error && data) setReviews(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    let error;
    if (editId) {
      const { error: updateError } = await supabase.from("testimonials").update(formData).eq("id", editId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("testimonials").insert([formData]);
      error = insertError;
    }

    if (!error) {
      setIsModalOpen(false);
      setEditId(null);
      setFormData({ name: "", role: "", content: "", rating: 5 });
      fetchReviews();
    } else {
      alert("Error saving testimonial: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      alert("Error deleting: " + error.message);
    } else {
      fetchReviews();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold font-serif text-gray-900">Manage Testimonials</h2>
        <button 
          onClick={() => {
            setEditId(null);
            setFormData({ name: "", role: "", content: "", rating: 5 });
            setIsModalOpen(true);
          }}
          className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          + Add Review
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="py-4 px-6 font-medium text-gray-600">Client Name</th>
                <th className="py-4 px-6 font-medium text-gray-600">Review</th>
                <th className="py-4 px-6 font-medium text-gray-600">Rating</th>
                <th className="py-4 px-6 font-medium text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((rev) => (
                <tr key={rev.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                  <td className="py-4 px-6 font-medium text-gray-900">{rev.name}<br/><span className="text-xs text-gray-500 font-normal">{rev.role}</span></td>
                  <td className="py-4 px-6 text-gray-600 max-w-xs truncate">{rev.content}</td>
                  <td className="py-4 px-6 text-yellow-500 font-bold">{rev.rating} / 5</td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => {
                        setEditId(rev.id);
                        setFormData({
                          name: rev.name || "",
                          role: rev.role || "",
                          content: rev.content || "",
                          rating: rev.rating || 5
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-secondary hover:underline mr-4 font-medium text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(rev.id)}
                      className="text-red-500 hover:underline font-medium text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">No testimonials found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8">
            <h3 className="text-2xl font-bold font-serif mb-6">{editId ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Client Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role / Treatment</label>
                <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border p-2 rounded-lg" placeholder="e.g. Spa Client" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
                <input required type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})} className="w-full border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Review Content</label>
                <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border p-2 rounded-lg" rows={4} />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border rounded-full font-medium">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white rounded-full font-medium">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
