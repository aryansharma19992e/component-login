const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { username: "jsmith" },
    update: {},
    create: {
      name: "John Smith",
      username: "jsmith",
      email: "jsmith@example.com",
      password: hashedPassword,
    },
  });
}

main()
  .then(() => {
    console.log("Seed completed");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error("Seed failed:", e);
    prisma.$disconnect();
    process.exit(1);
  });