import { Router } from "express";
import { register, login } from "./auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authenticate, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: (req as any).user,
  });
});

export default router;
