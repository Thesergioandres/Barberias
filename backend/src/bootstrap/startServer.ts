import mongoose from 'mongoose';
import webpush from 'web-push';
import { v2 as cloudinary } from 'cloudinary';
import { createApp } from '../app/createApp';
import { seedMongoData } from './seedMongoData';
import { createLogger } from '../shared/infrastructure/logging/logger';
import type { Env } from '../config/env';
import type { Logger } from 'pino';

export async function startServer({ env, logger }: { env: Env; logger: Logger }) {
  const runtimeLogger = logger || createLogger({ level: env.logLevel, nodeEnv: env.nodeEnv });
  let mongoConnected = false;

  if (env.vapidPublicKey && env.vapidPrivateKey && env.vapidSubject) {
    webpush.setVapidDetails(env.vapidSubject, env.vapidPublicKey, env.vapidPrivateKey);
  }

  if (env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret) {
    cloudinary.config({
      cloud_name: env.cloudinaryCloudName,
      api_key: env.cloudinaryApiKey,
      api_secret: env.cloudinaryApiSecret
    });
  }

  if (env.useMongo) {
    try {
      await mongoose.connect(env.mongodbUri);
      mongoConnected = true;
      await seedMongoData();
    } catch (error) {
      runtimeLogger.warn({ err: error }, 'MongoDB no disponible, continuando con repositorios en memoria');
    }
  } else {
    runtimeLogger.warn('USE_MONGO=false, ejecutando con repositorios en memoria.');
  }

  if (env.enableJobs) {
    const isTsNodeDev = Boolean(process.env.TS_NODE_DEV);
    if (isTsNodeDev) {
      if (env.whatsappProvider === 'bullmq') {
        require('../jobs/whatsappQueue');
      }
      require('../jobs/appointmentReminders');
      const { initTenantSuspensionJobs } = require('../jobs/tenantSuspension');
      initTenantSuspensionJobs();
    } else {
      if (env.whatsappProvider === 'bullmq') {
        await import('../jobs/whatsappQueue.js');
      }
      await import('../jobs/appointmentReminders.js');
      const { initTenantSuspensionJobs } = await import('../jobs/tenantSuspension.js');
      initTenantSuspensionJobs();
    }
  }

  const app = createApp({ env, logger: runtimeLogger, persistence: { useMongo: mongoConnected } });

  return new Promise((resolve) => {
    const server = app.listen(env.port, () => {
      runtimeLogger.info({ port: env.port, mongoConnected }, 'Backend running');
      resolve(server);
    });
  });
}
