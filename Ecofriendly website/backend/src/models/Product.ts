import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description?: string;
  category: string;
  price: number;
  size: string;
  material?: string;
  color?: string;
  stockQuantity: number;
  image?: string;
  imagePublicId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [1, 'Product name cannot be empty'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a non-negative number'],
    },
    size: {
      type: String,
      required: [true, 'Size is required'],
      trim: true,
    },
    material: {
      type: String,
      trim: true,
      default: '100% Sugarcane Bagasse',
    },
    color: {
      type: String,
      trim: true,
      default: 'Natural Ivory',
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock quantity cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value for stock quantity',
      },
      default: 0,
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    imagePublicId: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for imageUrl alias
productSchema.virtual('imageUrl').get(function () {
  return this.image;
});

// Compound index for querying active products sorted by creation time
productSchema.index({ isActive: 1, category: 1, createdAt: -1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;
