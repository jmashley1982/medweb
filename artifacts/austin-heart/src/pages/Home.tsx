import { useGetPageBySlug } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/PublicLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Stethoscope, HeartPulse, Languages, ArrowRight } from "lucide-react";

export function HomePage() {
  const { data: page, isLoading, error } = useGetPageBySlug("home");

  if (isLoading) {
    return (
      <PublicLayout>
        <Skeleton className="w-full h-[500px] rounded-none" />
        <div className="max-w-6xl mx-auto px-4 py-12 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </PublicLayout>
    );
  }

  if (error || !page) {
    return (
      <PublicLayout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <p className="text-muted-foreground">Welcome to Austin Heart & Associates.</p>
        </div>
      </PublicLayout>
    );
  }

  const services = [
    "Preventive Cardiology", "Echocardiography", "Stress Testing",
    "Heart Failure Management", "Cardiac Rehabilitation", "Holter Monitoring",
    "AFib Management", "Nuclear Cardiology", "Second Opinion Consultations"
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      {page.headerImage && (
        <div className="w-full h-[520px] md:h-[600px] overflow-hidden relative">
          <img
            src={page.headerImage}
            alt={page.title}
            className="w-full h-full object-cover object-center"
          />
          {/* stronger gradient on mobile so building logo doesn't bleed through */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40 md:from-primary/85 md:via-primary/50 md:to-transparent" />
          <div className="absolute inset-0 flex items-end md:items-center pb-10 md:pb-0">
            <div className="max-w-6xl mx-auto px-6 sm:px-6 lg:px-8 w-full">
              <div className="max-w-xl text-white space-y-4 md:space-y-6">
                <p className="text-accent-gold font-semibold tracking-widest uppercase text-xs md:text-sm">Austin, Texas</p>
                <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
                  Your Heart, Our Priority.
                </h1>
                <p className="text-base md:text-xl text-white/85 leading-relaxed">
                  Board-certified cardiovascular care with the warmth and accessibility of a neighborhood practice.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <Button size="lg" className="bg-accent-gold hover:bg-accent-gold/90 text-white font-semibold rounded-full px-8 w-full sm:w-auto" asChild>
                    <a href="mailto:jason@fauxmail.com">Request Appointment</a>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary rounded-full px-8 bg-transparent w-full sm:w-auto" asChild>
                    <Link href="/page/team">Meet the Team</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="bg-primary text-white py-10 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            {[
              { stat: "20+", label: "Years of Experience" },
              { stat: "4,000+", label: "Procedures Performed" },
              { stat: "98%", label: "Patient Satisfaction" },
              { stat: "Same-Week", label: "Appointments" },
            ].map(({ stat, label }, i) => (
              <div key={i} className={`px-2 md:px-4 ${i > 0 ? "md:border-l md:border-white/20" : ""}`}>
                <div className="text-2xl md:text-4xl font-serif font-bold text-accent-gold mb-1 md:mb-2">{stat}</div>
                <div className="text-xs md:text-base font-medium text-white/80 leading-snug">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-16 md:py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-primary mb-3 md:mb-4">Why Choose Austin Heart</h2>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">Providing world-class cardiovascular care with a deeply personal touch.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="pt-6 md:pt-8 px-6 md:px-8 pb-6 md:pb-8 text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Stethoscope className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-serif font-bold text-primary mb-3 md:mb-4">A Doctor Who Listens</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  Dr. Gomez is known for sitting down with patients, not standing over them. Every question gets answered before you leave.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="pt-6 md:pt-8 px-6 md:px-8 pb-6 md:pb-8 text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <HeartPulse className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-serif font-bold text-primary mb-3 md:mb-4">Advanced Diagnostics On-Site</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  Echocardiograms, nuclear imaging, stress tests, and Holter monitoring — all performed right here, without referrals elsewhere.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="pt-6 md:pt-8 px-6 md:px-8 pb-6 md:pb-8 text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Languages className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-serif font-bold text-primary mb-3 md:mb-4">Bilingual Care</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  Our entire care team is fluent in English and Spanish, ensuring no detail gets lost in communication.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Services Strip */}
      <div className="py-12 md:py-16 bg-white border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-3">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-primary">Our Services</h2>
            <Link href="/page/services" className="text-accent-gold font-semibold flex items-center gap-2 text-sm md:text-base">
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {services.map((service, idx) => (
              <Link key={idx} href="/page/services">
                <span className="inline-block px-4 py-2 md:px-5 md:py-2.5 bg-background border border-border text-slate-700 rounded-full text-xs md:text-sm font-medium hover:bg-primary hover:text-white transition-colors cursor-pointer">
                  {service}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Meet the Team Teaser */}
      <div className="py-16 md:py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1 space-y-4 md:space-y-6">
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-primary">Meet the Team</h2>
              <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                Our practice is built on a foundation of clinical excellence and profound empathy. From our chief of cardiology to our clinical care coordinators, every member of our team is dedicated to your heart health and overall well-being.
              </p>
              <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-full px-8 w-full sm:w-auto">
                <Link href="/page/team">Get to Know Us</Link>
              </Button>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img
                  src="/api/admin/uploads/magnific_a-highquality-professiona_aQVu1UAfSh.png"
                  alt="Austin Heart & Associates Team"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 md:py-24 bg-[#1a2b4c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 md:space-y-8">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">
            Ready to take care of your heart?
          </h2>
          <p className="text-base md:text-xl text-white/80 font-medium max-w-2xl mx-auto">
            Call us at <span className="text-accent-gold font-bold">(512) 555-0192</span> or email us today. Same-week appointments available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Button size="lg" className="bg-accent-gold hover:bg-accent-gold/90 text-white font-bold rounded-full px-10 text-base md:text-lg" asChild>
              <a href="mailto:jason@fauxmail.com">Email Us</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary rounded-full px-10 bg-transparent text-base md:text-lg" asChild>
              <a href="tel:+15125550192">Call Now</a>
            </Button>
          </div>
        </div>
      </div>

    </PublicLayout>
  );
}
