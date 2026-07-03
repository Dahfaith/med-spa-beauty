"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminCoursesPage() {
  const supabase = createClient();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    level: "Entry Level",
    duration: "",
    fee: "",
    description: "",
    certification: "",
    requirements: "",
    accommodation: "Not Included",
    image_url: ""
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
    if (!error && data) setCourses(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let error;
    if (editId) {
      const { error: updateError } = await supabase.from("courses").update(formData).eq("id", editId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("courses").insert([{ ...formData, modules: [] }]);
      error = insertError;
    }

    if (!error) {
      setIsModalOpen(false);
      setEditId(null);
      setFormData({ title: "", level: "Entry Level", duration: "", fee: "", description: "", certification: "", requirements: "", accommodation: "Not Included", image_url: "" });
      fetchCourses();
    } else {
      alert("Error saving course: " + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) {
      alert("Error deleting course: " + error.message);
    } else {
      fetchCourses();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold font-serif text-gray-900">Manage Academy Courses</h2>
        <button 
          onClick={() => {
            setEditId(null);
            setFormData({ title: "", level: "Entry Level", duration: "", fee: "", description: "", certification: "", requirements: "", accommodation: "Not Included", image_url: "" });
            setIsModalOpen(true);
          }}
          className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          + Add New Course
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="py-4 px-6 font-medium text-gray-600">Image</th>
                <th className="py-4 px-6 font-medium text-gray-600">Course Title</th>
                <th className="py-4 px-6 font-medium text-gray-600">Level</th>
                <th className="py-4 px-6 font-medium text-gray-600">Fee</th>
                <th className="py-4 px-6 font-medium text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                  <td className="py-4 px-6">
                    {course.image_url ? (
                      <img src={course.image_url} alt={course.title} className="w-16 h-16 rounded object-cover" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded"></div>
                    )}
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">{course.title}</td>
                  <td className="py-4 px-6 text-gray-600">{course.level}</td>
                  <td className="py-4 px-6 text-gray-600">{course.fee}</td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => {
                        setEditId(course.id);
                        setFormData({
                          title: course.title || "",
                          level: course.level || "Entry Level",
                          duration: course.duration || "",
                          fee: course.fee || "",
                          description: course.description || "",
                          certification: course.certification || "",
                          requirements: course.requirements || "",
                          accommodation: course.accommodation || "Not Included",
                          image_url: course.image_url || ""
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-secondary hover:underline mr-4 font-medium text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(course.id)}
                      className="text-red-500 hover:underline font-medium text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">No courses found. Click "Add New Course" to create one.</td>
                </tr>
              )}
            </tbody>
          </table>
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
            <h3 className="text-2xl font-bold font-serif mb-6 text-primary">Add New Course</h3>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-secondary focus:border-secondary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-secondary focus:border-secondary outline-none">
                    <option>Entry Level</option>
                    <option>Intermediate</option>
                    <option>Advanced / Medical</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-secondary focus:border-secondary outline-none" placeholder="e.g. 4 Weeks" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tuition Fee</label>
                  <input value={formData.fee} onChange={e => setFormData({...formData, fee: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-secondary focus:border-secondary outline-none" placeholder="e.g. ₦500,000" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-secondary focus:border-secondary outline-none resize-none"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Certification</label>
                  <input value={formData.certification} onChange={e => setFormData({...formData, certification: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-secondary focus:border-secondary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation</label>
                  <select value={formData.accommodation} onChange={e => setFormData({...formData, accommodation: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-secondary focus:border-secondary outline-none">
                    <option>Not Included</option>
                    <option>Available upon request (extra fee)</option>
                    <option>Included (Luxury shared apartment)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                <input value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-secondary focus:border-secondary outline-none" placeholder="e.g. No prior experience required" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Image</label>
                <ImageUpload onUpload={(url) => setFormData({...formData, image_url: url})} />
              </div>

              <div className="pt-4 flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
