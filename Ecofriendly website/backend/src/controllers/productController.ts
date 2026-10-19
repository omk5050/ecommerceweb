import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../services/cloudinaryService';

/**
 * GET /api/products
 * Retrieve paginated list of products.
 * Default: Returns only active products (isActive: true).
 */
export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const rawLimit = parseInt(req.query.limit as string, 10) || 100;
    const limit = Math.min(100, Math.max(1, rawLimit)); // clamp between 1 and 100
    const skip = (page - 1) * limit;

    const includeInactive = req.query.includeInactive === 'true';
    const filter: Record<string, any> = {};

    if (!includeInactive) {
      filter.isActive = true;
    }

    if (req.query.category && typeof req.query.category === 'string') {
      filter.category = req.query.category.trim();
    }

    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/:id
 * Retrieve a single product by its MongoDB ObjectId.
 */
export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid ID',
        message: 'The provided product ID is not a valid MongoDB ObjectId',
      });
      return;
    }

    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Product not found with the specified ID',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/products
 * Create a new product.
 */
export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      name,
      description,
      category,
      price,
      size,
      material,
      color,
      stockQuantity,
      image,
      imagePublicId,
      isActive,
    } = req.body;

    const validationErrors: string[] = [];

    // Validation: name
    if (typeof name !== 'string' || name.trim().length === 0) {
      validationErrors.push('Product name is required and cannot be empty.');
    }

    // Validation: category
    if (typeof category !== 'string' || category.trim().length === 0) {
      validationErrors.push('Category is required and cannot be empty.');
    }

    // Validation: price
    if (price === undefined || price === null || typeof price !== 'number' || isNaN(price)) {
      validationErrors.push('Price is required and must be a valid number.');
    } else if (price < 0) {
      validationErrors.push('Price cannot be negative.');
    }

    // Validation: size
    if (typeof size !== 'string' || size.trim().length === 0) {
      validationErrors.push('Size/Dimensions are required and cannot be empty.');
    }

    // Validation: stockQuantity
    if (stockQuantity === undefined || stockQuantity === null) {
      validationErrors.push('Stock quantity is required.');
    } else if (typeof stockQuantity !== 'number' || !Number.isInteger(stockQuantity) || stockQuantity < 0) {
      validationErrors.push('Stock quantity must be a non-negative integer.');
    }

    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        error: 'Validation Error',
        messages: validationErrors,
      });
      return;
    }

    const newProduct = await Product.create({
      name: name.trim(),
      description: typeof description === 'string' ? description.trim() : '',
      category: category.trim(),
      price,
      size: size.trim(),
      material: typeof material === 'string' && material.trim() ? material.trim() : '100% Sugarcane Bagasse',
      color: typeof color === 'string' && color.trim() ? color.trim() : 'Natural Ivory',
      stockQuantity,
      image: typeof image === 'string' ? image.trim() : '',
      imagePublicId: typeof imagePublicId === 'string' ? imagePublicId.trim() : '',
      isActive: typeof isActive === 'boolean' ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/products/:id
 * Update an existing product.
 */
export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid ID',
        message: 'The provided product ID is not a valid MongoDB ObjectId',
      });
      return;
    }

    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Product not found with the specified ID',
      });
      return;
    }

    const {
      name,
      description,
      category,
      price,
      size,
      material,
      color,
      stockQuantity,
      image,
      imagePublicId,
      isActive,
    } = req.body;

    const validationErrors: string[] = [];

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        validationErrors.push('Product name cannot be empty.');
      } else {
        product.name = name.trim();
      }
    }

    if (description !== undefined) {
      product.description = typeof description === 'string' ? description.trim() : '';
    }

    if (category !== undefined) {
      if (typeof category !== 'string' || category.trim().length === 0) {
        validationErrors.push('Category cannot be empty.');
      } else {
        product.category = category.trim();
      }
    }

    if (price !== undefined) {
      if (typeof price !== 'number' || isNaN(price) || price < 0) {
        validationErrors.push('Price must be a non-negative number.');
      } else {
        product.price = price;
      }
    }

    if (size !== undefined) {
      if (typeof size !== 'string' || size.trim().length === 0) {
        validationErrors.push('Size cannot be empty.');
      } else {
        product.size = size.trim();
      }
    }

    if (material !== undefined) {
      product.material = typeof material === 'string' ? material.trim() : product.material;
    }

    if (color !== undefined) {
      product.color = typeof color === 'string' ? color.trim() : product.color;
    }

    if (stockQuantity !== undefined) {
      if (typeof stockQuantity !== 'number' || !Number.isInteger(stockQuantity) || stockQuantity < 0) {
        validationErrors.push('Stock quantity must be a non-negative integer.');
      } else {
        product.stockQuantity = stockQuantity;
      }
    }

    if (image !== undefined) {
      product.image = typeof image === 'string' ? image.trim() : '';
    }

    if (imagePublicId !== undefined) {
      product.imagePublicId = typeof imagePublicId === 'string' ? imagePublicId.trim() : '';
    }

    if (isActive !== undefined) {
      if (typeof isActive === 'boolean') {
        product.isActive = isActive;
      }
    }

    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        error: 'Validation Error',
        messages: validationErrors,
      });
      return;
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/products/:id
 * Soft delete product by setting isActive = false.
 */
