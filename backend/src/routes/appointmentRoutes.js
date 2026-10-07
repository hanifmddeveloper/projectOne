const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  getAvailableSlots,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/available-slots', getAvailableSlots);
router.post('/', protect, createAppointment);
router.get('/my-appointments', protect, getMyAppointments);
router.get('/', protect, authorize('doctor', 'admin'), getAllAppointments);
router.get('/:id', protect, getAppointmentById);
router.put('/:id/status', protect, authorize('doctor', 'admin'), updateAppointmentStatus);
router.put('/:id/cancel', protect, cancelAppointment);

module.exports = router;
