// ============================================================
// app.js – Full server for South Texas Vascular Experts
// ============================================================

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// 1. DATABASE SETUP
// ============================================================
const DB_PATH = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(DB_PATH);

// Create tables if they don't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      template TEXT DEFAULT 'standard',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Check if we have any pages; if not, seed the database
  db.get('SELECT COUNT(*) as count FROM pages', (err, row) => {
    if (err) {
      console.error('Database error:', err.message);
      return;
    }
    if (row.count === 0) {
      console.log('Seeding initial pages...');
      const initialPages = [
        {
          slug: 'home',
          title: 'Home',
          content: JSON.stringify({
            header: 'Expert Vascular Care You Can Trust',
            heroSubtitle: 'Serving San Antonio and South Texas with compassionate, minimally invasive vascular treatments for over 20 years.',
            body: 'Dr. Edwardo Gutierrez and his dedicated team provide comprehensive, compassionate vascular care for the entire family. We specialize in the diagnosis and treatment of circulatory diseases, using the latest minimally invasive techniques to ensure the best outcomes for our patients.\n\nAs a leading vascular surgery practice in San Antonio, we accept most major insurance plans and offer flexible scheduling to fit your life. New patient appointments are typically available within one week.',
            image: '/uploads/clinic-building.png',
            video: ''
          })
        },
        {
          slug: 'about',
          title: 'About',
          content: JSON.stringify({
            header: 'About Dr. Edwardo Gutierrez, M.D.',
            heroSubtitle: 'Board-certified vascular surgeon with over two decades of surgical excellence.',
            body: 'Dr. Gutierrez is a board-certified vascular surgeon with over 20 years of experience in treating arterial and venous disorders. He earned his medical degree from the University of Texas Health Science Center and completed his residency at Baylor College of Medicine, followed by a vascular surgery fellowship at the renowned Mayo Clinic.\n\nDr. Gutierrez is committed to patient-centered care, combining clinical excellence with a warm, approachable manner. He is an active member of the Society for Vascular Surgery, the American College of Surgeons, and serves on the medical advisory board for two regional hospitals in San Antonio.\n\nOutside of medicine, Dr. Gutierrez is a passionate advocate for health literacy in underserved South Texas communities, regularly participating in free screening events and health education initiatives.',
            image: '/uploads/dr-gutierrez.png',
            video: ''
          })
        },
        {
          slug: 'services',
          title: 'Services',
          content: JSON.stringify({
            header: 'Comprehensive Vascular Services',
            heroSubtitle: 'From diagnosis to recovery, we offer a full spectrum of vascular treatments tailored to you.',
            body: 'Every patient is unique, which is why every treatment plan at South Texas Vascular Experts is built around your specific condition, lifestyle, and goals. We use the latest minimally invasive approaches whenever possible, meaning smaller incisions, faster recovery, and better outcomes.',
            image: '/uploads/clinic-aerial.png',
            video: ''
          })
        },
        {
          slug: 'patient-resources',
          title: 'Patient Resources',
          content: JSON.stringify({
            header: 'Patient Resources & Information',
            heroSubtitle: 'Everything you need to prepare for your visit and understand your care.',
            body: 'We believe informed patients make better health decisions. Browse our resources below, or call our office if you have questions. Our team is always happy to walk you through what to expect before, during, and after any procedure.',
            image: '/uploads/clinic-building.png',
            video: ''
          })
        },
        {
          slug: 'staff',
          title: 'Staff',
          content: JSON.stringify({
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
          })
        },
        {
          slug: 'contact',
          title: 'Contact',
          content: JSON.stringify({
            header: 'We Are Here for You',
            heroSubtitle: 'Reach out to schedule an appointment or ask our team any question.',
            body: 'Our friendly staff is available Monday through Friday to assist with appointments, referrals, insurance questions, and general inquiries. Same-week appointments are often available for urgent consultations.',
            image: '/uploads/clinic-building.png',
            video: ''
          })
        },
        {
          slug: 'terms',
          title: 'Terms of Service',
          content: JSON.stringify({
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
          })
        },
        {
          slug: 'privacy',
          title: 'Privacy Policy',
          content: JSON.stringify({
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
          })
        }
      ];

      const stmt = db.prepare('INSERT INTO pages (slug, title, content) VALUES (?, ?, ?)');
      initialPages.forEach(p => {
        stmt.run(p.slug, p.title, p.content);
      });
      stmt.finalize();
      console.log('Seeding complete.');
    }
  });
});

