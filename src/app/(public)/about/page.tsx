import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import { createClient } from "@/lib/supabase/server";

export default async function AboutPage() {
  const supabase = await createClient();
  const { data: team } = await supabase.from("team_members").select("*").order("created_at", { ascending: true });

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1600334129128-68505d11263a?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl pt-10">
          <span className="text-secondary font-medium tracking-widest uppercase text-sm mb-4 block">Our Story</span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 drop-shadow-lg">About Med Spa</h1>
          <p className="text-xl font-light text-gray-200 leading-relaxed">
            Redefining luxury aesthetics and professional beauty training in Nigeria.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square">
                <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80" alt="Spa Interior" className="w-full h-full object-cover" />
              </div>
            </FadeIn>
            <FadeIn direction="left">
              <h2 className="text-4xl font-serif font-bold text-primary mb-6">Our Philosophy</h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed font-light">
                At Med Spa & Beauty Arena, we believe that true beauty stems from confidence. Our mission is to provide world-class aesthetic treatments that enhance your natural features, using the latest non-invasive technologies in a luxurious, relaxing environment.
              </p>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed font-light">
                Beyond our spa services, our Beauty Academy is dedicated to empowering the next generation of aesthetic professionals with comprehensive, hands-on training that meets international standards.
              </p>
              <div className="grid grid-cols-2 gap-8 border-t border-gray-100 pt-8">
                <div>
                  <h4 className="text-3xl font-serif font-bold text-secondary mb-2">15+</h4>
                  <p className="text-sm text-gray-500 uppercase tracking-widest font-medium">Years Experience</p>
                </div>
                <div>
                  <h4 className="text-3xl font-serif font-bold text-secondary mb-2">500+</h4>
                  <p className="text-sm text-gray-500 uppercase tracking-widest font-medium">Academy Graduates</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Meet Our Experts - Fixed Grid Layout */}
      <section className="py-24 bg-soft-cream">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">Meet Our Experts</h2>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full"></div>
            <p className="mt-6 text-gray-600 max-w-2xl mx-auto font-light text-lg">
              Our team of board-certified physicians and master estheticians are dedicated to providing you with the highest standard of care.
            </p>
          </div>

          {!team || team.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Team members will appear here once added in the admin dashboard.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {team.map((member: any) => (
                <FadeIn key={member.id} direction="up" className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col">
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img 
                      src={member.image_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80'} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 text-center flex-grow flex flex-col">
                    <h3 className="text-2xl font-serif font-bold text-primary mb-1">{member.name}</h3>
                    <p className="text-secondary text-sm font-medium tracking-widest uppercase mb-4">{member.role}</p>
                    <p className="text-gray-600 font-light text-sm flex-grow">
                      {member.bio}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
