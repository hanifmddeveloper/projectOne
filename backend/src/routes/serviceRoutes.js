const express = require('express');
const router = express.Router();
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getServices);
router.get('/:idOrSlug', getService);
router.post('/', protect, authorize('doctor', 'admin'), createService);
router.put('/:id', protect, authorize('doctor', 'admin'), updateService);
router.delete('/:id', protect, authorize('doctor', 'admin'), deleteService);

module.exports = router;