// ============================================================
// 2. MIDDLEWARE & CONFIGURATION
// ============================================================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session setup (admin login)
app.use(session({
  secret: process.env.SESSION_SECRET || 'vibe-default-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================================
// 3. FILE UPLOAD SETUP (Multer)
// ============================================================
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit for videos
});

// ============================================================
// 4. HELPER FUNCTIONS
// ============================================================
function getPageBySlug(slug, callback) {
  db.get('SELECT * FROM pages WHERE slug = ?', [slug], (err, row) => {
    if (err) return callback(err);
    if (row) {
      try {
        row.content = JSON.parse(row.content);
      } catch (e) {
        row.content = { header: row.title, body: 'Content could not be parsed.', image: '', video: '' };
      }
    }
    callback(null, row);
  });
}

function getAllPages(callback) {
  db.all('SELECT id, slug, title FROM pages ORDER BY title', (err, rows) => {
    callback(err, rows);
  });
}

function updatePageContent(id, contentObj, callback) {
  const contentStr = JSON.stringify(contentObj);
  db.run('UPDATE pages SET content = ? WHERE id = ?', [contentStr, id], function(err) {
    callback(err);
  });
}

function createPage(slug, title, callback) {
  const defaultContent = JSON.stringify({
    header: title,
    body: 'New page content. Edit me in the admin panel.',
    image: '',
    video: ''
  });
  db.run('INSERT INTO pages (slug, title, content) VALUES (?, ?, ?)', [slug, title, defaultContent], function(err) {
    callback(err, this.lastID);
  });
}

function deletePage(id, callback) {
  db.run('DELETE FROM pages WHERE id = ?', [id], function(err) {
    callback(err);
  });
}

// ============================================================
// 5. ADMIN ROUTES (must come BEFORE catch-all /:slug)
// ============================================================
// Helper to protect admin routes
function requireLogin(req, res, next) {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect('/admin');
  }
}

// Admin login page
app.get('/admin', (req, res) => {
  if (req.session.isLoggedIn) {
    res.redirect('/admin/dashboard');
  } else {
    res.render('admin-login', { error: null });
  }
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  // Hardcoded credentials – client can change these in app.js
  const ADMIN_USER = 'admin';
  const ADMIN_PASS = 'vibe123';

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    req.session.isLoggedIn = true;
    res.redirect('/admin/dashboard');
  } else {
    res.render('admin-login', { error: 'Invalid username or password. Try again.' });
  }
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin');
});

// Dashboard
app.get('/admin/dashboard', requireLogin, (req, res) => {
  getAllPages((err, pages) => {
    if (err) {
      res.status(500).send('Database error.');
      return;
    }
    res.render('admin-dashboard', { pages, req: req });
  });
});

// Edit page – GET
app.get('/admin/edit/:id', requireLogin, (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM pages WHERE id = ?', [id], (err, page) => {
    if (err || !page) {
      res.status(404).send('Page not found.');
      return;
    }
    try {
      page.content = JSON.parse(page.content);
    } catch (e) {
      page.content = { header: page.title, body: 'Content error.', image: '', video: '' };
    }
    res.render('admin-edit', { page, error: null, success: null, req: req });
  });
});

// Edit page – POST (update text and metadata)
app.post('/admin/edit/:id', requireLogin, (req, res) => {
  const id = req.params.id;
  const { title, header, body, image, video } = req.body;

  // First, get existing content to preserve fields not being updated
  db.get('SELECT content FROM pages WHERE id = ?', [id], (err, row) => {
    if (err || !row) {
      res.status(404).send('Page not found.');
      return;
    }
    let contentObj;
    try {
      contentObj = JSON.parse(row.content);
    } catch (e) {
      contentObj = { header: '', body: '', image: '', video: '' };
    }
    // Update only the fields that were submitted
    if (title !== undefined) contentObj.title = title;
    if (header !== undefined) contentObj.header = header;
    if (body !== undefined) contentObj.body = body;
    if (image !== undefined) contentObj.image = image;
    if (video !== undefined) contentObj.video = video;

    updatePageContent(id, contentObj, (err) => {
      if (err) {
        res.render('admin-edit', { page: { id, title, content: contentObj }, error: 'Failed to save. Please try again.', success: null, req: req });
      } else {
        // Redirect to refresh the page with success message
        res.redirect(`/admin/edit/${id}?success=1`);
      }
    });
  });
});

