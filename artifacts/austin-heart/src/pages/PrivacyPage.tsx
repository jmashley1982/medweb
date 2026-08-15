import { PublicLayout } from "@/components/PublicLayout";

export function PrivacyPage() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-8">Privacy Policy</h1>

        <div className="prose prose-lg max-w-none text-slate-600 space-y-6">
          <p>
            At Austin Heart & Associates, your privacy is important to us. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8">1. Information We Collect</h2>
          <p>
            We do not collect personal information from visitors unless you voluntarily provide it through email or phone contact. If you reach out to us, we may collect your name, email address, phone number, and any message you provide.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8">2. How We Use Your Information</h2>
          <p>
            Any information you provide is used solely to respond to your inquiries and coordinate your care. We do not sell, rent, or share your personal information with third parties for marketing purposes.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8">3. Health Information</h2>
          <p>
            This website does not transmit or store protected health information (PHI). If you need to share medical details, please schedule an appointment or contact us directly by phone. We follow HIPAA guidelines to protect your health information in our clinical practice.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8">4. Cookies and Analytics</h2>
          <p>
            We may use basic analytics tools to understand how visitors use our website, which helps us improve our services. These tools do not identify you personally.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8">5. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8">6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:jason@fauxmail.com" className="text-primary underline">jason@fauxmail.com</a> or call (512) 555-0192.
          </p>

          <p className="text-sm text-slate-400 pt-4">Last updated: June 2026</p>
        </div>
      </div>
    </PublicLayout>
  );
}
