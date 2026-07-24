const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const banners = await prisma.heroBanner.findMany({ orderBy: { order: 'asc' } });
  
  if (banners.length >= 3) {
    await prisma.heroBanner.update({
      where: { id: banners[0].id },
      data: { imageUrl: '/images/hero-homepage.png' }
    });
    
    await prisma.heroBanner.update({
      where: { id: banners[1].id },
      data: { imageUrl: '/images/gallery-lookbook.png' }
    });

    await prisma.heroBanner.update({
      where: { id: banners[2].id },
      data: { imageUrl: '/images/banner1.png' }
    });
  }
  
  console.log("Updated banners with model images.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
