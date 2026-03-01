import mongoose, { type Model } from 'mongoose';

type BranchDocument = {
  tenantId: string;
  name: string;
  address: string;
  phone: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const branchSchema = new mongoose.Schema<BranchDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, default: '' },
    active: { type: Boolean, default: true }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export const BranchModel: Model<BranchDocument> =
  (mongoose.models.Branch as Model<BranchDocument>) ||
  mongoose.model('Branch', branchSchema);
