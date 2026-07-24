const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const tables = ["User", "Product", "Category", "Order", "OrderItem", "HeroBanner", "CustomizedOrder"];
  
  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
      console.log(`Enabled RLS on ${table}`);
    } catch (e) {
      console.error(`Failed to enable RLS on ${table}:`, e.message);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
