import db from "db";
import { Router } from "express";

const router = new Router();

router.get("/", async (_, res) => {
  try {
    // TODO{Dee}: Consider preventing this route from working with db service unless we are authorized

    res.json(await db.findAllArtists());
  } catch (error) {
    // TODO{Dee}: Send back proper status codes based on type
    res.status(500).json({ error: error.message });
  }
});

export default router;
