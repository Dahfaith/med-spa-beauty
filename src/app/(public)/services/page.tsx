import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data: services } = await supabase.from("services").select("*").order("created_at", { ascending: false });

  // Group services by category
  const categoriesMap = new Map();
  if (services) {
    services.forEach(service => {
      if (!categoriesMap.has(service.category)) {
        categoriesMap.set(service.category, []);
      }
      categoriesMap.get(service.category).push(service);
    });
  }

  // Pre-define category descriptions for the UI
  const categoryDescriptions: Record<string, string> = {
    "Medical Aesthetics": "Advanced non-surgical treatments for youthful, radiant skin.",
    "Spa Treatments": "Luxurious relaxation and deep skin care therapies.",
    "Body Contouring": "Sculpt and redefine your body shape without surgery."
  };

  return (
    <div className="flex flex-col min-h-screen bg-soft-cream pt-20">
      {/* Hero Section */}
      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 drop-shadow-lg">Premium Services</h1>
          <p className="text-xl font-light text-gray-200 leading-relaxed">
            Discover our comprehensive range of luxury spa treatments and advanced medical aesthetic procedures.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          
          {categoriesMap.size === 0 && (
            <div className="text-center py-20 text-gray-500 text-lg">
              No services currently available. Please check back later.
            </div>
          )}

          {Array.from(categoriesMap.entries()).map(([category, items], index) => (
            <div key={index} className="mb-24 last:mb-0">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-serif font-bold text-primary mb-4">{category}</h2>
                <p className="text-gray-600 text-lg">{categoryDescriptions[category] || "Premium treatments tailored for you."}</p>
                <div className="w-24 h-1 bg-secondary mx-auto mt-6 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((service: any) => (
                  <div key={service.id} className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group overflow-hidden relative">
                    
                    {service.image_url && (
                      <div className="absolute top-0 left-0 w-full h-48 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                        <img src={service.image_url} alt={service.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
                      </div>
                    )}

                    <div className="flex-grow relative z-10 pt-4">
                      <h3 className="text-2xl font-serif font-bold text-primary mb-3">{service.title}</h3>
                      <p className="text-gray-600 font-light mb-6">{service.description}</p>
                      
                      <div className="space-y-2 mb-8">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Duration:</span>
                          <span className="font-medium text-gray-800">{service.duration || 'Varies'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Recovery:</span>
                          <span className="font-medium text-gray-800">{service.recovery_time || 'None'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <a 
                      href={`https://wa.me/2349153489582?text=${encodeURIComponent(`Hello, I am interested in booking an appointment for the ${service.title} treatment.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center relative z-10 w-full bg-primary/5 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white px-6 py-3 rounded-full font-semibold transition-all"
                    >
                      Book Appointment
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-24 bg-primary text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-serif font-bold mb-6">Unsure what you need?</h2>
          <p className="text-xl font-light text-gray-200 mb-10 leading-relaxed">
            Book a consultation with our lead aesthetic physician to discuss your goals and create a personalized treatment plan.
          </p>
          <Link href="/contact" className="inline-block bg-secondary text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-secondary/90 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            Book a Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
