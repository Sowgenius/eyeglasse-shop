import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo users
  const managerPassword = await hash('manager123', 10);
  const userPassword = await hash('user123', 10);

  const manager = await prisma.user.upsert({
    where: { email: 'manager@optician.pro' },
    update: {},
    create: {
      email: 'manager@optician.pro',
      name: 'Manager Demo',
      password: managerPassword,
      role: 'MANAGER',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@optician.pro' },
    update: {},
    create: {
      email: 'user@optician.pro',
      name: 'User Demo',
      password: userPassword,
      role: 'USER',
    },
  });

  console.log('✅ Created demo users:');
  console.log('   Manager: manager@optician.pro / manager123');
  console.log('   User: user@optician.pro / user123');

  // Create sample products
  const products = [
    {
      name: 'Lunettes Ray-Ban Aviator',
      sku: 'RB-AV-001',
      brand: 'Ray-Ban',
      price: 159.99,
      costPrice: 80.00,
      quantity: 25,
      reorderPoint: 5,
      reorderQuantity: 20,
      frameMaterial: 'metal',
      frameShape: 'aviator',
      lensType: 'polycarbonate',
      color: 'gold',
      gender: 'unisex',
      templeLength: 140,
      bridgeSize: 14,
      hingeType: 'standard',
      supplierName: 'Luxottica France',
      supplierContact: 'contact@luxottica.fr',
    },
    {
      name: 'Lunettes Oakley Holbrook',
      sku: 'OK-HB-001',
      brand: 'Oakley',
      price: 189.99,
      costPrice: 95.00,
      quantity: 18,
      reorderPoint: 5,
      reorderQuantity: 15,
      frameMaterial: 'plastic',
      frameShape: 'rectangular',
      lensType: 'polycarbonate',
      color: 'black',
      gender: 'men',
      templeLength: 137,
      bridgeSize: 17,
      hingeType: 'spring-loaded',
      supplierName: 'Oakley Europe',
      supplierContact: 'sales@oakley.eu',
    },
    {
      name: 'Lunettes Chanel 3281',
      sku: 'CH-3281-001',
      brand: 'Chanel',
      price: 450.00,
      costPrice: 225.00,
      quantity: 8,
      reorderPoint: 3,
      reorderQuantity: 10,
      frameMaterial: 'acetate',
      frameShape: 'cat-eye',
      lensType: 'progressive',
      color: 'black',
      gender: 'women',
      templeLength: 140,
      bridgeSize: 16,
      hingeType: 'flexible',
      supplierName: 'Chanel France',
      supplierContact: 'optique@chanel.fr',
    },
  ];

  for (const productData of products) {
    await prisma.product.create({
      data: {
        ...productData,
        userId: manager.id,
        imageSrc: null,
      },
    });
  }

  console.log('✅ Created 3 sample products');

  // Create sample customer
  const customer = await prisma.customer.create({
    data: {
      firstName: 'Marie',
      lastName: 'Dupont',
      email: 'marie.dupont@email.fr',
      phone: '+33 6 12 34 56 78',
      address: '15 Rue de la Paix',
      city: 'Paris',
      postalCode: '75002',
      birthDate: new Date('1985-03-15'),
      notes: 'Client régulier, préfère les montures légères',
      insuranceProvider: 'Mutuelle Générale',
      insuranceNumber: 'MG123456789',
      userId: manager.id,
    },
  });

  console.log('✅ Created sample customer: Marie Dupont');

  // Create sample prescription
  await prisma.prescription.create({
    data: {
      customerId: customer.id,
      userId: manager.id,
      prescriptionDate: new Date('2025-01-15'),
      expiryDate: new Date('2027-01-15'),
      prescribedBy: 'Dr. Martin',
      odSph: '-2.50',
      odCyl: '-0.75',
      odAxis: '180',
      odAdd: '+2.00',
      odPd: '32',
      osSph: '-2.25',
      osCyl: '-0.50',
      osAxis: '175',
      osAdd: '+2.00',
      osPd: '31',
      nearPd: '30',
      lensTypeRecommended: 'Progressifs haut de gamme',
      notes: 'Client sensible aux verres',
    },
  });

  console.log('✅ Created sample prescription');

  // Create sample quote
  const quote = await prisma.quote.create({
    data: {
      quoteNumber: 'QT-2025-0001',
      customerId: customer.id,
      userId: manager.id,
      subtotal: 609.99,
      taxRate: 20,
      taxAmount: 122.00,
      total: 731.99,
      validUntil: new Date('2025-03-15'),
      notes: 'Devis pour nouvelles lunettes',
      terms: 'Validité 30 jours',
      status: 'DRAFT',
      items: {
        create: [
          {
            description: 'Lunettes Chanel 3281',
            quantity: 1,
            unitPrice: 450.00,
            discount: 0,
            total: 450.00,
          },
          {
            description: 'Verres progressifs anti-reflet',
            quantity: 2,
            unitPrice: 79.99,
            discount: 0,
            total: 159.99,
          },
        ],
      },
    },
  });

  console.log('✅ Created sample quote: QT-2025-0001');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\nYou can now log in with:');
  console.log('  Email: manager@optician.pro');
  console.log('  Password: manager123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
