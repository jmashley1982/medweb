import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useListPages } from "@/demo-api";
import { Menu, X } from "lucide-react";
import { asset } from "@/asset";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { data: pages } = useListPages();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = pages?.map((page) => ({
    href: page.slug === "home" ? "/" : `/page/${page.slug}`,
    label: page.title,
    id: page.id,
  })) ?? [];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground font-sans">
      <div className="h-1 w-full bg-accent-gold" />
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 md:h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 shrink-0" onClick={() => setMobileOpen(false)}>
            <img
              src={asset("logo.png")}
              alt="Austin Heart & Associates"
              className="h-12 md:h-16 w-auto"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-primary font-serif font-bold text-lg md:text-xl tracking-tight">Austin Heart</span>
              <span className="text-slate-500 text-xs md:text-sm font-medium tracking-wide">& Associates</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-8 h-full">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`text-sm font-medium transition-colors h-full flex items-center border-b-2 ${
                    isActive ? "text-primary border-primary font-semibold" : "text-slate-600 border-transparent hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-slate-600 hover:text-primary hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-white shadow-lg">
            <nav className="flex flex-col py-2">
              {navItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-6 py-4 text-base font-medium border-l-4 transition-colors ${
                      isActive
                        ? "text-primary border-primary bg-primary/5 font-semibold"
                        : "text-slate-600 border-transparent hover:text-primary hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="px-6 py-4 border-t border-border mt-2">
                <a
                  href="tel:+15125550192"
                  className="block text-sm text-slate-500"
                  onClick={() => setMobileOpen(false)}
                >
                  📞 (512) 555-0192
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-primary text-white pt-12 md:pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-10 md:mb-12">
            <div className="space-y-3">
              <img src={asset("logo.png")} alt="Austin Heart & Associates" className="h-10 md:h-12 w-auto brightness-0 invert" />
              <p className="text-primary-foreground/80 font-serif text-base md:text-lg leading-relaxed max-w-xs">
                Compassionate Cardiovascular Care Since 2003
              </p>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-serif font-semibold mb-4 md:mb-6">Quick Links</h3>
              <ul className="space-y-2 md:space-y-3 text-primary-foreground/80 text-sm md:text-base">
                <li><Link href="/" className="hover:text-accent-gold transition-colors">Home</Link></li>
                <li><Link href="/page/about" className="hover:text-accent-gold transition-colors">About Dr. Gomez</Link></li>
                <li><Link href="/page/services" className="hover:text-accent-gold transition-colors">Our Services</Link></li>
                <li><Link href="/page/team" className="hover:text-accent-gold transition-colors">Our Team</Link></li>
                <li><Link href="/page/contact" className="hover:text-accent-gold transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-serif font-semibold mb-4 md:mb-6">Contact Us</h3>
              <ul className="space-y-2 md:space-y-3 text-primary-foreground/80 text-sm md:text-base">
                <li><a href="tel:+15125550192" className="hover:text-accent-gold transition-colors">Phone: (512) 555-0192</a></li>
                <li>Email: <a href="mailto:jason@fauxmail.com" className="hover:text-accent-gold transition-colors">jason@fauxmail.com</a></li>
                <li className="pt-1 leading-relaxed">
                  1234 Healing Way, Suite 300<br />
                  Austin, TX 78705
                </li>
                <li className="pt-1 text-xs md:text-sm">Hours: Mon–Fri 8am–5pm</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-6 md:pt-8 text-center">
            <p className="text-xs md:text-sm text-primary-foreground/60 mb-3">
              &copy; 2026 Austin Heart & Associates. All rights reserved.
            </p>
            <div className="flex justify-center gap-4 text-xs text-primary-foreground/50">
              <Link href="/terms" className="hover:text-accent-gold transition-colors">Terms of Use</Link>
              <Link href="/privacy" className="hover:text-accent-gold transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
