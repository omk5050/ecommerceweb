import mongoose, { Document, Schema } from 'mongoose';

export type AdminRole = 'admin';

export interface IAdmin extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: [true, 'Admin name is required'],
      trim: true,
      minlength: [1, 'Admin name cannot be empty'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    // passwordHash is excluded from query results by default via select: false
    // This ensures it is NEVER accidentally returned through API responses
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin'] satisfies AdminRole[],
      default: 'admin',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: false,
      transform: (_doc, ret) => {
        // Defensive: ensure passwordHash is stripped even if select: false is bypassed
        delete (ret as Record<string, unknown>).passwordHash;
        return ret;
      },
    },
    toObject: {
      virtuals: false,
      transform: (_doc, ret) => {
        delete (ret as Record<string, unknown>).passwordHash;
        return ret;
      },
    },
  }
);

export const Admin = mongoose.model<IAdmin>('Admin', adminSchema);
export default Admin;
