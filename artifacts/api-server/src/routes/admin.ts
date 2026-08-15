import { Router } from "express";
import { eq } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db, pagesTable } from "@workspace/db";

const router = Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
const SESSION_COOKIE = "aha_admin_session";

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${timestamp}_${safe}`);
  },
});

const ALLOWED_MIMETYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const upload = multer({
  storage,
  limits: { fileSize: 16 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMETYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed"));
    }
  },
});

function isAuthenticated(req: Parameters<Router>[0]): boolean {
  const session = (req as unknown as Record<string, unknown>).session as
    | Record<string, unknown>
    | undefined;
  return session?.["loggedIn"] === true;
}

function requireAuth(
  req: Parameters<Router>[0],
  res: Parameters<Router>[1],
  next: Parameters<Router>[2],
) {
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

// POST /api/admin/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body as {
    username?: string;
    password?: string;
  };
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sess = (req as any).session as Record<string, unknown> & { save(cb: (err?: Error) => void): void };
    sess["loggedIn"] = true;
    sess["username"] = username;
    sess.save((err) => {
      if (err) {
        req.log.error({ err }, "Session save failed");
        res.status(500).json({ error: "Session error" });
        return;
      }
      res.json({ authenticated: true, username });
    });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});

// POST /api/admin/logout
router.post("/logout", (req, res) => {
  const session = (req as unknown as Record<string, unknown>).session as
    | Record<string, unknown>
    | undefined;
  if (session) {
    session["loggedIn"] = false;
    session["username"] = null;
  }
  res.json({ authenticated: false, username: null });
});

// GET /api/admin/me
router.get("/me", (req, res) => {
  const session = (req as unknown as Record<string, unknown>).session as
    | Record<string, unknown>
    | undefined;
  const loggedIn = session?.["loggedIn"] === true;
  res.json({
    authenticated: loggedIn,
    username: loggedIn ? (session?.["username"] as string | null) ?? null : null,
  });
});

// GET /api/admin/pages
router.get("/pages", requireAuth, async (req, res) => {
  try {
    const pages = await db
      .select()
      .from(pagesTable)
      .orderBy(pagesTable.id);
    res.json(
      pages.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        template: p.template,
        content: p.content,
        headerImage: p.headerImage,
        videoUrl: p.videoUrl,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Error listing admin pages");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/admin/pages
router.post("/pages", requireAuth, async (req, res) => {
  try {
    const body = req.body as {
      title?: string;
      slug?: string;
      template?: string;
      content?: string;
      headerImage?: string;
      videoUrl?: string;
    };

    if (!body.title) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    const slug =
      body.slug?.trim() ||
      body.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    const [page] = await db
      .insert(pagesTable)
      .values({
        title: body.title,
        slug,
        template: body.template ?? "standard",
        content: body.content ?? null,
        headerImage: body.headerImage ?? null,
        videoUrl: body.videoUrl ?? null,
      })
      .returning();

    res.status(201).json({
      id: page.id,
      title: page.title,
      slug: page.slug,
      template: page.template,
      content: page.content,
      headerImage: page.headerImage,
      videoUrl: page.videoUrl,
      createdAt: page.createdAt.toISOString(),
      updatedAt: page.updatedAt.toISOString(),
    });
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "23505"
    ) {
      res.status(400).json({ error: "A page with that slug already exists" });
      return;
    }
    req.log.error({ err }, "Error creating page");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/pages/:id
router.get("/pages/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid page ID" });
      return;
    }

    const [page] = await db
      .select()
      .from(pagesTable)
      .where(eq(pagesTable.id, id))
      .limit(1);

    if (!page) {
      res.status(404).json({ error: "Page not found" });
      return;
    }

    res.json({
      id: page.id,
      title: page.title,
      slug: page.slug,
      template: page.template,
      content: page.content,
      headerImage: page.headerImage,
      videoUrl: page.videoUrl,
      createdAt: page.createdAt.toISOString(),
      updatedAt: page.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting admin page");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/pages/:id
router.patch("/pages/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid page ID" });
      return;
    }

    const body = req.body as {
      title?: string;
      slug?: string;
      template?: string;
      content?: string;
      headerImage?: string;
      videoUrl?: string;
    };

    const updates: Partial<typeof pagesTable.$inferInsert> & {
      updatedAt?: Date;
    } = { updatedAt: new Date() };

    if (body.title !== undefined) updates.title = body.title;
    if (body.slug !== undefined) updates.slug = body.slug;
    if (body.template !== undefined) updates.template = body.template;
    if (body.content !== undefined) updates.content = body.content;
    if (body.headerImage !== undefined) updates.headerImage = body.headerImage;
    if (body.videoUrl !== undefined) updates.videoUrl = body.videoUrl;

    const [page] = await db
      .update(pagesTable)
      .set(updates)
      .where(eq(pagesTable.id, id))
      .returning();

    if (!page) {
      res.status(404).json({ error: "Page not found" });
      return;
    }

    res.json({
      id: page.id,
      title: page.title,
      slug: page.slug,
      template: page.template,
      content: page.content,
      headerImage: page.headerImage,
      videoUrl: page.videoUrl,
      createdAt: page.createdAt.toISOString(),
      updatedAt: page.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error updating page");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/admin/pages/:id
router.delete("/pages/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid page ID" });
      return;
    }

    // Protect the home page from deletion
    const [target] = await db.select({ slug: pagesTable.slug }).from(pagesTable).where(eq(pagesTable.id, id)).limit(1);
    if (target?.slug === "home") {
      res.status(403).json({ error: "The home page cannot be deleted" });
      return;
    }

    const [deleted] = await db
      .delete(pagesTable)
      .where(eq(pagesTable.id, id))
      .returning({ id: pagesTable.id });

    if (!deleted) {
      res.status(404).json({ error: "Page not found" });
      return;
    }

    res.json({ success: true, message: "Page deleted" });
  } catch (err) {
    req.log.error({ err }, "Error deleting page");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/admin/upload — image/video upload
router.post(
  "/upload",
  requireAuth,
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      res.status(400).json({ success: false, url: null, error: "No file uploaded" });
      return;
    }
    const url = `/api/admin/uploads/${req.file.filename}`;
    res.json({ success: true, url, error: null });
  },
);

// GET /api/admin/uploads/:filename — serve uploaded files
router.get("/uploads/:filename", (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(UPLOADS_DIR, filename);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "File not found" });
    return;
  }

  res.sendFile(filePath);
});

export { router as adminRouter, SESSION_COOKIE };
export default router;
