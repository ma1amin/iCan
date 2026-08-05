const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/lib/auth');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const adminData = {
      username: 'admin',
      email: 'admin@ican.com',
      name: 'Mohammed Al Amin',
      passwordHash: await hashPassword('Security_2026@@##')
    };

    const admin = await prisma.admin.create({
      data: adminData
    });

    console.log('Admin account created successfully:');
    console.log('Username:', admin.username);
    console.log('Email:', admin.email);
    console.log('Name:', admin.name);
  } catch (error) {
    console.error('Error creating admin account:', error);
    if (error.code === 'P2002') {
      console.error('Admin account already exists');
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