// Handle image upload
app.post('/admin/upload/image/:id', requireLogin, upload.single('image'), (req, res) => {
  const id = req.params.id;
  if (!req.file) {
    res.redirect(`/admin/edit/${id}?error=No file selected`);
    return;
  }
  const imagePath = '/uploads/' + req.file.filename;

  db.get('SELECT content FROM pages WHERE id = ?', [id], (err, row) => {
    if (err || !row) {
      res.redirect(`/admin/edit/${id}?error=Page not found`);
      return;
    }
    let contentObj;
    try {
      contentObj = JSON.parse(row.content);
    } catch (e) {
      contentObj = { header: '', body: '', image: '', video: '' };
    }
    contentObj.image = imagePath;
    updatePageContent(id, contentObj, (err) => {
      if (err) {
        res.redirect(`/admin/edit/${id}?error=Upload failed`);
      } else {
        res.redirect(`/admin/edit/${id}?success=Image uploaded`);
      }
    });
  });
});

// Handle video upload
app.post('/admin/upload/video/:id', requireLogin, upload.single('video'), (req, res) => {
  const id = req.params.id;
  if (!req.file) {
    res.redirect(`/admin/edit/${id}?error=No file selected`);
    return;
  }
  const videoPath = '/uploads/' + req.file.filename;

  db.get('SELECT content FROM pages WHERE id = ?', [id], (err, row) => {
    if (err || !row) {
      res.redirect(`/admin/edit/${id}?error=Page not found`);
      return;
    }
    let contentObj;
    try {
      contentObj = JSON.parse(row.content);
    } catch (e) {
      contentObj = { header: '', body: '', image: '', video: '' };
    }
    contentObj.video = videoPath;
    updatePageContent(id, contentObj, (err) => {
      if (err) {
        res.redirect(`/admin/edit/${id}?error=Upload failed`);
      } else {
        res.redirect(`/admin/edit/${id}?success=Video uploaded`);
      }
    });
  });
});

// Add page – GET
app.get('/admin/add', requireLogin, (req, res) => {
  res.render('admin-add', { error: null });
});

// Add page – POST
app.post('/admin/add', requireLogin, (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') {
    res.render('admin-add', { error: 'Please enter a page title.' });
    return;
  }
  // Generate a slug from the title
  let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (!slug) slug = 'page-' + Date.now();

  // Check if slug already exists
  db.get('SELECT id FROM pages WHERE slug = ?', [slug], (err, row) => {
    if (row) {
      // Append a timestamp to make it unique
      slug = slug + '-' + Date.now();
    }
    createPage(slug, title.trim(), (err, id) => {
      if (err) {
        res.render('admin-add', { error: 'Database error: ' + err.message });
      } else {
        res.redirect(`/admin/edit/${id}`);
      }
    });
  });
});

// Delete page
app.post('/admin/delete/:id', requireLogin, (req, res) => {
  const id = req.params.id;
  // Prevent deletion of the home page (optional, but good for safety)
  db.get('SELECT slug FROM pages WHERE id = ?', [id], (err, row) => {
    if (err || !row) {
      res.redirect('/admin/dashboard?error=Page not found');
      return;
    }
    if (row.slug === 'home') {
      res.redirect('/admin/dashboard?error=Cannot delete the home page.');
      return;
    }
    deletePage(id, (err) => {
      if (err) {
        res.redirect('/admin/dashboard?error=Deletion failed');
      } else {
        res.redirect('/admin/dashboard?success=Page deleted');
      }
    });
  });
});

// ============================================================
// 6. FRONTEND ROUTES (Public – catch-all LAST)
// ============================================================
app.get('/', (req, res) => {
  res.redirect('/home');
});

app.get('/:slug', (req, res) => {
  const slug = req.params.slug;
  getPageBySlug(slug, (err, page) => {
    if (err || !page) {
      res.status(404).send('Page not found. Please check the URL.');
      return;
    }
    // Fetch all pages for the navigation menu
    getAllPages((navErr, pages) => {
      if (navErr) {
        console.error(navErr);
        pages = [];
      }
      res.render('layout', {
        page: page,
        pages: pages,
        currentSlug: slug,
        isLoggedIn: req.session.isLoggedIn || false
      });
    });
  });
});

// ============================================================
// 7. START THE SERVER
// ============================================================
app.listen(PORT, () => {
  console.log(`South Texas Vascular Experts site running on http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin (default login: admin / vibe123)`);
  console.log(`Uploads saved to: ${uploadDir}`);
});
