import { UploadApiResponse } from 'cloudinary';
import cloudinary from '../config/cloudinary';

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
}

const CLOUDINARY_FOLDER = 'earthform/products';

/**
 * Upload an in-memory image buffer to Cloudinary in the 'earthform/products' folder.
 */
export const uploadImageToCloudinary = (
  fileBuffer: Buffer,
  originalFilename?: string
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        resource_type: 'image',
        // Optional original filename hint
        public_id: originalFilename
          ? `${Date.now()}_${originalFilename.replace(/[^a-zA-Z0-9]/g, '_')}`
          : undefined,
      },
      (error: any, result?: UploadApiResponse) => {
        if (error || !result) {
          console.error('[Cloudinary] Upload stream error:', error);
          return reject(new Error(error?.message || 'Failed to upload image to Cloudinary.'));
        }

        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete an image from Cloudinary by its public ID.
 */
export const deleteImageFromCloudinary = async (publicId: string): Promise<boolean> => {
  if (!publicId) return false;

  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    console.log(`[Cloudinary] Image destroy result for ${publicId}:`, result);
    return result.result === 'ok' || result.result === 'not found';
  } catch (error) {
    console.error(`[Cloudinary] Error destroying image with public ID ${publicId}:`, error);
    return false;
  }
};
