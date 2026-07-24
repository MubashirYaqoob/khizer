const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const banners = await prisma.heroBanner.findMany();
  console.log("Banners:", banners);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
