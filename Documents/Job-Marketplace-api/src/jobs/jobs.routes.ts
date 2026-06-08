import { Router } from "express";
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
} from "../jobs/jobs.controller";
import { authenticate, authorizeCompany } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getJobs);
router.get("/:id", getJob);

router.post("/", authenticate, authorizeCompany, createJob);
router.patch("/:id", authenticate, authorizeCompany, updateJob);
router.delete("/:id", authenticate, authorizeCompany, deleteJob);

export default router;