const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const artifactsDir = 'C:\\Users\\mubas\\.gemini\\antigravity-ide\\brain\\9711c85f-7583-41d6-91a6-1e4ef2af6516';
const publicImagesDir = 'C:\\Users\\mubas\\Desktop\\alhuda\\public\\images';

const imageMapping = {
  'hero_banner_1_1781300324586.png': 'ai_hero_1.png',
  'hero_banner_2_1781300335341.png': 'ai_hero_2.png',
  'hero_banner_3_1781300355543.png': 'ai_hero_3.png',
  'promo_banner_1_1781300366549.png': 'ai_promo_1.png',
  'promo_banner_2_1781300383536.png': 'ai_promo_2.png',
};

async function copyImages() {
  for (const [srcName, destName] of Object.entries(imageMapping)) {
    const src = path.join(artifactsDir, srcName);
    const dest = path.join(publicImagesDir, destName);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`Copied ${srcName} to ${destName}`);
    } else {
      console.error(`Source file not found: ${src}`);
    }
  }
}

async function updateDb() {
  const banners = await prisma.heroBanner.findMany({ orderBy: { order: 'asc' } });
  if (banners.length >= 3) {
    await prisma.heroBanner.update({
      where: { id: banners[0].id },
      data: { imageUrl: '/images/ai_hero_1.png', title: 'The Summer Edit', subtitle: 'Breeze Through The Heat' }
    });
    await prisma.heroBanner.update({
      where: { id: banners[1].id },
      data: { imageUrl: '/images/ai_hero_2.png', title: 'Velvet Dreams', subtitle: 'Luxurious Comfort' }
    });
    await prisma.heroBanner.update({
      where: { id: banners[2].id },
      data: { imageUrl: '/images/ai_hero_3.png', title: 'Pret Essentials', subtitle: 'Ready To Wear' }
    });
    console.log("Updated DB Hero Banners with new AI images.");
  }
}

async function main() {
  await copyImages();
  await updateDb();
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
