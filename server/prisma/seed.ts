import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { hash } from "bcrypt";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo users
  const managerPassword = await hash("manager123", 10);
  const userPassword = await hash("user123", 10);

  const manager = await prisma.user.upsert({
    where: { email: "manager@zoomoptic.com" },
    update: { status: "ACTIVE", role: "MANAGER", name: "Manager ZO" },
    create: {
      email: "manager@zoomoptic.com",
      name: "Manager ZO",
      password: managerPassword,
      role: "MANAGER",
      status: "ACTIVE",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@zoomoptic.com" },
    update: { status: "ACTIVE", role: "USER", name: "User ZO" },
    create: {
      email: "user@zoomoptic.com",
      name: "User ZO",
      password: userPassword,
      role: "USER",
      status: "ACTIVE",
    },
  });

  const employee = await prisma.user.upsert({
    where: { email: "employee@zoomoptic.com" },
    update: { status: "ACTIVE", role: "USER", name: "Employee ZO" },
    create: {
      email: "employee@zoomoptic.com",
      name: "Employee ZO",
      password: userPassword,
      role: "USER",
      status: "ACTIVE",
    },
  });

  console.log("✅ Created demo users:");
  console.log("   Manager: manager@zoomoptic.com / manager123");
  console.log("   Employee: employee@zoomoptic.com / user123");
  console.log("   User: user@zoomoptic.com / user123");

  // Create sample products
  const products = [
    {
      name: "Lunettes Ray-Ban Aviator",
      sku: "RB-AV-001",
      brand: "Ray-Ban",
      price: 159.99,
      costPrice: 80.0,
      quantity: 25,
      reorderPoint: 5,
      reorderQuantity: 20,
      frameMaterial: "metal",
      frameShape: "aviator",
      lensType: "polycarbonate",
      color: "gold",
      gender: "unisex",
      templeLength: 140,
      bridgeSize: 14,
      hingeType: "standard",
      supplierName: "Luxottica France",
      supplierContact: "contact@luxottica.fr",
    },
    {
      name: "Lunettes Oakley Holbrook",
      sku: "OK-HB-001",
      brand: "Oakley",
      price: 189.99,
      costPrice: 95.0,
      quantity: 18,
      reorderPoint: 5,
      reorderQuantity: 15,
      frameMaterial: "plastic",
      frameShape: "rectangular",
      lensType: "polycarbonate",
      color: "black",
      gender: "men",
      templeLength: 137,
      bridgeSize: 17,
      hingeType: "spring-loaded",
      supplierName: "Oakley Europe",
      supplierContact: "sales@oakley.eu",
    },
    {
      name: "Lunettes Chanel 3281",
      sku: "CH-3281-001",
      brand: "Chanel",
      price: 450.0,
      costPrice: 225.0,
      quantity: 8,
      reorderPoint: 3,
      reorderQuantity: 10,
      frameMaterial: "acetate",
      frameShape: "cat-eye",
      lensType: "progressive",
      color: "black",
      gender: "women",
      templeLength: 140,
      bridgeSize: 16,
      hingeType: "flexible",
      supplierName: "Chanel France",
      supplierContact: "optique@chanel.fr",
    },
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { sku: productData.sku },
      update: {},
      create: {
        ...productData,
        userId: manager.id,
        imageSrc: null,
      },
    });
  }

  console.log("✅ Created 3 sample products");

  // Create sample customer
  const customer = await prisma.customer.upsert({
    where: { email: "marie.dupont@email.fr" },
    update: {},
    create: {
      firstName: "Marie",
      lastName: "Dupont",
      email: "marie.dupont@email.fr",
      phone: "+33 6 12 34 56 78",
      address: "15 Rue de la Paix",
      city: "Paris",
      postalCode: "75002",
      birthDate: new Date("1985-03-15"),
      notes: "Client régulier, préfère les montures légères",
      insuranceProvider: "Mutuelle Générale",
      insuranceNumber: "MG123456789",
      userId: manager.id,
    },
  });

  console.log("✅ Created sample customer: Marie Dupont");

  // Create sample prescription
  await prisma.prescription.create({
    data: {
      customerId: customer.id,
      userId: manager.id,
      prescriptionDate: new Date("2025-01-15"),
      expiryDate: new Date("2027-01-15"),
      prescribedBy: "Dr. Martin",
      odSph: "-2.50",
      odCyl: "-0.75",
      odAxis: "180",
      odAdd: "+2.00",
      odPd: "32",
      osSph: "-2.25",
      osCyl: "-0.50",
      osAxis: "175",
      osAdd: "+2.00",
      osPd: "31",
      nearPd: "30",
      lensTypeRecommended: "Progressifs haut de gamme",
      notes: "Client sensible aux verres",
    },
  });

  console.log("✅ Created sample prescription");

  // Create sample quote
  const quote = await prisma.quote.upsert({
    where: { quoteNumber: "QT-2025-0001" },
    update: {},
    create: {
      quoteNumber: "QT-2025-0001",
      customerId: customer.id,
      userId: manager.id,
      subtotal: 609.99,
      taxRate: 20,
      taxAmount: 122.0,
      total: 731.99,
      validUntil: new Date("2025-03-15"),
      notes: "Devis pour nouvelles lunettes",
      terms: "Validité 30 jours",
      status: "DRAFT",
      items: {
        create: [
          {
            description: "Lunettes Chanel 3281",
            quantity: 1,
            unitPrice: 450.0,
            discount: 0,
            total: 450.0,
          },
          {
            description: "Verres progressifs anti-reflet",
            quantity: 2,
            unitPrice: 79.99,
            discount: 0,
            total: 159.99,
          },
        ],
      },
    },
  });

  console.log("✅ Created sample quote: QT-2025-0001");

  console.log("\n🎉 Database seeded successfully!");
  console.log("\nYou can now log in with:");
  console.log("  Email: manager@zoomoptic.com");
  console.log("  Password: manager123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
