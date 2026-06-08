import { Router } from "express";
import {
  applyJob,
  getUserApplications,
  getJobApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../applications/applications.controller";
import { authenticate, authorizeCompany } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, applyJob);
router.get("/", authenticate, getUserApplications);
router.delete("/:applicationId", authenticate, deleteApplication);

router.get("/job/:jobId", authenticate, authorizeCompany, getJobApplications);
router.patch("/:applicationId", authenticate, authorizeCompany, updateApplicationStatus);

export default router;