const express = require('express');
const router = express.Router();
const multer = require('multer');
const mediaController = require('../controllers/mediaController');
const { protect } = require('../middleware/authMiddleware');

// Multer memory storage (files are stored in RAM to be streamed to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', mediaController.getAllMedia);
router.post('/upload', protect, upload.single('media'), mediaController.uploadMedia);
router.put('/:id', protect, mediaController.updateMedia);
router.delete('/:id', protect, mediaController.deleteMedia);

module.exports = router;
