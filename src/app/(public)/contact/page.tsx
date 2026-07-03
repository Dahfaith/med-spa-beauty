"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ContactPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [settings, setSettings] = useState({
    location: "123 Beauty Avenue, Victoria Island\nLagos, Nigeria",
    phone: "+2349153489582",
    email: "hello@medspabeauty.com\nacademy@medspabeauty.com",
    hours_mon_fri: "9:00 AM - 7:00 PM",
    hours_sat: "10:00 AM - 5:00 PM",
    hours_sun: "Closed"
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
      if (data) setSettings(data);
    };
    fetchSettings();
  }, []);
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    service_type: "General Consultation",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("bookings").insert([formData]);

    if (!error) {
      setSuccess(true);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        service_type: "Consultation",
        message: ""
      });
    } else {
      alert("Error submitting form. Please try again.");
    }
    
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-soft-cream pt-20">
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-secondary font-medium tracking-widest uppercase text-sm mb-2 block">Get in Touch</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Contact & Booking</h1>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 bg-white rounded-[2rem] lg:rounded-[2.5rem] shadow-xl overflow-hidden">
            {/* Contact Info */}
            <div className="lg:w-2/5 bg-primary text-white p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-serif font-bold mb-6">Contact Information</h3>
                <p className="text-gray-300 font-light mb-12">
                  Reach out to us for spa bookings, academy inquiries, or a personalized consultation.
                </p>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">📍</div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Our Location</h4>
                      <p className="text-gray-300 font-light whitespace-pre-line break-words">{settings.location.replace(/\\n/g, '\n')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">📞</div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Phone Number</h4>
                      <p className="text-gray-300 font-light whitespace-pre-line break-words">{settings.phone.replace(/\\n/g, '\n')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">✉️</div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-lg mb-1">Email Address</h4>
                      <p className="text-gray-300 font-light whitespace-pre-line break-all sm:break-words">{settings.email.replace(/\\n/g, '\n')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <h4 className="font-bold mb-4">Opening Hours</h4>
                <p className="text-gray-300 font-light text-sm flex justify-between mb-2"><span>Mon - Fri:</span> <span>{settings.hours_mon_fri}</span></p>
                <p className="text-gray-300 font-light text-sm flex justify-between mb-2"><span>Saturday:</span> <span>{settings.hours_sat}</span></p>
                <p className="text-gray-300 font-light text-sm flex justify-between"><span>Sunday:</span> <span>{settings.hours_sun}</span></p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:w-3/5 p-8 lg:p-12">
              <h3 className="text-3xl font-serif font-bold text-primary mb-8">Send us a Message</h3>
              
              {success ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
                  <h3 className="text-3xl font-serif font-bold text-primary mb-4">Request Received!</h3>
                  <p className="text-gray-600 text-lg mb-8">
                    Thank you for reaching out. A member of our team will contact you shortly.
                  </p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" placeholder="Jane" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input required value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" placeholder="jane@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" placeholder="+234..." />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select value={formData.service_type} onChange={e => setFormData({...formData, service_type: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors text-gray-700">
                    <optgroup label="General">
                      <option value="General Consultation">General Consultation</option>
                      <option value="Partnership">Partnership / Business</option>
                    </optgroup>
                    <optgroup label="Spa & Med-Aesthetics">
                      <option value="Spa Treatment">Spa Treatment (General)</option>
                      <option value="Botox & Fillers">Botox & Fillers</option>
                      <option value="PDO Threads">PDO Threads</option>
                      <option value="Hydra Facial & Skincare">Hydra Facial & Skincare</option>
                      <option value="Body Contouring">Body Contouring & Lipo</option>
                      <option value="Massages">Massages</option>
                    </optgroup>
                    <optgroup label="Beauty Academy">
                      <option value="Beginner Class">Beginner Class Enrollment</option>
                      <option value="Advanced Class">Advanced Class Enrollment</option>
                      <option value="Master Class">Master Class Enrollment</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors resize-none" placeholder="How can we help you today?"></textarea>
                </div>
                
                <button disabled={loading} type="submit" className="w-full bg-primary text-white rounded-full py-4 font-bold text-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1">
                  {loading ? "Submitting..." : "Send Message"}
                </button>
              </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
