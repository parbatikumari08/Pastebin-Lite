import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { nanoid } from "nanoid";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

/**
 * GET /api/healthz
 */
app.get("/api/healthz", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
});

/**
 * POST /api/pastes
 */
app.post("/api/pastes", async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;

  if (!content || typeof content !== "string" || content.trim() === "") {
    return res.status(400).json({ error: "Invalid content" });
  }

  if (ttl_seconds && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return res.status(400).json({ error: "Invalid ttl_seconds" });
  }

  if (max_views && (!Number.isInteger(max_views) || max_views < 1)) {
    return res.status(400).json({ error: "Invalid max_views" });
  }

  const now = Date.now();
  const expiresAt = ttl_seconds
    ? new Date(now + ttl_seconds * 1000)
    : null;

  const id = nanoid(8);

  const paste = await prisma.paste.create({
    data: {
      id,
      content,
      expiresAt,
      maxViews: max_views ?? null
    }
  });

  const baseUrl = `${req.protocol}://${req.get("host")}`;

  res.status(201).json({
    id: paste.id,
    url: `${baseUrl}/p/${paste.id}`
  });
});

/**
 * GET /api/pastes/:id
 */
app.get("/api/pastes/:id", async (req, res) => {
  const { id } = req.params;

  const paste = await prisma.paste.findUnique({ where: { id } });
  if (!paste) return res.status(404).json({ error: "Not found" });

  const isTestMode = process.env.TEST_MODE === "1";
  const now = isTestMode && req.headers["x-test-now-ms"]
    ? new Date(Number(req.headers["x-test-now-ms"]))
    : new Date();

  if (paste.expiresAt && now > paste.expiresAt) {
    return res.status(404).json({ error: "Expired" });
  }

  if (paste.maxViews !== null && paste.views >= paste.maxViews) {
    return res.status(404).json({ error: "View limit exceeded" });
  }

  const updated = await prisma.paste.update({
    where: { id },
    data: { views: { increment: 1 } }
  });

  res.json({
    content: updated.content,
    remaining_views:
      updated.maxViews === null ? null : updated.maxViews - updated.views,
    expires_at: updated.expiresAt
  });
});

/**
 * GET /p/:id (HTML)
 */
app.get("/p/:id", async (req, res) => {
  const paste = await prisma.paste.findUnique({
    where: { id: req.params.id }
  });

  if (!paste) return res.status(404).send("Not found");

  if (paste.expiresAt && new Date() > paste.expiresAt)
    return res.status(404).send("Expired");

  if (paste.maxViews !== null && paste.views >= paste.maxViews)
    return res.status(404).send("Expired");

  await prisma.paste.update({
    where: { id: paste.id },
    data: { views: { increment: 1 } }
  });

  res.send(`
    <html>
      <body>
        <pre>${paste.content
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</pre>
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
