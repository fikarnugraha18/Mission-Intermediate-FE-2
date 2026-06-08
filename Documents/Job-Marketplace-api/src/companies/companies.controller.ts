import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createCompany = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (user.role !== "COMPANY") {
      return res.status(403).json({ message: "Only company can create company profile" });
    }

    const company = await prisma.company.create({
      data: {
        name: req.body.name,
        ownerId: user.userId,
      },
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};