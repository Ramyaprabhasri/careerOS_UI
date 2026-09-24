import { PrismaClient } from "@prisma/client";
import { DEMO_JOBS } from "../src/data/job-listings";

const prisma = new PrismaClient();

function toPrismaEmploymentType(value: string) {
  if (value === "Full-time") return "Full_time";
  if (value === "Part-time") return "Part_time";
  return value as "Contract" | "Internship" | "Full_time" | "Part_time";
}

async function main() {
  console.log("Seeding development job listings…");

  for (const job of DEMO_JOBS) {
    await prisma.job.upsert({
      where: { id: job.id },
      create: {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        salaryRange: job.salaryRange ?? null,
        workMode: job.workMode,
        employmentType: toPrismaEmploymentType(job.employmentType),
        experienceLevel: job.experienceLevel,
        experienceLabel: job.experienceLabel,
        source: job.source,
        jobUrl: job.jobUrl,
        postedAt: new Date(`${job.postedAt}T00:00:00.000Z`),
        skills: job.skills,
        categories: [...job.categories],
        baseMatchScore: job.match.score,
      },
      update: {
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        salaryRange: job.salaryRange ?? null,
        workMode: job.workMode,
        employmentType: toPrismaEmploymentType(job.employmentType),
        experienceLevel: job.experienceLevel,
        experienceLabel: job.experienceLabel,
        source: job.source,
        jobUrl: job.jobUrl,
        postedAt: new Date(`${job.postedAt}T00:00:00.000Z`),
        skills: job.skills,
        categories: [...job.categories],
        baseMatchScore: job.match.score,
      },
    });
  }

  console.log(`Seeded ${DEMO_JOBS.length} sample jobs.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