export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid ID',
        message: 'The provided product ID is not a valid MongoDB ObjectId',
      });
      return;
    }

    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Product not found with the specified ID',
      });
      return;
    }

    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product soft-deleted successfully (isActive set to false)',
      data: {
        id: product._id,
        name: product.name,
        isActive: product.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/products/:id/image
 * Upload and assign an image to a product via Cloudinary.
 */
export const uploadProductImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid ID',
        message: 'The provided product ID is not a valid MongoDB ObjectId',
      });
      return;
    }

    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Product not found with the specified ID',
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'Missing File',
        message: 'No image file provided in request. Please upload an image using multipart/form-data with field name "image".',
      });
      return;
    }

    const oldPublicId = product.imagePublicId;

    // 1. Upload new image to Cloudinary
    let uploadResult;
    try {
      uploadResult = await uploadImageToCloudinary(req.file.buffer, req.file.originalname);
    } catch (uploadError: any) {
      console.error('[Cloudinary] Upload failed:', uploadError);
      res.status(502).json({
        success: false,
        error: 'Cloudinary Upload Failed',
        message: uploadError?.message || 'Failed to upload image to Cloudinary.',
      });
      return;
    }

    // 2. Update MongoDB document only after upload succeeds
    product.image = uploadResult.secureUrl;
    product.imagePublicId = uploadResult.publicId;
    const updatedProduct = await product.save();

    // 3. Clean up previous image if existed
    if (oldPublicId && oldPublicId !== uploadResult.publicId) {
      deleteImageFromCloudinary(oldPublicId)
        .then((deleted) => {
          if (!deleted) {
            console.warn(`[Cloudinary] Old image cleanup warning: Could not delete ${oldPublicId}`);
          }
        })
        .catch((cleanupErr) => {
          console.error(`[Cloudinary] Failed to delete old image ${oldPublicId}:`, cleanupErr);
        });
    }

    res.status(200).json({
      success: true,
      message: 'Product image uploaded and updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/products/:id/image
 * Remove image from Cloudinary and clear product image fields in MongoDB.
 */
export const deleteProductImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid ID',
        message: 'The provided product ID is not a valid MongoDB ObjectId',
      });
      return;
    }

    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Product not found with the specified ID',
      });
      return;
    }

    if (!product.image && !product.imagePublicId) {
      res.status(400).json({
        success: false,
        error: 'No Image',
        message: 'Product does not have an image to delete.',
      });
      return;
    }

    const publicIdToDelete = product.imagePublicId;

    // 1. Delete image from Cloudinary if publicId exists
    if (publicIdToDelete) {
      try {
        await deleteImageFromCloudinary(publicIdToDelete);
      } catch (cloudErr) {
        console.warn(`[Cloudinary] Warning deleting image ${publicIdToDelete}:`, cloudErr);
      }
    }

    // 2. Clear image fields in MongoDB document (product document itself is NOT deleted)
    product.image = '';
    product.imagePublicId = '';
    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: 'Product image deleted successfully from Cloudinary and product updated',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};
