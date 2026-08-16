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
const { pages: seedPages } = require('./seed-data');

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
      const stmt = db.prepare('INSERT INTO pages (slug, title, content) VALUES (?, ?, ?)');
      seedPages.forEach(p => {
        stmt.run(p.slug, p.title, JSON.stringify(p.content));
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
