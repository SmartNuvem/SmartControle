import { Router } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { prisma } from "../prisma.js";
import { subscribeEvents } from "../realtime.js";

export const eventsRoutes = Router();

eventsRoutes.get("/stream", async (req, res) => {
  const token = typeof req.query.token === "string" ? req.query.token : "";

  if (!token) {
    return res.status(401).json({ message: "Token nao informado." });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user || !user.active) {
      return res.status(401).json({ message: "Usuario invalido ou inativo." });
    }
  } catch {
    return res.status(401).json({ message: "Token invalido." });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  res.write(`data: ${JSON.stringify({ type: "connected", at: new Date().toISOString() })}\n\n`);

  const unsubscribe = subscribeEvents((event) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  });

  const heartbeat = setInterval(() => {
    res.write(": heartbeat\n\n");
  }, 25000);

  req.on("close", () => {
    clearInterval(heartbeat);
    unsubscribe();
    res.end();
  });
});

