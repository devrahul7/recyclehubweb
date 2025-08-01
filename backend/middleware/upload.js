import multer from 'multer';
import path from 'path';
import { AppError } from './errorHandler.js';

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed!', 400), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: fileFilter
});

// Single file upload middleware
export const uploadSingle = upload.single('image');

// Multiple files upload middleware
export const uploadMultiple = upload.array('images', 5);

// Specific field upload middleware
export const uploadFields = upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'itemImages', maxCount: 5 },
  { name: 'document', maxCount: 1 }
]);

// Error handling for upload middleware
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large',
        error: 'File size should be less than 5MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files',
        error: 'Maximum 5 files allowed'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field',
        error: 'Invalid file upload'
      });
    }
  }
  next(err);
};

// Image optimization middleware (placeholder for future implementation)
export const optimizeImage = (req, res, next) => {
  // This would integrate with sharp or similar library for image optimization
  // For now, just pass through
  next();
};

// File validation middleware
export const validateFile = (req, res, next) => {
  if (!req.file && !req.files) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded',
      error: 'Please upload a file'
    });
  }
  next();
};

// Clean up uploaded files on error
export const cleanupUploads = (req, res, next) => {
  res.on('finish', () => {
    // Clean up temporary files if response indicates error
    if (res.statusCode >= 400 && req.file) {
      // Implementation for file cleanup
    }
  });
  next();
};

export default upload; 