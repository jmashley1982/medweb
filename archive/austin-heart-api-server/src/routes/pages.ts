import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, pagesTable } from "@workspace/db";
import { logger } from "../lib/logger";

const router = Router();

// GET /api/pages — list all pages (for navigation)
router.get("/", async (req, res) => {
  try {
    const pages = await db
      .select({
        id: pagesTable.id,
        title: pagesTable.title,
        slug: pagesTable.slug,
        template: pagesTable.template,
      })
      .from(pagesTable)
      .orderBy(pagesTable.id);
    res.json(pages);
  } catch (err) {
    req.log.error({ err }, "Error listing pages");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/pages/:slug — get a page by slug
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const [page] = await db
      .select()
      .from(pagesTable)
      .where(eq(pagesTable.slug, slug))
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
    req.log.error({ err }, "Error getting page by slug");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
