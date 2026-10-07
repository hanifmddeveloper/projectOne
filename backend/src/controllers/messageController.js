const Message = require('../models/Message');

// @desc    Submit a contact inquiry or question to doctor
// @route   POST /api/messages
// @access  Public (or Private if logged in)
exports.createMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const messageDoc = await Message.create({
      name,
      email,
      phone,
      subject,
      message,
      patient: req.user ? req.user.id : undefined,
    });

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted. Dr. Jenkins office will reach out shortly.',
      data: messageDoc,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all messages (Doctor view)
// @route   GET /api/messages
// @access  Private (Doctor/Admin)
exports.getAllMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to patient message
// @route   PUT /api/messages/:id/reply
// @access  Private (Doctor/Admin)
exports.replyMessage = async (req, res, next) => {
  try {
    const { replyText } = req.body;

    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.replyText = replyText;
    message.status = 'replied';
    message.repliedAt = new Date();
    await message.save();

    res.json({
      success: true,
      message: 'Reply sent successfully',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};
