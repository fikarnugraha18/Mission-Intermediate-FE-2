import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";

export async function createJob(req: AuthRequest, res: Response) {
  try {
    const { title, location } = req.body;

    if (!title || !location) {
      return res.status(400).json({ message: "title dan location wajib diisi" });
    }

    const user = req.user!;
    const userId = user.userId;


    let company = await prisma.company.findFirst({
      where: { ownerId: userId },
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: `${user.email}'s Company`,
          ownerId: userId,
        },
      });
      console.log("Company auto-created:", company.name);
    }

    const job = await prisma.job.create({
      data: {
        title,
        location,
        companyId: company.id,
      },
    });

    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed create job" });
  }
}

export async function getJobs(req: Request, res: Response) {
  try {
    const jobs = await prisma.job.findMany({
      include: { company: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed get jobs" });
  }
}


export async function getJob(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const job = await prisma.job.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed get job" });
  }
}


export async function updateJob(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id;
    const { title, location } = req.body;
    const userId = req.user!.userId;

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) return res.status(404).json({ message: "Job not found" });

    
    const company = await prisma.company.findUnique({ where: { id: job.companyId } });
    if (company?.ownerId !== userId) {
      return res.status(403).json({ message: "Cannot update job of other company" });
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: { title, location },
    });

    res.json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed update job" });
  }
}


export async function deleteJob(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id;
    const userId = req.user!.userId;

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) return res.status(404).json({ message: "Job not found" });

    const company = await prisma.company.findUnique({ where: { id: job.companyId } });
    if (company?.ownerId !== userId) {
      return res.status(403).json({ message: "Cannot delete job of other company" });
    }

    await prisma.job.delete({ where: { id } });
    res.json({ message: "Job deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed delete job" });
  }
}