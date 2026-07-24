const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  // 1. Create Categories
  const unstitched = await prisma.category.upsert({
    where: { slug: "unstitched" },
    update: {},
    create: {
      name: "Unstitched Collection",
      slug: "unstitched",
      description: "Premium unstitched luxury silks and cotton fabrics.",
    },
  });

  const readyToWear = await prisma.category.upsert({
    where: { slug: "ready-to-wear" },
    update: {},
    create: {
      name: "Ready-To-Wear Pret",
      slug: "ready-to-wear",
      description: "Classic ready-to-wear kurtas, pants, and ensembles.",
    },
  });

  const bridal = await prisma.category.upsert({
    where: { slug: "bridal" },
    update: {},
    create: {
      name: "Luxury Bridal Wear",
      slug: "bridal",
      description: "Elegant bespoke bridal ensembles for your big day.",
    },
  });

  const sale = await prisma.category.upsert({
    where: { slug: "sale" },
    update: {},
    create: {
      name: "Special Sale Offers",
      slug: "sale",
      description: "Limited time discount offers on seasonal collections.",
    },
  });

  const customized = await prisma.category.upsert({
    where: { slug: "customized" },
    update: {},
    create: {
      name: "Customized Outfits",
      slug: "customized",
      description: "Bespoke tailored outfits designed for you.",
    },
  });

  const printedUnstitched = await prisma.category.upsert({
    where: { slug: "printed-unstitched" },
    update: {},
    create: {
      name: "Printed Unstitched",
      slug: "printed-unstitched",
      description: "Beautifully printed unstitched fabrics for everyday wear.",
    },
  });

  const embroideredUnstitched = await prisma.category.upsert({
    where: { slug: "embroidered-unstitched" },
    update: {},
    create: {
      name: "Embroidered Unstitched",
      slug: "embroidered-unstitched",
      description: "Intricately embroidered unstitched ensembles.",
    },
  });

  const onePiece = await prisma.category.upsert({
    where: { slug: "one-piece" },
    update: {},
    create: {
      name: "1-Piece",
      slug: "one-piece",
      description: "Single piece fabrics and kurtis.",
    },
  });

  const twoPiece = await prisma.category.upsert({
    where: { slug: "two-piece" },
    update: {},
    create: {
      name: "2-Piece",
      slug: "two-piece",
      description: "Two-piece suits perfect for casual and formal outings.",
    },
  });

  const kurtiShirt = await prisma.category.upsert({
    where: { slug: "kurti-shirt" },
    update: {},
    create: {
      name: "Kurti / Shirt",
      slug: "kurti-shirt",
      description: "Trendy stitched kurtis and shirts.",
    },
  });

  console.log("Categories seeded successfully!");

  // 2. Create Products
  const productsData = [
    {
      name: "Emerald Silk Ensemble",
      slug: "emerald-silk-ensemble",
      description: "A gorgeous deep green unstitched raw silk ensemble with gold hand-embroidered neckline.",
      price: 18000,
      salePrice: 15000,
      images: ["/images/product-emerald.png"],
      sizes: ["S", "M", "L", "XL"],
      stock: 12,
      isFeatured: true,
      categoryId: unstitched.id,
    },
    {
      name: "Ivory Silk Kurta",
      slug: "ivory-silk-kurta",
      description: "Premium ivory silk stitched kurta with delicate lace detailing on sleeves and hem.",
      price: 14000,
      salePrice: null,
      images: ["/images/product-ivory.png"],
      sizes: ["S", "M", "L"],
      stock: 8,
      isFeatured: true,
      categoryId: readyToWear.id,
    },
    {
      name: "Rose Organza Suite",
      slug: "rose-organza-suite",
      description: "Elegant tea pink organza suit with floral thread work, paired with a silk inner.",
      price: 16500,
      salePrice: 14500,
      images: ["/images/product-rose.png"],
      sizes: ["S", "M", "L"],
      stock: 15,
      isFeatured: true,
      categoryId: sale.id,
    },
    {
      name: "Sage Green Cotton Net",
      slug: "sage-green-cotton-net",
      description: "Soothing sage green cotton net shirt with intricate white paste printing and silk dupatta.",
      price: 11000,
      salePrice: 9000,
      images: ["/images/product-sage.png"],
      sizes: ["S", "M", "L", "XL"],
      stock: 20,
      isFeatured: false,
      categoryId: unstitched.id,
    },
  ];

  for (const item of productsData) {
    await prisma.product.upsert({
      where: { slug: item.slug },
      update: {},
      create: item,
    });
  }

  console.log("Products seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
