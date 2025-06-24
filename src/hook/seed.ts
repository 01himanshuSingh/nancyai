import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dummyUserId = "000000000000000000000000"; // Dummy MongoDB ObjectId format

  await prisma.agent.createMany({
    data: [
      {
        name: "Content Writer AI",
        instruction: "Write SEO blogs on technology.",
        userId: dummyUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Math Tutor AI",
        instruction: "Explain math problems step-by-step.",
        userId: dummyUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Interview Coach AI",
        instruction: "Give mock interview questions and feedback.",
        userId: dummyUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });

  console.log("✅ Dummy agents added");
}

main()
  .catch((e) => {
    console.error("❌ Seed error", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
