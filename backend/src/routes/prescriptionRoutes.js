const express = require('express');
const router = express.Router();
const {
  createPrescription,
  getMyPrescriptions,
  getAllPrescriptions,
  getPrescriptionById,
} = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('doctor', 'admin'), createPrescription);
router.get('/my-prescriptions', protect, getMyPrescriptions);
router.get('/', protect, authorize('doctor', 'admin'), getAllPrescriptions);
router.get('/:id', protect, getPrescriptionById);

module.exports = router;
