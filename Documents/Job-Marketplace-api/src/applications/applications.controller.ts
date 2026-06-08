import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";

export async function applyJob(req: AuthRequest, res: Response) {
  try {
    const { jobId } = req.body;
    const userId = req.user!.userId;

    if (!jobId) return res.status(400).json({ message: "jobId wajib diisi" });

    
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ message: "Job not found" });

  
    const existing = await prisma.application.findUnique({
      where: { userId_jobId: { userId, jobId } },
    });
    if (existing) return res.status(400).json({ message: "You already applied to this job" });

    const application = await prisma.application.create({
      data: {
        userId,
        jobId,
        status: "APPLIED",
      },
    });

    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed apply job" });
  }
}


export async function getUserApplications(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.userId;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const applications = await prisma.application.findMany({
      where: { userId },
      include: { job: { include: { company: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.application.count({
      where: { userId },
    });

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: applications,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed get applications" });
  }
}


export async function getJobApplications(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.userId;
    const jobId = req.params.jobId;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const status = req.query.status as string | undefined;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.company.ownerId !== userId) {
      return res.status(403).json({ message: "Cannot see applications of other company" });
    }

    const whereCondition: any = { jobId };
    if (status) {
      whereCondition.status = status;
    }

    const applications = await prisma.application.findMany({
      where: whereCondition,
      include: {
         user: {
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,                    
            },
         },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.application.count({
      where: whereCondition,
    });

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: applications,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed get job applications" });
  }
}

export async function updateApplicationStatus(req: AuthRequest, res: Response) {
  try {

    const { applicationId } = req.params;
    const { status } = req.body;
    const userId = req.user!.userId;

    if (!["APPLIED", "REVIEWED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await prisma.application.findUnique({ where: { id: applicationId } });
    if (!application) return res.status(404).json({ message: "Application not found" });

  
    const job = await prisma.job.findUnique({ where: { id: application.jobId } });
    const company = await prisma.company.findUnique({ where: { id: job!.companyId } });

    if (company?.ownerId !== userId) {
      return res.status(403).json({ message: "Cannot update applications of other company" });
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed update application status" });
  }
}


export async function deleteApplication(req: AuthRequest, res: Response) {
  try {
    const applicationId = req.params.applicationId;
    const userId = req.user!.userId;

    const application = await prisma.application.findUnique({ where: { id: applicationId } });
    if (!application) return res.status(404).json({ message: "Application not found" });

    if (application.userId !== userId) {
      return res.status(403).json({ message: "Cannot delete other user's application" });
    }

    await prisma.application.delete({ where: { id: applicationId } });

    res.json({ message: "Application cancelled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed delete application" });
  }
}