import mongoose, { type Model } from 'mongoose';

type BarberScheduleDocument = {
  barberId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  createdAt: Date;
  updatedAt: Date;
};

type BarberBlockDocument = {
  barberId: string;
  startAt: Date;
  endAt: Date;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
};

const barberScheduleSchema = new mongoose.Schema<BarberScheduleDocument>(
  {
    barberId: { type: String, required: true, index: true },
    dayOfWeek: { type: Number, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
  },
  { timestamps: true }
);

barberScheduleSchema.index({ barberId: 1, dayOfWeek: 1 }, { unique: true });

const barberBlockSchema = new mongoose.Schema<BarberBlockDocument>(
  {
    barberId: { type: String, required: true, index: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    reason: { type: String, default: '' }
  },
  { timestamps: true }
);

export const BarberScheduleModel: Model<BarberScheduleDocument> =
  (mongoose.models.BarberSchedule as Model<BarberScheduleDocument>) ||
  mongoose.model('BarberSchedule', barberScheduleSchema);

export const BarberBlockModel: Model<BarberBlockDocument> =
  (mongoose.models.BarberBlock as Model<BarberBlockDocument>) ||
  mongoose.model('BarberBlock', barberBlockSchema);
