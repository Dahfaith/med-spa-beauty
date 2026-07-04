"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateTimeSlots, getEstimatedDuration, BookedSlot } from "@/lib/scheduling";

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
    message: "",
    booking_date: "",
    booking_time: ""
  });

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isAcademy, setIsAcademy] = useState(false);

  useEffect(() => {
    // Academy classes don't need strict calendar slots
    if (formData.service_type.includes("Class") || formData.service_type.includes("Partnership")) {
      setIsAcademy(true);
      setFormData(prev => ({...prev, booking_date: "", booking_time: ""}));
      return;
    }
    
    setIsAcademy(false);

    if (!formData.booking_date) {
      setAvailableSlots([]);
      return;
    }

    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      setFormData(prev => ({...prev, booking_time: ""})); // reset time when date changes

      const duration = getEstimatedDuration(formData.service_type);
      
      const { data, error } = await supabase.rpc('get_booked_slots', { 
        target_date: formData.booking_date 
      });

      if (error) {
        console.error("Error fetching slots:", error);
        setAvailableSlots([]);
      } else {
        const [year, month, day] = formData.booking_date.split('-');
        const dateObj = new Date(parseInt(year), parseInt(month)-1, parseInt(day));
        
        const slots = generateTimeSlots(dateObj, duration, data as BookedSlot[]);
        setAvailableSlots(slots);
      }
      setIsLoadingSlots(false);
    };

    fetchSlots();
  }, [formData.booking_date, formData.service_type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const submitData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      service_type: formData.service_type,
      message: formData.message,
      duration_minutes: isAcademy ? null : getEstimatedDuration(formData.service_type),
      booking_date: formData.booking_date || null,
      booking_time: formData.booking_time || null
    };

    const { error } = await supabase.from("bookings").insert([submitData]);

    if (!error) {
      setSuccess(true);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        service_type: "General Consultation",
        message: "",
        booking_date: "",
        booking_time: ""
      });
    } else {
      alert("Error submitting form. Please try again.");
    }
    
    setLoading(false);
  };

  // Helper to format 24h to 12h for the dropdown
  const formatTime12h = (time24: string) => {
    const [h, m] = time24.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  // Get tomorrow's date as YYYY-MM-DD for the date picker minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

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
                  <h3 className="text-3xl font-serif font-bold text-primary mb-4">Booking Received!</h3>
                  <p className="text-gray-600 text-lg mb-8">
                    Thank you! Your requested time slot has been reserved. A member of our team will contact you shortly to confirm.
                  </p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
                  >
                    Make Another Booking
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
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

                {!isAcademy && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                      <input 
                        required={!isAcademy}
                        type="date" 
                        min={minDate} 
                        value={formData.booking_date} 
                        onChange={e => {
                          const date = new Date(e.target.value);
                          if (date.getDay() === 0) {
                            alert("Sorry, we are closed on Sundays. Please select another day.");
                            return;
                          }
                          setFormData({...formData, booking_date: e.target.value});
                        }} 
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Available Time</label>
                      <select 
                        required={!isAcademy}
                        disabled={!formData.booking_date || isLoadingSlots || availableSlots.length === 0}
                        value={formData.booking_time} 
                        onChange={e => setFormData({...formData, booking_time: e.target.value})} 
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors disabled:opacity-50 disabled:bg-gray-100"
                      >
                        <option value="">
                          {isLoadingSlots ? "Loading slots..." : 
                           !formData.booking_date ? "Select date first" : 
                           availableSlots.length === 0 ? "Fully booked" : "Select time"}
                        </option>
                        {availableSlots.map(slot => (
                          <option key={slot} value={slot}>
                            {formatTime12h(slot)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors resize-none" placeholder="Any special requests?"></textarea>
                </div>
                
                <button disabled={loading} type="submit" className="w-full bg-primary text-white rounded-full py-4 font-bold text-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1">
                  {loading ? "Processing..." : isAcademy ? "Send Message" : "Confirm Booking"}
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
