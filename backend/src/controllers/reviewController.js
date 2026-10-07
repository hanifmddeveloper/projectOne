const Review = require('../models/Review');

// @desc    Get all approved reviews for public testimonials
// @route   GET /api/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });

    // Calculate average rating
    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1)
        : '5.0';

    res.json({
      success: true,
      count: reviews.length,
      averageRating: avgRating,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a patient review
// @route   POST /api/reviews
// @access  Private (Patient)
exports.createReview = async (req, res, next) => {
  try {
    const { rating, comment, treatmentReceived } = req.body;

    const review = await Review.create({
      patient: req.user.id,
      patientName: req.user.name,
      rating: Number(rating),
      comment,
      treatmentReceived: treatmentReceived || 'General Health Consultation',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted.',
      review,
    });
  } catch (error) {
    next(error);
  }
};
