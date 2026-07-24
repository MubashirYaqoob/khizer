/**
 * Admin User Setup Script
 * ========================
 * Creates or promotes a user to ADMIN role.
 * Credentials are read from environment variables — never hardcoded.
 *
 * Usage:
 *   ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="yourpassword" node create-admin.js
 *
 * Or add to .env (DO NOT commit .env to git):
 *   ADMIN_EMAIL=you@example.com
 *   ADMIN_PASSWORD=yourpassword
 *
 * Then run:
 *   node create-admin.js
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Admin';

  if (!email || !password) {
    console.error('❌ ERROR: ADMIN_EMAIL and ADMIN_PASSWORD must be set as environment variables.');
    console.error('   Example: ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="secret123" node create-admin.js');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('❌ ERROR: ADMIN_PASSWORD must be at least 8 characters.');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
      password: hashedPassword,
    },
    create: {
      name,
      email,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ SUCCESS: Admin user ready');
  console.log('   Email:', user.email);
  console.log('   Role:', user.role);
}

createAdminUser()
  .catch((err) => {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
