const express = require('express');
const router = express.Router();
const {
  getAds,
  getAdById,
  createAd,
  updateAd,
  deleteAd,
  getAdsByUser,
} = require('../controllers/adController');
const { protect } = require('../middleware/authMiddleware');
const { upload, handleUploadError } = require('../middleware/uploadMiddleware');

router.route('/').get(getAds).post(protect, upload.array('images', 5), createAd);
router.route('/user/:userId').get(getAdsByUser);
router
  .route('/:id')
  .get(getAdById)
  .put(protect, updateAd)
  .delete(protect, deleteAd);

// Error handling middleware for upload errors
router.use(handleUploadError);

module.exports = router;
