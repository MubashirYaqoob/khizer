/**
 * One-time script: Fixes any users in the DB who have plain-text passwords
 * (i.e., manually entered via Supabase dashboard).
 * 
 * Run: node fix-plain-passwords.js
 * 
 * This script will:
 * 1. Find all users
 * 2. Check if the password looks like a bcrypt hash (starts with $2b$ or $2a$)
 * 3. If NOT a hash → prompt for the new password and hash+save it
 * 
 * Safe to run multiple times — it skips already-hashed passwords.
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');
require('dotenv').config();

const prisma = new PrismaClient();

function isBcryptHash(str) {
  return str && (str.startsWith('$2b$') || str.startsWith('$2a$') || str.startsWith('$2y$'));
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, (ans) => { rl.close(); resolve(ans); }));
}

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, password: true } });

  const plainUsers = users.filter(u => !isBcryptHash(u.password));

  if (plainUsers.length === 0) {
    console.log('✅ All users have properly hashed passwords. Nothing to fix!');
    return;
  }

  console.log(`\n⚠️  Found ${plainUsers.length} user(s) with plain-text passwords:`);
  plainUsers.forEach((u, i) => {
    console.log(`  ${i + 1}. ${u.name} (${u.email}) — current password: "${u.password}"`);
  });

  console.log('\nYou have two options:');
  console.log('  [A] Hash the existing plain-text password as-is (user can then log in with it)');
  console.log('  [B] Set a brand new password for each user\n');

  const choice = await ask('Enter choice [A/B]: ');

  for (const user of plainUsers) {
    let finalPassword;
    if (choice.trim().toUpperCase() === 'B') {
      finalPassword = await ask(`New password for ${user.name} (${user.email}): `);
      if (!finalPassword || finalPassword.length < 6) {
        console.log(`  ⚠️  Skipping ${user.email} — password too short`);
        continue;
      }
    } else {
      // Option A: hash the current plain text password
      finalPassword = user.password;
    }

    const hashed = await bcrypt.hash(finalPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
    console.log(`  ✅ ${user.email} — password updated`);
  }

  console.log('\n✅ Done! All users can now log in normally.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
