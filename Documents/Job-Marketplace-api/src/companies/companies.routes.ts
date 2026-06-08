import { Router } from "express";
import { createCompany } from "./companies.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, createCompany);

export default router;