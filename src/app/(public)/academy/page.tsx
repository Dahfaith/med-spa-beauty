import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AcademyPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase.from("courses").select("*").order("created_at", { ascending: true });

  return (
    <div className="flex flex-col min-h-screen bg-soft-cream pt-20">
      {/* Hero Section */}
      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <span className="text-secondary font-medium tracking-widest uppercase text-sm mb-4 block">Professional Training</span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 drop-shadow-lg">Beauty Academy</h1>
          <p className="text-xl font-light text-gray-200 leading-relaxed">
            Elevate your career with hands-on, internationally recognized aesthetic training.
          </p>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="space-y-24">
            
            {!courses || courses.length === 0 ? (
              <div className="text-center py-20 text-gray-500 text-lg">
                No courses are currently open for enrollment. Please check back later.
              </div>
            ) : null}

            {courses?.map((course: any, index: number) => (
              <div key={course.id} className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                
                {/* Course Image */}
                <div className="lg:w-1/2 w-full">
                  <div className="relative rounded-[2rem] overflow-hidden shadow-xl aspect-[4/3] group bg-gray-200">
                    {course.image_url ? (
                      <img src={course.image_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
                    )}
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg">
                      <span className="font-bold text-primary font-serif">{course.level}</span>
                    </div>
                  </div>
                </div>

                {/* Course Details */}
                <div className="lg:w-1/2 w-full">
                  <h2 className="text-4xl font-serif font-bold text-primary mb-4">{course.title}</h2>
                  <p className="text-lg text-gray-600 mb-8 font-light leading-relaxed">{course.description}</p>
                  
                  <div className="grid grid-cols-2 gap-6 mb-8 border-y border-gray-200 py-6">
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Duration</p>
                      <p className="font-bold text-gray-900 text-lg">{course.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Tuition Fee</p>
                      <p className="font-bold text-secondary text-lg">{course.fee}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Certification</p>
                      <p className="font-medium text-gray-800">{course.certification || 'Yes'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Accommodation</p>
                      <p className="font-medium text-gray-800">{course.accommodation || 'Not Included'}</p>
                    </div>
                  </div>

                  {course.modules && course.modules.length > 0 && (
                    <div className="mb-8">
                      <p className="text-sm text-gray-500 uppercase tracking-wider mb-3">Curriculum</p>
                      <div className="flex flex-wrap gap-2">
                        {course.modules.map((mod: string, i: number) => (
                          <span key={i} className="bg-primary/5 text-primary text-xs font-medium px-3 py-1.5 rounded-full border border-primary/10">
                            {mod}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {course.benefits && (
                    <div className="mb-8 bg-secondary/10 border border-secondary/20 rounded-xl p-4 flex items-start gap-4">
                      <div className="bg-secondary text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold">🎁</div>
                      <div>
                        <p className="font-bold text-secondary mb-1">Special Bonus</p>
                        <p className="text-gray-700 text-sm leading-snug">{course.benefits}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href={`https://wa.me/2349153489582?text=${encodeURIComponent(`Hello, I am interested in enrolling in the ${course.title} course.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-xl flex-1"
                    >
                      Enroll Now
                    </a>
                    <Link href="/gallery" className="text-center bg-white text-primary border border-primary/20 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all shadow-sm flex-1">
                      View Gallery
                    </Link>
                  </div>
                  
                  {course.requirements && (
                    <p className="mt-4 text-sm text-gray-500 font-light">
                      * {course.requirements}
                    </p>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
