"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [settings, setSettings] = useState({
    location: "",
    phone: "",
    email: "",
    hours_mon_fri: "",
    hours_sat: "",
    hours_sun: "",
    academy_image_url: "",
    hero_image_url: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
    if (data) {
      setSettings(data);
    } else {
      console.log("No settings found or table doesn't exist yet.");
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    const { error } = await supabase
      .from("site_settings")
      .upsert({ id: 1, ...settings });

    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      alert("Error saving settings: " + error.message);
    }
    
    setSaving(false);
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold font-serif text-gray-900 mb-8">Site Settings & Contact Info</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSave} className="space-y-6">
          
          <div>
            <h3 className="text-lg font-bold mb-4 border-b pb-2">General Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp / Phone Number</label>
                <input 
                  required
                  type="text" 
                  value={settings.phone}
                  onChange={e => setSettings({...settings, phone: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">This is the number that will be used for WhatsApp links and displayed on the contact page.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Addresses</label>
                <textarea 
                  required
                  rows={2}
                  value={settings.email}
                  onChange={e => setSettings({...settings, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Physical Location</label>
              <textarea 
                required
                rows={2}
                value={settings.location}
                onChange={e => setSettings({...settings, location: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Opening Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mon - Fri</label>
                <input 
                  required
                  type="text" 
                  value={settings.hours_mon_fri}
                  onChange={e => setSettings({...settings, hours_mon_fri: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Saturday</label>
                <input 
                  required
                  type="text" 
                  value={settings.hours_sat}
                  onChange={e => setSettings({...settings, hours_sat: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sunday</label>
                <input 
                  required
                  type="text" 
                  value={settings.hours_sun}
                  onChange={e => setSettings({...settings, hours_sun: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Homepage Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Hero Background</label>
                <ImageUpload onUpload={(url) => setSettings({...settings, hero_image_url: url})} />
                {settings.hero_image_url && <img src={settings.hero_image_url} alt="Hero preview" className="mt-2 h-20 w-auto rounded object-cover" />}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Academy Preview Image</label>
                <ImageUpload onUpload={(url) => setSettings({...settings, academy_image_url: url})} />
                {settings.academy_image_url && <img src={settings.academy_image_url} alt="Academy preview" className="mt-2 h-20 w-auto rounded object-cover" />}
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end items-center gap-4">
            {success && <span className="text-green-600 font-medium">Settings saved successfully!</span>}
            <button 
              type="submit" 
              disabled={saving}
              className="bg-primary text-white px-8 py-3 rounded-md font-medium hover:bg-primary/90 disabled:opacity-70 transition-colors"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
