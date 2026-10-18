import { Router, Request, Response, NextFunction } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  deleteProductImage,
} from '../controllers/productController';
import { uploadSingleImage } from '../middleware/upload';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

/**
 * Inline middleware: protects the includeInactive=true query parameter.
 * If a request arrives with includeInactive=true and the user is NOT an
 * authenticated admin, the request is rejected with 401.
 * Public requests (includeInactive not set or false) pass through normally.
 */
const guardIncludeInactive = (req: Request, res: Response, next: NextFunction): void => {
  if (req.query.includeInactive === 'true') {
    // Delegate to requireAuth, then requireAdmin
    requireAuth(req, res, (authErr?: any) => {
      if (authErr) return next(authErr);
      requireAdmin(req, res, next);
    });
  } else {
    next();
  }
};

// ── Public product reads (with includeInactive guard) ──────────────────────
router.get('/', guardIncludeInactive, getProducts);
router.get('/:id', getProductById);

// ── Protected product mutations (admin only) ───────────────────────────────
router.post('/', requireAuth, requireAdmin, createProduct);
router.put('/:id', requireAuth, requireAdmin, updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

// ── Protected Cloudinary image management (admin only) ────────────────────
router.post('/:id/image', requireAuth, requireAdmin, uploadSingleImage('image'), uploadProductImage);
router.delete('/:id/image', requireAuth, requireAdmin, deleteProductImage);

export default router;
