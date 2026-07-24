const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const banners = await prisma.heroBanner.findMany({ orderBy: { order: 'asc' } });
  
  if (banners.length >= 3) {
    await prisma.heroBanner.update({
      where: { id: banners[0].id },
      data: { imageUrl: '/images/product-rose.png', title: 'The Rose Edit', subtitle: 'Festive Collection' }
    });
    
    await prisma.heroBanner.update({
      where: { id: banners[1].id },
      data: { imageUrl: '/images/product-emerald.png', title: 'Emerald Elegance', subtitle: 'Premium Wear' }
    });

    await prisma.heroBanner.update({
      where: { id: banners[2].id },
      data: { imageUrl: '/images/product-sage.png', title: 'Sage Classics', subtitle: 'Unstitched Fabric' }
    });
  }
  
  console.log("Updated banners to stunning product model images.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
