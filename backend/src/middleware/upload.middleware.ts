import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req, file) => {
    return {
      folder: 'rewear/clothing',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      public_id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
