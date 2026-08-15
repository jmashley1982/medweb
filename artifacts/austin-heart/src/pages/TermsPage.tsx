import { PublicLayout } from "@/components/PublicLayout";

export function TermsPage() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-8">Terms of Use</h1>

        <div className="prose prose-lg max-w-none text-slate-600 space-y-6">
          <p>
            Welcome to the website of Austin Heart & Associates. These Terms of Use govern your access to and use of our website. By visiting this site, you agree to these terms in full.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8">1. Medical Disclaimer</h2>
          <p>
            The information on this website is provided for general educational purposes only and is not intended as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this website.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8">2. Emergency Medical Situations</h2>
          <p>
            If you think you may have a medical emergency, call 911 immediately or go to your nearest emergency room. This website does not offer emergency medical services.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8">3. Intellectual Property</h2>
          <p>
            All content on this website, including text, images, logos, and design elements, is the property of Austin Heart & Associates and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works from any content without our prior written consent.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8">4. Limitation of Liability</h2>
          <p>
            Austin Heart & Associates shall not be liable for any damages arising from your use of this website, including but not limited to direct, indirect, incidental, or consequential damages. This website is provided "as is" without any warranties of any kind, express or implied.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8">5. Contact</h2>
          <p>
            If you have any questions about these Terms of Use, please contact us at <a href="mailto:jason@fauxmail.com" className="text-primary underline">jason@fauxmail.com</a> or call (512) 555-0192.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
