import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(`Unsupported file type: ${file.mimetype}. Allowed types are JPEG, PNG, and WEBP.`);
    (error as any).code = 'INVALID_FILE_TYPE';
    cb(error);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter,
});

/**
 * Middleware wrapper to handle Multer errors with clean JSON responses
 */
export const uploadSingleImage = (fieldName: string = 'image') => {
  const multerHandler = upload.single(fieldName);

  return (req: Request, res: Response, next: NextFunction): void => {
    multerHandler(req, res, (err: any) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({
            success: false,
            error: 'File Too Large',
            message: `File size exceeds the 5 MB limit. Please upload an image under 5 MB.`,
          });
          return;
        }

        if (err.code === 'INVALID_FILE_TYPE') {
          res.status(400).json({
            success: false,
            error: 'Invalid File Type',
            message: err.message,
          });
          return;
        }

        res.status(400).json({
          success: false,
          error: 'Upload Error',
          message: err.message || 'Error parsing multipart form data.',
        });
        return;
      }

      next();
    });
  };
};

export default uploadSingleImage;
