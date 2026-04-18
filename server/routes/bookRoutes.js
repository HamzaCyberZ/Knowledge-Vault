const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bookController = require('../controllers/bookController');
const { protect, adminOnly, requireSubscription } = require('../middleware/auth');

// 📁 File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'coverImage') {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
  } else if (file.fieldname === 'pdfFile') {
    if (!file.originalname.match(/\.(pdf)$/)) {
      return cb(new Error('Only PDF files are allowed!'), false);
    }
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50000000 },
});

const uploadFields = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 },
]);

// 🛣️ Public routes
router.get('/', bookController.getBooks);
router.get('/recommendations', protect, bookController.getRecommendations);
router.get('/similar/:bookId', bookController.getSimilarBooks);
router.get('/:id', bookController.getBook);

// 🛣️ Protected routes
router.get('/:id/download', protect, bookController.downloadBook);

// 🛣️ Admin routes
router.post('/', protect, adminOnly, uploadFields, bookController.createBook);
router.put('/:id', protect, adminOnly, uploadFields, bookController.updateBook);
router.delete('/:id', protect, adminOnly, bookController.deleteBook);

module.exports = router;