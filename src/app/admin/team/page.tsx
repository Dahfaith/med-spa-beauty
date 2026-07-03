"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminTeamPage() {
  const supabase = createClient();
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", role: "", bio: "", image_url: "" });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    const { data, error } = await supabase.from("team_members").select("*").order("created_at", { ascending: true });
    if (!error && data) setTeam(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) return alert("Please upload an image first.");
    
    let error;
    if (editId) {
      const { error: updateError } = await supabase.from("team_members").update(formData).eq("id", editId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("team_members").insert([formData]);
      error = insertError;
    }

    if (!error) {
      setIsModalOpen(false);
      setEditId(null);
      setFormData({ name: "", role: "", bio: "", image_url: "" });
      fetchTeam();
    } else {
      alert("Error saving: " + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return;
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) {
      alert("Error deleting member: " + error.message);
    } else {
      fetchTeam();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold font-serif text-gray-900">Manage Team / Staff</h2>
        <button 
          onClick={() => {
            setEditId(null);
            setFormData({ name: "", role: "", bio: "", image_url: "" });
            setIsModalOpen(true);
          }}
          className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          + Add Staff Member
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
                <th className="py-4 px-6 font-medium text-gray-600">Photo</th>
                <th className="py-4 px-6 font-medium text-gray-600">Name & Role</th>
                <th className="py-4 px-6 font-medium text-gray-600">Bio</th>
                <th className="py-4 px-6 font-medium text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.map((member) => (
                <tr key={member.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                  <td className="py-4 px-6">
                    <img src={member.image_url} alt={member.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm max-w-xs truncate">{member.bio}</td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => {
                        setEditId(member.id);
                        setFormData({
                          name: member.name || "",
                          role: member.role || "",
                          bio: member.bio || "",
                          image_url: member.image_url || ""
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-secondary hover:underline mr-4 font-medium text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(member.id)}
                      className="text-red-500 hover:underline font-medium text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {team.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">No team members found.</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold font-serif mb-6">Add Staff Member</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded-lg" placeholder="Dr. Jane Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role / Job Title</label>
                <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border p-2 rounded-lg" placeholder="Senior Esthetician" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Short Bio</label>
                <textarea required value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full border p-2 rounded-lg" rows={3} placeholder="Brief description of experience..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Profile Photo</label>
                <ImageUpload onUpload={(url) => setFormData({...formData, image_url: url})} />
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border rounded-full font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary/90 shadow-md">Save Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
