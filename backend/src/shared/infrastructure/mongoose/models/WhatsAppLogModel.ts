import mongoose, { type Model } from 'mongoose';

type WhatsAppLogDocument = {
  tenantId: string;
  appointmentId?: string | null;
  event: string;
  roleTarget: string;
  phone: string;
  message: string;
  status: 'ENVIADO' | 'FALLIDO' | 'PENDIENTE';
  error?: string | null;
  createdAt: Date;
};

const whatsappLogSchema = new mongoose.Schema<WhatsAppLogDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    appointmentId: { type: String, default: null, index: true },
    event: { type: String, required: true, index: true },
    roleTarget: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['ENVIADO', 'FALLIDO', 'PENDIENTE'], required: true },
    error: { type: String, default: null }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

export const WhatsAppLogModel: Model<WhatsAppLogDocument> =
  (mongoose.models.WhatsAppLog as Model<WhatsAppLogDocument>) ||
  mongoose.model('WhatsAppLog', whatsappLogSchema);
