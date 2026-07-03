import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: testimonials } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false }).limit(3);
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single();

  const heroImage = settings?.hero_image_url || "https://images.unsplash.com/photo-1600334129128-68505d11263a?q=80&w=2070&auto=format&fit=crop";
  const academyImage = settings?.academy_image_url || "https://images.unsplash.com/photo-1552697611-650ce8528994?w=800&auto=format&fit=crop";

  return (
    <>
        {/* Luxury Hero Section */}
        <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40 z-10" />
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${heroImage}")` }}
          />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 flex flex-col items-center justify-center h-full text-center mt-20">
          <FadeIn direction="up">
            <span className="text-secondary font-medium tracking-widest uppercase text-sm md:text-base mb-6 block drop-shadow-md">
              Premium Medical Spa & Beauty Academy
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-xl">
              Elevate Your <br /> <span className="text-secondary">Natural Beauty</span>
            </h1>
          </FadeIn>
          
          <FadeIn direction="up" delay={0.2}>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl font-light drop-shadow-md">
              Experience world-class aesthetic treatments and industry-leading training in a luxurious, state-of-the-art facility.
            </p>
          </FadeIn>
          
          <FadeIn direction="up" delay={0.4} className="flex flex-col sm:flex-row gap-4">
            <Link href="/services" className="bg-secondary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-secondary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              Explore Treatments
            </Link>
            <Link href="/academy" className="bg-white/10 backdrop-blur border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all shadow-lg hover:-translate-y-1">
              Join the Academy
            </Link>
          </FadeIn>
        </div>
        </section>

        {/* Services Overview Section */}
        <section id="services" className="py-24 bg-soft-cream">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-secondary font-medium tracking-widest uppercase text-sm mb-2 block">Our Expertise</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Premium Treatments</h2>
            <div className="w-24 h-1 bg-secondary mx-auto mb-16 rounded-full"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Medical Aesthetics", desc: "Botox, Fillers, PDO Threads & more.", img: "https://images.unsplash.com/photo-1614859324967-bdf4736f87ce?w=500&auto=format&fit=crop" },
                { title: "Spa Treatments", desc: "Hydra facial, Massage, Chemical peels.", img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500&auto=format&fit=crop" },
                { title: "Body Contouring", desc: "Laser lipo, Wood therapy, Vacuum therapy.", img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&auto=format&fit=crop" }
              ].map((service, i) => (
                <div key={i} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100 flex flex-col h-full">
                  <div className="h-64 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10" />
                    <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-8 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-primary mb-3">{service.title}</h3>
                      <p className="text-gray-600 mb-6 font-light">{service.desc}</p>
                    </div>
                    <Link href="/services" className="text-accent font-semibold flex items-center justify-center gap-2 group-hover:text-primary transition-colors mt-auto">
                      Learn More <span className="text-xl">→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-16">
              <Link href="/services" className="inline-block border-2 border-primary text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-colors">
                View All Services
              </Link>
            </div>
          </div>
        </section>

        {/* Beauty Academy Preview */}
        <section id="academy" className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
                  <img src={academyImage} alt="Beauty Academy Training" className="w-full h-auto object-cover aspect-square md:aspect-auto" />
                  <div className="absolute inset-0 bg-primary/20" />
                  <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur p-6 rounded-2xl max-w-xs">
                    <p className="text-primary font-bold text-xl font-serif">Certified Excellence</p>
                    <p className="text-gray-600 text-sm mt-1">Join 500+ successful graduates</p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2">
                <span className="text-secondary font-medium tracking-widest uppercase text-sm mb-2 block">The Academy</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary mb-6 leading-tight">Master the Art of <br/>Medical Aesthetics</h2>
                <p className="text-gray-600 text-lg mb-8 font-light leading-relaxed">
                  Our professional training academy provides hands-on experience and internationally recognized certifications. Whether you are a beginner starting a new career or an advanced practitioner perfecting your craft, our expert instructors will guide you every step of the way.
                </p>
                <div className="space-y-4 mb-8">
                  {["Beginner Classes", "Advanced Masterclasses", "Hands-on Practical Training", "International Certification"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                        ✓
                      </div>
                      <span className="text-gray-800 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
                <Link href="/academy" className="inline-block bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl">
                  Explore Courses
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-primary text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="text-secondary font-medium tracking-widest uppercase text-sm mb-2 block">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-16">What Our Clients Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials && testimonials.length > 0 ? (
                testimonials.map((testimonial: any) => (
                  <div key={testimonial.id} className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[2rem] text-left">
                    <div className="flex items-center gap-2 mb-4 text-secondary text-xl tracking-widest">
                      {'★'.repeat(testimonial.rating || 5)}{'☆'.repeat(5 - (testimonial.rating || 5))}
                    </div>
                    <p className="text-gray-200 mb-6 font-light leading-relaxed">"{testimonial.content}"</p>
                    <div>
                      <p className="font-bold font-serif text-lg">{testimonial.name}</p>
                      <p className="text-secondary text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-300 py-10">
                  No testimonials available yet. Add some in the Admin Dashboard!
                </div>
              )}
            </div>
          </div>
        </section>
    </>
  );
}
