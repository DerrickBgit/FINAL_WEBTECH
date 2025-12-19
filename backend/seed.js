const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default admin user
  const adminEmail = 'admin@inventory.com';
  const adminPassword = 'admin123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      role: 'admin'
    }
  });

  console.log('Created admin user:', admin.email);
  console.log('Password:', adminPassword);

  // Create a test user
  const testEmail = 'user@inventory.com';
  const testPassword = 'user123';
  const testPasswordHash = await bcrypt.hash(testPassword, 10);

  const testUser = await prisma.user.upsert({
    where: { email: testEmail },
    update: {},
    create: {
      email: testEmail,
      passwordHash: testPasswordHash,
      role: 'user'
    }
  });

  console.log('Created test user:', testUser.email);
  console.log('Password:', testPassword);
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

