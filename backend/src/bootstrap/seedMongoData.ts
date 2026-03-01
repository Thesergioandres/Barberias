import bcrypt from 'bcryptjs';
import { UserModel } from '../shared/infrastructure/mongoose/models/UserModel';
import { ServiceModel } from '../shared/infrastructure/mongoose/models/ServiceModel';
import { AppointmentModel } from '../shared/infrastructure/mongoose/models/AppointmentModel';

async function ensureUser({
  name,
  email,
  phone,
  password,
  role,
  whatsappConsent,
  approved
}: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'GOD' | 'ADMIN' | 'BARBER' | 'CLIENT';
  whatsappConsent: boolean;
  approved: boolean;
}) {
  const existing = await UserModel.findOne({ email });
  if (existing) {
    return existing;
  }

  return UserModel.create({
    name,
    email,
    phone,
    passwordHash: bcrypt.hashSync(password, 10),
    role,
    active: true,
    whatsappConsent,
    approved
  });
}

export async function seedMongoData() {
  await ensureUser({
    name: 'God Root',
    email: 'god@barberia.com',
    phone: '+573000000000',
    password: 'god123',
    role: 'GOD',
    whatsappConsent: true,
    approved: true
  });

  const admin = await ensureUser({
    name: 'Administrador',
    email: 'admin@barberia.com',
    phone: '+573000000001',
    password: 'admin123',
    role: 'ADMIN',
    whatsappConsent: true,
    approved: true
  });

  const barber = await ensureUser({
    name: 'Barbero Demo',
    email: 'barbero@barberia.com',
    phone: '+573000000002',
    password: 'barbero123',
    role: 'BARBER',
    whatsappConsent: true,
    approved: true
  });

  const client = await ensureUser({
    name: 'Cliente Demo',
    email: 'cliente@barberia.com',
    phone: '+573000000003',
    password: 'cliente123',
    role: 'CLIENT',
    whatsappConsent: true,
    approved: true
  });

  const serviceCount = await ServiceModel.countDocuments();
  if (serviceCount === 0) {
    await ServiceModel.insertMany([
      {
        name: 'Corte clásico',
        description: 'Corte tradicional con máquina y tijera.',
        durationMinutes: 30,
        price: 12,
        active: true
      },
      {
        name: 'Barba premium',
        description: 'Perfilado y arreglo de barba.',
        durationMinutes: 25,
        price: 10,
        active: true
      }
    ]);
  }

  const appointmentCount = await AppointmentModel.countDocuments();
  if (appointmentCount === 0) {
    const firstService = await ServiceModel.findOne();
    if (firstService) {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      tomorrow.setHours(10, 0, 0, 0);

      await AppointmentModel.create({
        clientId: admin._id.toString(),
        barberId: barber._id.toString(),
        serviceId: firstService._id.toString(),
        startAt: tomorrow,
        endAt: new Date(tomorrow.getTime() + firstService.durationMinutes * 60 * 1000),
        status: 'PENDIENTE',
        notes: 'Seed appointment'
      });
    }
  }

  return { admin, barber, client };
}
