import { PublicLayout } from "@/components/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function TeamPage() {
  const staff = [
    {
      name: "Mei Lin Chen, RN, BSN",
      title: "Lead Cardiac Nurse",
      photo: "/api/admin/uploads/magnific_a-professional-headshot-o_nTOcNBmYQD.png",
      bio: "Mei Lin joined the practice in 2011 after six years in the cardiac ICU at St. David's Medical Center. She leads patient education and coordinates all pre- and post-procedure care. Patients consistently describe her as \"the one who actually explains what's happening.\" She holds certification in Cardiac-Vascular Nursing (RN-BC) and is pursuing her Nurse Practitioner degree at UT Austin.",
      credentials: ["RN, BSN", "RN-BC (Cardiac-Vascular Nursing)", "BLS/ACLS Certified"],
    },
    {
      name: "Sarah Johnson, RN",
      title: "Clinical Care Coordinator",
      photo: "/api/admin/uploads/magnific_a-professional-headshot-o_l7uUb0Zgv9.png",
      bio: "Sarah is the operational backbone of Austin Heart & Associates. She manages referrals, coordinates specialist consultations, and ensures every patient's journey through our clinic is seamless. With a background in both medical-surgical and cardiac stepdown nursing, she brings broad clinical insight to her coordination role. Outside of work, she is a trail runner and volunteers with Austin Pets Alive.",
      credentials: ["RN, BSN", "Certified Case Manager (CCM)", "BLS/ACLS Certified"],
    },
    {
      name: "Amanda Torres, PA-C",
      title: "Physician Assistant",
      photo: "/api/admin/uploads/magnific_a-professional-headshot-o_jSflF8JLD0.png",
      bio: "Amanda came to Austin Heart & Associates from a cardiothoracic surgery program at Texas Children's Hospital, where she assisted in over 300 open-heart procedures. As our PA-C, she handles initial patient assessments, manages chronic disease follow-ups, and partners closely with Dr. Gomez on complex cases. Patients love her directness and her follow-through. She is also a certified yoga instructor and leads a free community class every Saturday morning.",
      credentials: ["PA-C", "MPAS, Baylor College of Medicine", "NCCPA Certified", "BLS/ACLS Certified"],
    },
    {
      name: "James Redhorse, RN",
      title: "Cardiac Rehabilitation Specialist",
      photo: "/api/admin/uploads/magnific_a-professional-headshot-o_YVy0NYYWeC.png",
      bio: "James leads our cardiac rehabilitation program — a structured 12-week recovery and conditioning protocol for patients following heart attacks, bypass surgery, or other major cardiac events. He designed the program from the ground up using evidence-based protocols from the American Association of Cardiovascular and Pulmonary Rehabilitation. A former Division I athlete, James brings a coach's mindset to recovery. He also speaks conversational Diné Bizaad (Navajo) and is an advocate for Indigenous heart health equity.",
      credentials: ["RN, BSN", "AACVPR Certified", "Exercise Physiologist", "BLS/ACLS Certified"],
    }
  ];

  return (
    <PublicLayout>
      <div className="w-full h-[500px] overflow-hidden relative">
        <img
          src="/api/admin/uploads/magnific_a-highquality-professiona_aQVu1UAfSh.png"
          alt="Our Team"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 shadow-sm">
            The People Behind Your Care
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl font-medium">
            A dedicated team of cardiovascular specialists committed to providing compassionate, comprehensive care for you and your family.
          </p>
        </div>
      </div>

      <div className="bg-white py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-xl overflow-hidden rounded-2xl bg-background/50">
            <div className="grid md:grid-cols-5 gap-0">
              <div className="md:col-span-2 relative aspect-[4/5] md:aspect-auto">
                <img 
                  src="/api/admin/uploads/magnific_an-older-hispanic-doctors_LUCgFa1swO.png" 
                  alt="Dr. Marcos Gomez" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
                <div className="mb-6">
                  <h2 className="text-3xl font-serif font-bold text-primary mb-2">Dr. Marcos Gomez, M.D.</h2>
                  <p className="text-lg font-medium text-accent-gold">Founder & Chief of Cardiology</p>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10">M.D., UT Southwestern</Badge>
                  <Badge variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10">FACC</Badge>
                  <Badge variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10">Board Certified Cardiovascular Disease (ABIM)</Badge>
                  <Badge variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10">Board Certified Nuclear Cardiology</Badge>
                  <Badge variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10">Fellow, Texas Heart Association</Badge>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Dr. Gomez founded Austin Heart & Associates in 2003 after two decades at Baylor College of Medicine. Board-certified in Cardiovascular Disease and Nuclear Cardiology, he is known throughout Central Texas for his diagnostic precision and his rare ability to put even the most anxious patients at ease. He has performed over 4,000 interventional procedures and was named Austin Monthly's "Top Doctor" six years running. When not in the clinic, he cycles the Barton Creek Greenbelt, grows heirloom tomatoes, and cheers on his four grandchildren at Little League.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="bg-primary py-16 md:py-24 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-accent-gold text-sm font-bold tracking-widest uppercase mb-6">Our Philosophy</h2>
          <p className="text-2xl md:text-4xl font-serif leading-snug">
            "We believe the best cardiology is built on trust. We take time. We listen. We explain. And we call you back."
          </p>
        </div>
      </div>

      <div className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {staff.map((person, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="aspect-square rounded-2xl overflow-hidden mb-6 shadow-md border-4 border-white">
                <img src={person.photo} alt={person.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-in-out" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-1">{person.name}</h3>
              <p className="text-md font-medium text-accent-gold mb-4">{person.title}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {person.credentials.map((cred, i) => (
                  <Badge key={i} variant="outline" className="text-xs text-slate-500 border-slate-200">{cred}</Badge>
                ))}
              </div>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                {person.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
