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

router.post("/", async (_, res) => {
  try {
    res.json(await db.addNewUser(_.body));
  } catch (error) {
    res.status(200).json({ error: error.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    res.json(await db.deleteUser(req.body.name));
  } catch (error) {
    res.status(300).json({ error: error.message });
  }
});

export default router;
