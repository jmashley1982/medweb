// ============================================================
// seed-data.js – Default page content for South Texas Vascular Experts
// ============================================================
// Single source of truth for the site's starting content. Used by:
//   * app.js          – seeds the SQLite database on first run
//   * build-static.mjs – renders the static demo build
//
// `content` is stored in the database as a JSON string; it is kept as a
// plain object here so both consumers can work with it directly.

const pages = [
  {
    slug: 'home',
    title: 'Home',
    content: {
      header: 'Expert Vascular Care You Can Trust',
      heroSubtitle: 'Serving San Antonio and South Texas with compassionate, minimally invasive vascular treatments for over 20 years.',
      body: 'Dr. Edwardo Gutierrez and his dedicated team provide comprehensive, compassionate vascular care for the entire family. We specialize in the diagnosis and treatment of circulatory diseases, using the latest minimally invasive techniques to ensure the best outcomes for our patients.\n\nAs a leading vascular surgery practice in San Antonio, we accept most major insurance plans and offer flexible scheduling to fit your life. New patient appointments are typically available within one week.',
      image: '/uploads/clinic-building.png',
      video: ''
    }
  },
  {
    slug: 'about',
    title: 'About',
    content: {
      header: 'About Dr. Edwardo Gutierrez, M.D.',
      heroSubtitle: 'Board-certified vascular surgeon with over two decades of surgical excellence.',
      body: 'Dr. Gutierrez is a board-certified vascular surgeon with over 20 years of experience in treating arterial and venous disorders. He earned his medical degree from the University of Texas Health Science Center and completed his residency at Baylor College of Medicine, followed by a vascular surgery fellowship at the renowned Mayo Clinic.\n\nDr. Gutierrez is committed to patient-centered care, combining clinical excellence with a warm, approachable manner. He is an active member of the Society for Vascular Surgery, the American College of Surgeons, and serves on the medical advisory board for two regional hospitals in San Antonio.\n\nOutside of medicine, Dr. Gutierrez is a passionate advocate for health literacy in underserved South Texas communities, regularly participating in free screening events and health education initiatives.',
      image: '/uploads/dr-gutierrez.png',
      video: ''
    }
  },
  {
    slug: 'services',
    title: 'Services',
    content: {
      header: 'Comprehensive Vascular Services',
      heroSubtitle: 'From diagnosis to recovery, we offer a full spectrum of vascular treatments tailored to you.',
      body: 'Every patient is unique, which is why every treatment plan at South Texas Vascular Experts is built around your specific condition, lifestyle, and goals. We use the latest minimally invasive approaches whenever possible, meaning smaller incisions, faster recovery, and better outcomes.',
      image: '/uploads/clinic-aerial.png',
      video: ''
    }
  },
  {
    slug: 'patient-resources',
    title: 'Patient Resources',
    content: {
      header: 'Patient Resources & Information',
      heroSubtitle: 'Everything you need to prepare for your visit and understand your care.',
      body: 'We believe informed patients make better health decisions. Browse our resources below, or call our office if you have questions. Our team is always happy to walk you through what to expect before, during, and after any procedure.',
      image: '/uploads/clinic-building.png',
      video: ''
    }
  },
  {
    slug: 'staff',
    title: 'Staff',
    content: {
      header: 'Meet Our Team',
      heroSubtitle: 'Skilled, caring professionals dedicated to your vascular health.',
      body: 'At South Texas Vascular Experts, you are never just a chart number. From your first appointment to your last follow-up, our team is committed to making every visit comfortable, clear, and compassionate.',
      image: '/uploads/clinic-aerial.png',
      video: '',
      staff: [
        {
          name: 'Dr. Edwardo Gutierrez, M.D.',
          role: 'Medical Director, M.D. – Board-Certified Vascular Surgeon',
          photo: '/uploads/dr-gutierrez.png',
          bio: 'With over 20 years of vascular surgery experience, Dr. Gutierrez leads our practice with a dedication to evidence-based, patient-first care. A UT Health alumnus and Mayo Clinic fellowship graduate, he is widely respected across South Texas.'
        },
        {
          name: 'Sarah Reid, RN',
          role: 'Head Nurse – Vascular Care',
          photo: '/uploads/staff-nurse-1.png',
          bio: 'Sarah brings 15 years of vascular nursing experience to every patient interaction. She coordinates care across our clinical team and is the first friendly face most patients see.'
        },
        {
          name: 'Linda Vasquez, RN',
          role: 'Surgical Nurse',
          photo: '/uploads/staff-nurse-2.png',
          bio: 'Linda specializes in pre- and post-operative care. With a decade of operating room experience, she ensures patients feel safe and informed throughout every procedure.'
        },
        {
          name: 'Carlos Reyna, PA-C',
          role: 'Physician Assistant – Vascular Surgery',
          photo: '/uploads/staff-nurse-3.png',
          bio: 'Carlos assists Dr. Gutierrez in complex vascular procedures and manages outpatient follow-up care. Patients appreciate his calm demeanor and clear explanations.'
        },
        {
          name: 'Elina Petite, RN',
          role: 'Patient Care Coordinator',
          photo: '/uploads/staff-nurse-4.png',
          bio: 'Elina is the heart of our scheduling and patient communication. She ensures every patient gets timely appointments and understands their care plan from start to finish.'
        }
      ]
    }
  },
  {
    slug: 'contact',
    title: 'Contact',
    content: {
      header: 'We Are Here for You',
      heroSubtitle: 'Reach out to schedule an appointment or ask our team any question.',
      body: 'Our friendly staff is available Monday through Friday to assist with appointments, referrals, insurance questions, and general inquiries. Same-week appointments are often available for urgent consultations.',
      image: '/uploads/clinic-building.png',
      video: ''
    }
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    content: {
      header: 'Terms of Service',
      heroSubtitle: 'Please read these terms carefully before using our website.',
      body: 'Last updated: January 1, 2025\n\n' +
            'ACCEPTANCE OF TERMS\n\nBy accessing and using the South Texas Vascular Experts website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our site.\n\n' +
            'MEDICAL DISCLAIMER\n\nThe information on this website is for general informational purposes only and does not constitute medical advice. Always consult a qualified healthcare provider for medical guidance. Do not disregard professional medical advice or delay seeking it because of something you have read on this site.\n\n' +
            'USE OF THE SITE\n\nYou agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others. You may not use this site to distribute harmful, offensive, or unlawful content.\n\n' +
            'INTELLECTUAL PROPERTY\n\nAll content on this website, including text, images, logos, and graphics, is the property of South Texas Vascular Experts and is protected by applicable copyright laws. Unauthorized reproduction is prohibited.\n\n' +
            'LIMITATION OF LIABILITY\n\nSouth Texas Vascular Experts shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website.\n\n' +
            'CHANGES TO TERMS\n\nWe reserve the right to modify these terms at any time. Continued use of the site after changes constitutes acceptance of the updated terms.\n\n' +
            'CONTACT\n\nFor questions about these terms, contact us at jason@fauxmail.com.',
      image: '/uploads/clinic-building.png',
      video: ''
    }
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    content: {
      header: 'Privacy Policy',
      heroSubtitle: 'Your privacy matters. Here is how we protect your information.',
      body: 'Last updated: January 1, 2025\n\n' +
            'INFORMATION WE COLLECT\n\nWhen you visit our website, we may collect non-personally identifiable information such as browser type, pages visited, and time spent on pages. If you contact us via email or phone, we collect the information you provide.\n\n' +
            'HOW WE USE YOUR INFORMATION\n\nWe use the information we collect to respond to inquiries, improve our website experience, and communicate about your care. We do not sell your personal information to third parties.\n\n' +
            'PROTECTED HEALTH INFORMATION (PHI)\n\nAs a healthcare provider, we are subject to HIPAA regulations. Any protected health information you share is handled in accordance with our HIPAA Notice of Privacy Practices, available at our office.\n\n' +
            'COOKIES\n\nOur website may use cookies to improve your browsing experience. You can disable cookies in your browser settings at any time without affecting your ability to use the site.\n\n' +
            'THIRD-PARTY LINKS\n\nThis site may contain links to external websites. We are not responsible for the privacy practices of those sites.\n\n' +
            'DATA SECURITY\n\nWe take reasonable steps to protect the information submitted through this site. However, no internet transmission is completely secure.\n\n' +
            'YOUR RIGHTS\n\nYou have the right to request access to, correction of, or deletion of any personal information we hold about you. Contact us at jason@fauxmail.com to make such a request.\n\n' +
            'CONTACT\n\nFor privacy concerns or questions, reach us at jason@fauxmail.com or call (555) 123-4567.',
      image: '/uploads/clinic-building.png',
      video: ''
    }
  }
];

module.exports = { pages };
