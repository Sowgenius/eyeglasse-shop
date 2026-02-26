#!/usr/bin/env node

/**
 * Optician Pro - Batch User Creation Script
 * 
 * Usage:
 *   node scripts/create-admin.js
 * 
 * This script creates default admin and demo users for quick setup.
 */

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const defaultUsers = [
  {
    email: 'admin@optician.pro',
    name: 'Administrator',
    password: 'admin123',
    role: 'MANAGER',
  },
  {
    email: 'manager@optician.pro',
    name: 'Store Manager',
    password: 'manager123',
    role: 'MANAGER',
  },
  {
    email: 'user@optician.pro',
    name: 'Sales Representative',
    password: 'user123',
    role: 'USER',
  },
];

async function createUser(prisma, userData) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      console.log(`⚠️  User "${userData.email}" already exists, skipping...`);
      return null;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
        role: userData.role,
      },
    });

    console.log(`✅ Created: ${user.name} (${user.email}) - ${user.role}`);
    return user;
  } catch (error) {
    console.error(`❌ Error creating "${userData.email}":`, error.message);
    return null;
  }
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('\n🏪 Optician Pro - Default Users Setup\n');
  console.log('Creating default users...\n');

  const createdUsers = [];

  for (const userData of defaultUsers) {
    const user = await createUser(prisma, userData);
    if (user) {
      createdUsers.push(user);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Setup Complete!\n');

  if (createdUsers.length > 0) {
    console.log('Created Users:');
    console.log('-'.repeat(60));
    createdUsers.forEach((user) => {
      console.log(`  Email:    ${user.email}`);
      console.log(`  Password: ${defaultUsers.find(u => u.email === user.email)?.password}`);
      console.log(`  Role:     ${user.role}`);
      console.log('');
    });
  }

  console.log('='.repeat(60));
  console.log('\n📋 Login Credentials:\n');
  
  defaultUsers.forEach((user) => {
    console.log(`${user.role}:`);
    console.log(`  Email:    ${user.email}`);
    console.log(`  Password: ${user.password}`);
    console.log('');
  });

  console.log('⚠️  IMPORTANT: Change default passwords in production!\n');

  await prisma.$disconnect();
  await pool.end();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
