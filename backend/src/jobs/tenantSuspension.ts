import { Queue, Worker, type Job } from 'bullmq';
import mongoose from 'mongoose';
import { redisConnectionOptions } from '../config/redis';
import { TenantModel } from '../shared/infrastructure/mongoose/models/TenantModel';
import { database } from '../shared/infrastructure/memory/database';
import { TenantStatus } from '../modules/tenants/domain/enums/TenantEnums';

const JOB_NAME = 'suspend-expired-tenants';

export async function suspendExpiredTenants() {
  const now = new Date();

  if (mongoose.connection.readyState === 1) {
    await TenantModel.updateMany(
      { status: TenantStatus.ACTIVE, validUntil: { $lt: now } },
      { $set: { status: TenantStatus.SUSPENDED } }
    );
    return;
  }

  database.tenants = database.tenants.map((tenant) => {
    if (tenant.status === TenantStatus.ACTIVE && tenant.validUntil && new Date(tenant.validUntil) < now) {
      return { ...tenant, status: TenantStatus.SUSPENDED };
    }
    return tenant;
  });
}

export function initTenantSuspensionJobs() {
  const connection = redisConnectionOptions;
  const tenantSuspensionQueue = new Queue('tenant-suspensions', { connection });

  const worker = new Worker(
    'tenant-suspensions',
    async (_job: Job) => {
      await suspendExpiredTenants();
    },
    { connection }
  );

  worker.on('failed', (job, err) => {
    console.error('Tenant suspension worker failed:', job?.id, err.message);
  });

  const ensureRepeatableJob = async () => {
    const existing = await tenantSuspensionQueue.getRepeatableJobs();
    const alreadyScheduled = existing.some((item) => item.name === JOB_NAME);
    if (!alreadyScheduled) {
      await tenantSuspensionQueue.add(JOB_NAME, {}, { repeat: { pattern: '0 0 * * *' } });
    }
  };

  ensureRepeatableJob().catch((err: Error) => {
    console.error('Failed to schedule tenant suspension job:', err.message);
  });
}
