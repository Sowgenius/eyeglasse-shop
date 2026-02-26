#!/usr/bin/env node

/**
 * Optician Pro - User Creation Script
 * 
 * Usage:
 *   node scripts/create-user.js [options]
 * 
 * Options:
 *   --email, -e       User email (required)
 *   --name, -n        User name (required)
 *   --password, -p    User password (required)
 *   --role, -r        User role: USER or MANAGER (default: USER)
 *   --admin, -a       Create as admin/manager (shorthand for --role MANAGER)
 * 
 * Examples:
 *   node scripts/create-user.js -e john@example.com -n "John Doe" -p secret123
 *   node scripts/create-user.js --email admin@shop.com --name "Admin User" --password admin123 --admin
 *   node scripts/create-user.js -e manager@optician.pro -n "Manager" -p manager123 -r MANAGER
 */

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

let prisma;
let pool;

async function getPrisma() {
  if (!prisma) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    email: null,
    name: null,
    password: null,
    role: 'USER',
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case '--email':
      case '-e':
        options.email = nextArg;
        i++;
        break;
      case '--name':
      case '-n':
        options.name = nextArg;
        i++;
        break;
      case '--password':
      case '-p':
        options.password = nextArg;
        i++;
        break;
      case '--role':
      case '-r':
        options.role = nextArg.toUpperCase();
        i++;
        break;
      case '--admin':
      case '-a':
        options.role = 'MANAGER';
        break;
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;
    }
  }

  return options;
}

function showHelp() {
  console.log(`
Optician Pro - User Creation Script

Usage:
  node scripts/create-user.js [options]

Options:
  --email, -e       User email (required)
  --name, -n        User name (required)
  --password, -p    User password (required)
  --role, -r        User role: USER or MANAGER (default: USER)
  --admin, -a       Create as admin/manager (shorthand for --role MANAGER)
  --help, -h        Show this help message

Examples:
  # Create regular user
  node scripts/create-user.js -e john@example.com -n "John Doe" -p secret123

  # Create admin/manager
  node scripts/create-user.js --email admin@shop.com --name "Admin User" --password admin123 --admin

  # Create manager with explicit role
  node scripts/create-user.js -e manager@optician.pro -n "Manager" -p manager123 -r MANAGER
`);
}

function validateOptions(options) {
  const errors = [];

  if (!options.email) {
    errors.push('Email is required (--email or -e)');
  } else if (!isValidEmail(options.email)) {
    errors.push('Invalid email format');
  }

  if (!options.name) {
    errors.push('Name is required (--name or -n)');
  }

  if (!options.password) {
    errors.push('Password is required (--password or -p)');
  } else if (options.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (!['USER', 'MANAGER'].includes(options.role)) {
    errors.push('Role must be either USER or MANAGER');
  }

  return errors;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function createUser(options) {
  const prisma = await getPrisma();
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: options.email },
    });

    if (existingUser) {
      console.error(`❌ Error: User with email "${options.email}" already exists`);
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(options.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: options.email,
        name: options.name,
        password: hashedPassword,
        role: options.role,
      },
    });

    console.log('\n✅ User created successfully!\n');
    console.log('User Details:');
    console.log('  ID:       ', user.id);
    console.log('  Name:     ', user.name);
    console.log('  Email:    ', user.email);
    console.log('  Role:     ', user.role);
    console.log('  Created:  ', user.createdAt.toISOString());
    console.log('');

    if (user.role === 'MANAGER') {
      console.log('⚠️  This user has MANAGER privileges and can:');
      console.log('   - Manage all products');
      console.log('   - View all customers');
      console.log('   - Access all reports');
      console.log('   - Manage other users\' data');
    } else {
      console.log('ℹ️  This user has USER privileges and can:');
      console.log('   - Manage their own products');
      console.log('   - View their own customers');
      console.log('   - Create quotes and invoices');
    }

    console.log('');
    return user;
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const options = parseArgs();
  const errors = validateOptions(options);

  if (errors.length > 0) {
    console.error('\n❌ Validation errors:\n');
    errors.forEach((error) => console.error(`  - ${error}`));
    console.error('\nUse --help for usage information\n');
    process.exit(1);
  }

  const prisma = await getPrisma();
  console.log('\n📝 Creating user...\n');
  console.log('Email:', options.email);
  console.log('Name:', options.name);
  console.log('Role:', options.role);
  console.log('');

  await createUser(options);

  await pool?.end();
}

main();
