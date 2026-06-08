import { prisma } from "../lib/prisma";

export const createJob = async (data: {
  title: string;
  location: string;
  companyId: string;
}) => {
  return prisma.job.create({ data });
};

export const getAllJobs = async () => {
  return prisma.job.findMany({
    include: {
      company: true,
    },
  });
};

export const getJobById = async (id: string) => {
  return prisma.job.findUnique({
    where: { id },
    include: {
      company: true,
      apps: true,
    },
  });
};
