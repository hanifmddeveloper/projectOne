const express = require('express');
const router = express.Router();
const {
  createMessage,
  getAllMessages,
  replyMessage,
} = require('../controllers/messageController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', createMessage);
router.get('/', protect, authorize('doctor', 'admin'), getAllMessages);
router.put('/:id/reply', protect, authorize('doctor', 'admin'), replyMessage);

module.exports = router;
