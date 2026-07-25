const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const auth = require('../middleware/authMiddleware');

router.get('/', calendarController.getAllEvents);
router.post('/', auth.protect, calendarController.createEvent);
router.put('/:id', auth.protect, calendarController.updateEvent);
router.delete('/:id', auth.protect, calendarController.deleteEvent);

module.exports = router;
