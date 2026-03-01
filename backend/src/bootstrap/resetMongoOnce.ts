import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { UserModel } from '../shared/infrastructure/mongoose/models/UserModel';

async function resetDatabase() {
  await mongoose.connect(env.mongodbUri);
  await mongoose.connection.dropDatabase();

  await UserModel.create({
    name: 'God Root',
    email: 'Serguito2003@gmail.com',
    phone: '+573000000000',
    passwordHash: bcrypt.hashSync('Serra_1707', 10),
    role: 'GOD',
    active: true,
    whatsappConsent: true,
    approved: true,
    tenantId: null,
    branchIds: []
  });

  await mongoose.disconnect();
}

resetDatabase()
  .then(() => {
    console.log('Database reset completed. GOD account created.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database reset failed:', error);
    process.exit(1);
  });
