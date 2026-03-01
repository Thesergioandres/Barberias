import mongoose, { type Model } from 'mongoose';

type ServiceDocument = {
  tenantId: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const serviceSchema = new mongoose.Schema<ServiceDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    durationMinutes: { type: Number, required: true },
    price: { type: Number, required: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const ServiceModel: Model<ServiceDocument> =
  (mongoose.models.Service as Model<ServiceDocument>) ||
  mongoose.model('Service', serviceSchema);
