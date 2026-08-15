import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const pagesTable = pgTable("pages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  template: text("template").notNull().default("standard"),
  content: text("content"),
  headerImage: text("header_image"),
  videoUrl: text("video_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPageSchema = createInsertSchema(pagesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePageSchema = insertPageSchema.partial();

export type InsertPage = z.infer<typeof insertPageSchema>;
export type UpdatePage = z.infer<typeof updatePageSchema>;
export type Page = typeof pagesTable.$inferSelect;
