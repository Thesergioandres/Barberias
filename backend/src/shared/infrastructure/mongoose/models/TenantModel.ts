import mongoose, { type Model } from 'mongoose';
import { PlanType, TenantStatus } from '../../../../modules/tenants/domain/enums/TenantEnums';

type TenantDocument = {
  name: string;
  slug: string;
  planType: PlanType;
  status: TenantStatus;
  config: {
    bufferTimeMinutes: number;
    requirePaymentForNoShows: boolean;
    maxNoShowsBeforePayment: number;
  };
  createdAt: Date;
  updatedAt: Date;
};

const tenantSchema = new mongoose.Schema<TenantDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    planType: {
      type: String,
      enum: Object.values(PlanType),
      default: PlanType.BASIC
    },
    status: {
      type: String,
      enum: Object.values(TenantStatus),
      default: TenantStatus.ACTIVE,
      index: true
    },
    config: {
      bufferTimeMinutes: { type: Number, default: 10 },
      requirePaymentForNoShows: { type: Boolean, default: false },
      maxNoShowsBeforePayment: { type: Number, default: 3 }
    }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export const TenantModel: Model<TenantDocument> =
  (mongoose.models.Tenant as Model<TenantDocument>) ||
  mongoose.model('Tenant', tenantSchema);
