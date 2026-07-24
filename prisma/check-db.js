const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  });
  console.log("Categories and product counts:");
  console.log(JSON.stringify(categories, null, 2));

  const products = await prisma.product.findMany({
    take: 10,
    select: {
      id: true,
      name: true,
      price: true,
      salePrice: true,
      slug: true,
      categoryId: true,
      category: {
        select: { name: true }
      }
    }
  });
  console.log("Sample products:");
  console.log(JSON.stringify(products, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
