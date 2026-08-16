// ============================================================
// demo-content.ts – the site's content, bundled
// ============================================================
// This is a public sales demo with no backend. What used to live in Postgres
// and be served over /api/pages is defined here instead, so the whole site
// builds to static files.
//
// Array order is nav order: PublicLayout maps this straight into the header,
// with `home` linking to "/" and everything else to "/page/<slug>".

import { asset } from '@/asset';
import { PAGE_SLUGS } from '@/routes';

export interface Page {
  id: number;
  title: string;
  slug: string;
  template: string;
  content?: string | null;
  headerImage?: string | null;
  videoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PageSummary {
  id: number;
  title: string;
  slug: string;
  template: string;
}

export interface AuthStatus {
  authenticated: boolean;
  username?: string | null;
}

export const PageInputTemplate = {
  home: 'home',
  standard: 'standard'
} as const;

export type PageInputTemplate =
  (typeof PageInputTemplate)[keyof typeof PageInputTemplate];

const CREATED = '2003-04-12T09:00:00.000Z';
const UPDATED = '2026-02-18T15:30:00.000Z';

// ids and slugs come from the shared route manifest, which vite.config.ts
// also reads to emit a real index.html per route.
export const DEMO_PAGES: Page[] = [
  {
    id: 1,
    slug: 'home',
    title: 'Home',
    template: 'home',
    headerImage: asset('images/hero-clinic.jpg'),
    videoUrl: null,
    content:
      '<p>Austin Heart &amp; Associates has cared for Central Texas hearts since 2003.</p>',
    createdAt: CREATED,
    updatedAt: UPDATED
  },
  {
    id: 2,
    slug: 'about',
    title: 'About',
    template: 'standard',
    headerImage: asset('images/dr-gomez.jpg'),
    videoUrl: null,
    content: `
<h2>A practice built around the patient</h2>
<p>Dr. Marcos Gomez founded Austin Heart &amp; Associates in 2003 with a simple conviction: cardiology works best when the cardiologist has time to listen. After two decades at Baylor College of Medicine, he wanted to build a practice where patients were known by name rather than by chart number — and where the person explaining your diagnosis is the same person who will perform your procedure.</p>
<p>Twenty years later, that has not changed. We remain a single-location, physician-owned practice. We are not part of a hospital system, and we have deliberately stayed small enough that our care team recognises you when you walk through the door.</p>

<h2>What that means for your care</h2>
<ul>
  <li><strong>Time.</strong> New patient consultations are scheduled for a full hour. Follow-ups are thirty minutes. We do not double-book.</li>
  <li><strong>Continuity.</strong> You see Dr. Gomez or Amanda Torres, PA-C — not whoever is on rotation.</li>
  <li><strong>Everything on site.</strong> Echocardiography, nuclear imaging, stress testing and Holter monitoring are all performed in our building, usually the same week they are ordered.</li>
  <li><strong>Answers you can act on.</strong> We call with results. You will not be left refreshing a patient portal.</li>
</ul>

<h2>Credentials</h2>
<p>Dr. Gomez earned his M.D. at UT Southwestern and is board certified by the American Board of Internal Medicine in both Cardiovascular Disease and Nuclear Cardiology. He is a Fellow of the American College of Cardiology and of the Texas Heart Association, has performed over 4,000 interventional procedures, and has been named a <em>Top Doctor</em> by Austin Monthly for six consecutive years.</p>

<h2>Bilingual care</h2>
<p>Our entire clinical team is fluent in English and Spanish. Nothing about your heart should get lost in translation.</p>
`.trim(),
    createdAt: CREATED,
    updatedAt: UPDATED
  },
  {
    id: 3,
    slug: 'services',
    title: 'Services',
    template: 'standard',
    headerImage: asset('images/clinic-interior.jpg'),
    videoUrl: null,
    content: `
<h2>Comprehensive cardiovascular care, under one roof</h2>
<p>Nearly every test we order can be performed in our own building, most of them within a week. That means fewer referrals, fewer waiting rooms, and a diagnosis that arrives while it is still useful.</p>

<h2>Diagnostic services</h2>
<ul>
  <li><strong>Echocardiography</strong> — ultrasound imaging of the heart's chambers, valves and pumping function. Painless, about forty minutes, results the same day.</li>
  <li><strong>Stress testing</strong> — treadmill and pharmacologic stress studies to reveal how your heart behaves under exertion.</li>
  <li><strong>Nuclear cardiology</strong> — myocardial perfusion imaging to map blood flow through the heart muscle and identify blockages.</li>
  <li><strong>Holter and event monitoring</strong> — 24-hour to 30-day ambulatory rhythm recording to catch intermittent arrhythmias.</li>
  <li><strong>Vascular ultrasound</strong> — carotid, peripheral arterial and venous studies.</li>
</ul>

<h2>Ongoing management</h2>
<ul>
  <li><strong>Preventive cardiology</strong> — lipid management, blood pressure control, and individualised risk reduction for patients with a family history.</li>
  <li><strong>Heart failure management</strong> — medication optimisation, fluid monitoring and close follow-up to keep you out of the hospital.</li>
  <li><strong>Atrial fibrillation management</strong> — rate and rhythm strategy, anticoagulation, and coordination with electrophysiology when ablation is warranted.</li>
  <li><strong>Cardiac rehabilitation</strong> — a structured twelve-week supervised recovery programme led by James Redhorse, RN, for patients after a heart attack, bypass surgery or other major cardiac event.</li>
  <li><strong>Second opinion consultations</strong> — a thorough, unhurried review of your records and imaging before you commit to a procedure.</li>
</ul>

<h2>Insurance and scheduling</h2>
<p>We accept most major insurance plans, including Medicare. Same-week appointments are usually available, and urgent consultations are often accommodated within forty-eight hours. Call <strong>(512) 555-0192</strong> and our team will verify your coverage before your first visit so there are no surprises.</p>
`.trim(),
    createdAt: CREATED,
    updatedAt: UPDATED
  },
  {
    id: 4,
    slug: 'team',
    title: 'Our Team',
    template: 'standard',
    headerImage: asset('images/team-group.jpg'),
    videoUrl: null,
    content: `
<p>Our care team combines decades of cardiac nursing, rehabilitation and physician-assistant experience. Meet the people who will look after you — from your first phone call through your last follow-up.</p>
`.trim(),
    createdAt: CREATED,
    updatedAt: UPDATED
  },
  {
    id: 5,
    slug: 'patient-info',
    title: 'Patient Info',
    template: 'standard',
    headerImage: asset('images/reception.jpg'),
    videoUrl: null,
    content: `
<h2>Your first visit</h2>
<p>Plan on about ninety minutes. That covers check-in, a full hour with Dr. Gomez, and any same-day testing he orders. Arriving fifteen minutes early gives our front desk time to complete your paperwork without eating into your appointment.</p>

<h2>What to bring</h2>
<ul>
  <li>Photo ID and your insurance card</li>
  <li>A complete list of current medications, including doses and any supplements</li>
  <li>Records, EKGs or imaging from previous cardiologists, if you have them</li>
  <li>Your referral, if your plan requires one</li>
  <li>A written list of your questions — genuinely, patients who bring one get more out of the visit</li>
</ul>

<h2>Preparing for common tests</h2>
<ul>
  <li><strong>Echocardiogram</strong> — no preparation needed. Eat and take medications as usual.</li>
  <li><strong>Stress test</strong> — no food or caffeine for four hours beforehand. Wear comfortable shoes and clothes you can walk in. Ask us which medications to hold.</li>
  <li><strong>Nuclear imaging</strong> — no caffeine for twenty-four hours, including decaf and chocolate. Allow three hours for the full study.</li>
  <li><strong>Holter monitor</strong> — shower before your appointment; the electrodes stay on until the recording period ends.</li>
</ul>

<h2>Insurance and billing</h2>
<p>We accept most major insurance plans, including Medicare and most Medicare Advantage products. We verify your benefits before your first appointment and will tell you what to expect out of pocket. If cost is a concern, ask — we offer payment plans and would rather arrange one than have you skip care.</p>

<h2>Prescription refills</h2>
<p>Call your pharmacy first; they will send the request to us electronically. Allow two business days. Refills are not issued outside office hours.</p>

<h2>When to seek emergency care</h2>
<p>Call 911 immediately for chest pain or pressure lasting more than a few minutes, shortness of breath at rest, fainting, or sudden weakness or difficulty speaking. Do not call the office and do not drive yourself.</p>

<h2>Office hours</h2>
<p>Monday to Friday, 8:00am to 5:00pm. Our answering service reaches the on-call physician after hours for urgent clinical questions.</p>
`.trim(),
    createdAt: CREATED,
    updatedAt: UPDATED
  },
  {
    id: 6,
    slug: 'contact',
    title: 'Contact',
    template: 'standard',
    headerImage: asset('images/reception.jpg'),
    videoUrl: null,
    content: `
<h2>Get in touch</h2>
<p>Whether you are scheduling a first consultation, following up on results, or asking an insurance question, our front desk is here Monday to Friday, 8:00am to 5:00pm.</p>

<h2>Practice details</h2>
<ul>
  <li><strong>Phone:</strong> <a href="tel:+15125550192">(512) 555-0192</a></li>
  <li><strong>Fax:</strong> (512) 555-0193</li>
  <li><strong>Email:</strong> <a href="mailto:jason@fauxmail.com">jason@fauxmail.com</a></li>
  <li><strong>Address:</strong> 1234 Healing Way, Suite 300, Austin, TX 78705</li>
  <li><strong>Hours:</strong> Monday&ndash;Friday, 8:00am&ndash;5:00pm</li>
</ul>

<h2>Parking and access</h2>
<p>Free surface parking is available directly in front of the building, with accessible spaces beside the covered main entrance. Suite 300 is on the third floor; lifts are just inside the lobby. The clinic is a short walk from the Dean Keeton and Red River bus stops.</p>

<h2>New patients</h2>
<p>We are accepting new patients and can usually offer an appointment within the same week. Most major insurance plans, including Medicare, are accepted, and we will verify your benefits before you arrive.</p>

<h2>Urgent symptoms</h2>
<p>If you are experiencing chest pain, severe shortness of breath, fainting or symptoms of a stroke, call 911 immediately rather than contacting the office.</p>
`.trim(),
    createdAt: CREATED,
    updatedAt: UPDATED
  }
];

// Fail loudly at build/dev time if the content and the route manifest diverge —
// a mismatch would silently ship a page with no static shell behind it.
if (
  DEMO_PAGES.length !== PAGE_SLUGS.length ||
  DEMO_PAGES.some((p, i) => p.slug !== PAGE_SLUGS[i] || p.id !== i + 1)
) {
  throw new Error(
    'demo-content.ts and routes.ts disagree: every page must match PAGE_SLUGS ' +
      'in order, with 1-based ids.'
  );
}
