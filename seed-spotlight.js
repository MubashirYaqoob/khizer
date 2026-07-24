const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const defaults = [
    { key: "spotlight_title", value: "Our Bestsellers" },
    { key: "spotlight_subtitle", value: "Top Rated" },
    { key: "spotlight_category_slug", value: "ready-to-wear" },
  ];

  for (const d of defaults) {
    await prisma.setting.upsert({
      where: { key: d.key },
      update: {}, 
      create: { key: d.key, value: d.value }
    });
  }
  console.log("Seeded default spotlight settings.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
