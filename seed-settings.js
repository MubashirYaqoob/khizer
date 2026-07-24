const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const defaults = [
    { key: "brand_story_title", value: "Crafted With Heritage" },
    { key: "brand_story_subtitle", value: "Our Legacy" },
    { key: "brand_story_text", value: "At Al-Huda, we believe in preserving the intricate artistry of traditional Pakistani fashion. Every garment is a testament to our master weavers and artisans, bringing you timeless elegance tailored to perfection." },
    { key: "brand_story_image", value: "/images/about-story.png" },
  ];

  for (const d of defaults) {
    await prisma.setting.upsert({
      where: { key: d.key },
      update: {}, // Only create if it doesn't exist
      create: { key: d.key, value: d.value }
    });
  }
  console.log("Seeded default brand story settings.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
