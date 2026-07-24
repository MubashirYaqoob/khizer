const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Summer Sale products...");

  // Ensure categories exist
  const unstitchedCat = await prisma.category.upsert({
    where: { slug: "unstitched" },
    update: {},
    create: { name: "Unstitched", slug: "unstitched", description: "Unstitched collection", imageUrl: "/images/category-unstitched.png" },
  });
  
  const pretCat = await prisma.category.upsert({
    where: { slug: "pret" },
    update: {},
    create: { name: "Pret", slug: "pret", description: "Pret collection", imageUrl: "/images/product-sage.png" },
  });

  const summerVolCat = await prisma.category.upsert({
    where: { slug: "summer-vol-1" },
    update: {},
    create: { name: "Summer Volume 1", slug: "summer-vol-1", description: "Summer Volume 1", imageUrl: "/images/product-rose.png" },
  });

  const readyToWearCat = pretCat; // alias for existing logic
  const kurtiShirtCat = summerVolCat; // alias for existing logic

  const products = [
    // Unstitched
    {
      name: "Luxe Lawn Unstitched 3-Piece",
      slug: "luxe-lawn-unstitched-3pc",
      description: "A gorgeous premium 3-piece unstitched lawn suit with embroidered chiffon dupatta and dyed cotton trousers.",
      price: 8500,
      salePrice: 6800,
      images: ["/images/category-unstitched.png", "/images/product-rose.png", "/images/product-sage.png"],
      sizes: ["Standard"],
      stock: 30,
      isFeatured: true,
      categoryId: unstitchedCat.id,
    },
    {
      name: "Classic Printed Lawn 3-Piece",
      slug: "classic-printed-lawn-3pc",
      description: "Traditional printed unstitched lawn suit with digital printed voile dupatta and plain trousers.",
      price: 5500,
      salePrice: 4400,
      images: ["/images/product-sage.png", "/images/product-emerald.png"],
      sizes: ["Standard"],
      stock: 45,
      isFeatured: true,
      categoryId: unstitchedCat.id,
    },
    {
      name: "Embroidered Cotton Jacquard",
      slug: "embroidered-cotton-jacquard-3pc",
      description: "Intricately woven cotton jacquard unstitched shirt with embroidered organza borders and jacquard dupatta.",
      price: 9500,
      salePrice: 7600,
      images: ["/images/product-emerald.png", "/images/category-unstitched.png"],
      sizes: ["Standard"],
      stock: 25,
      isFeatured: false,
      categoryId: unstitchedCat.id,
    },
    {
      name: "Floral Summer Lawn 2-Piece",
      slug: "floral-summer-lawn-2pc",
      description: "Fresh summery floral printed 2-piece unstitched lawn shirt and trousers ensemble.",
      price: 4500,
      salePrice: 3600,
      images: ["/images/product-rose.png", "/images/product-ivory.png"],
      sizes: ["Standard"],
      stock: 50,
      isFeatured: false,
      categoryId: unstitchedCat.id,
    },

    // Stitched (ready-to-wear)
    {
      name: "Embellished Stitched Lawn Suit",
      slug: "embellished-stitched-lawn-suit",
      description: "Ready-to-wear 3-piece lawn suit featuring exquisite threadwork, hand embellishments, and a silk dupatta.",
      price: 12500,
      salePrice: 9900,
      images: ["/images/product-ivory.png", "/images/product-rose.png", "/images/product-emerald.png"],
      sizes: ["S", "M", "L", "XL"],
      stock: 40,
      isFeatured: true,
      categoryId: readyToWearCat.id,
    },
    {
      name: "Casual Linen Stitched Suit",
      slug: "casual-linen-stitched-suit",
      description: "Premium dyed linen 2-piece ready-to-wear stitched shirt and pants. Comfort combined with high fashion.",
      price: 8500,
      salePrice: 6800,
      images: ["/images/product-rose.png", "/images/product-sage.png"],
      sizes: ["S", "M", "L"],
      stock: 30,
      isFeatured: true,
      categoryId: readyToWearCat.id,
    },
    {
      name: "Classic Cotton Stitched 2-Piece",
      slug: "classic-cotton-stitched-2pc",
      description: "Stitched cotton block printed 2-piece suit. Breathable, comfortable, and perfect for hot days.",
      price: 7500,
      salePrice: 5900,
      images: ["/images/product-sage.png", "/images/product-emerald.png"],
      sizes: ["S", "M", "L", "XL"],
      stock: 20,
      isFeatured: false,
      categoryId: readyToWearCat.id,
    },
    {
      name: "Festive Organza Stitched Suite",
      slug: "festive-organza-stitched-suite",
      description: "Exquisite stitched organza shirt with sequence embroidery, inner slip, trousers, and matching net dupatta.",
      price: 16500,
      salePrice: 12900,
      images: ["/images/product-emerald.png", "/images/product-ivory.png"],
      sizes: ["S", "M", "L"],
      stock: 15,
      isFeatured: false,
      categoryId: readyToWearCat.id,
    },

    // Pret (kurti-shirt)
    {
      name: "Printed Lawn Kurti",
      slug: "printed-lawn-kurti-pret",
      description: "Bright and vibrant digital printed lawn kurti with unique sleeves design, ready to style.",
      price: 3500,
      salePrice: 2800,
      images: ["/images/product-sage.png", "/images/product-rose.png"],
      sizes: ["S", "M", "L"],
      stock: 50,
      isFeatured: true,
      categoryId: kurtiShirtCat.id,
    },
    {
      name: "Embroidered Pret Shirt",
      slug: "embroidered-pret-shirt",
      description: "Pure cotton dyed pret shirt with high-neck collar, intricate white front embroidery, and lace details.",
      price: 4800,
      salePrice: 3800,
      images: ["/images/product-ivory.png", "/images/product-emerald.png"],
      sizes: ["S", "M", "L", "XL"],
      stock: 35,
      isFeatured: true,
      categoryId: kurtiShirtCat.id,
    },
    {
      name: "Solid Cotton Pret Kurta",
      slug: "solid-cotton-pret-kurta",
      description: "Minimalist solid color ready-to-wear kurta in soft cotton fabric with elegant styling.",
      price: 3900,
      salePrice: 2999,
      images: ["/images/product-emerald.png", "/images/product-sage.png"],
      sizes: ["S", "M", "L"],
      stock: 40,
      isFeatured: false,
      categoryId: kurtiShirtCat.id,
    },
    {
      name: "Digital Print Lawn Kurti",
      slug: "digital-print-lawn-kurti",
      description: "Contemporary design digital print ready-to-wear lawn kurti. Chic and lightweight.",
      price: 3200,
      salePrice: 2499,
      images: ["/images/product-rose.png", "/images/product-ivory.png"],
      sizes: ["S", "M", "L", "XL"],
      stock: 45,
      isFeatured: false,
      categoryId: kurtiShirtCat.id,
    }
  ];

  for (const prod of products) {
    const { sizes, stock, categoryId, ...productFields } = prod;

    // Delete existing product size relations first to avoid unique constraint issues
    const existing = await prisma.product.findUnique({ where: { slug: prod.slug } });
    if (existing) {
      await prisma.productSize.deleteMany({ where: { productId: existing.id } });
      await prisma.product.delete({ where: { id: existing.id } });
    }

    // Create the product
    const createdProduct = await prisma.product.create({
      data: {
        ...productFields,
        sizes,
        stock,
        categoryId,
      }
    });

    // Create ProductSize records
    const sizeStockValue = Math.floor(stock / sizes.length);
    for (const size of sizes) {
      await prisma.productSize.create({
        data: {
          productId: createdProduct.id,
          size,
          stock: sizeStockValue,
        }
      });
    }

    console.log(`Created product: ${createdProduct.name} with ${sizes.length} sizes.`);
  }

  console.log("Seeding sale products completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
