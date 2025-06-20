const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

console.log(process.env.CLOUDINARY_API_KEY);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'campus-marketplace',
    format: async (req, file) => 'jpg', 
    public_id: (req, file) => file.originalname,
    transformation: [
      { width: 800, height: 800, crop: 'limit' }, // Resize to max 800x800
      { quality: 'auto:good', fetch_format: 'auto' }, // Auto-compress with good quality
      { strip: true } // Remove metadata to reduce file size
    ]
  },
});

// Custom error handling middleware
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum file size is 5MB per image.',
        error: 'FILE_TOO_LARGE'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 5 images allowed.',
        error: 'TOO_MANY_FILES'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field.',
        error: 'UNEXPECTED_FILE'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files (JPG, PNG, GIF, WebP) are allowed.',
      error: 'INVALID_FILE_TYPE'
    });
  }
  
  // Generic error
  return res.status(500).json({
    success: false,
    message: 'File upload failed. Please try again.',
    error: 'UPLOAD_ERROR'
  });
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Max 5 files
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed!'), false);
      return;
    }
    
    // Check file size before upload (additional safety check)
    if (file.size > 5 * 1024 * 1024) {
      cb(new Error('File too large. Maximum file size is 5MB.'), false);
      return;
    }
    
    // Allow the file
    cb(null, true);
  }
});

module.exports = { upload, handleUploadError }; 