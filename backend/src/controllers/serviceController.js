const Service = require('../models/Service');

// @desc    Get all active services
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    const services = await Service.find(filter).sort({ isPopular: -1, createdAt: 1 });
    res.json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service by slug or id
// @route   GET /api/services/:idOrSlug
// @access  Public
exports.getService = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let service;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      service = await Service.findById(idOrSlug);
    } else {
      service = await Service.findOne({ slug: idOrSlug });
    }

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({
      success: true,
      service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new medical service
// @route   POST /api/services
// @access  Private (Doctor/Admin)
exports.createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({
      success: true,
      service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update medical service
// @route   PUT /api/services/:id
// @access  Private (Doctor/Admin)
exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({
      success: true,
      service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete or deactivate service
// @route   DELETE /api/services/:id
// @access  Private (Doctor/Admin)
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
