import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/profile", authenticate, (req, res) => {
  res.json({
    message: "Success",
    user: req.user,
  });
});

export default router;
