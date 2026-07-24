const { PrismaClient } = require('@prisma/client');

async function testPrismaConnection(url, name) {
  console.time(name);
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  });
  try {
    const res = await prisma.$queryRaw`SELECT NOW()`;
    console.log(`${name} SUCCESS:`, res);
  } catch (err) {
    console.error(`${name} FAILED:`, err.message);
  } finally {
    await prisma.$disconnect();
    console.timeEnd(name);
  }
}

const dbUrl5432 = "postgresql://postgres.zoxoquorhjinetpzlnch:Khizarfabricstore@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres";
const dbUrl6543 = "postgresql://postgres.zoxoquorhjinetpzlnch:Khizarfabricstore@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1";

async function main() {
  await testPrismaConnection(dbUrl5432, "Port 5432");
  await testPrismaConnection(dbUrl6543, "Port 6543");
}

main();
