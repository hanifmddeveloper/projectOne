const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const User = require('../models/User');

// Default clinic schedule slots
const ALL_SLOTS = [
  '09:00 AM - 09:30 AM',
  '09:30 AM - 10:00 AM',
  '10:30 AM - 11:00 AM',
  '11:30 AM - 12:00 PM',
  '02:00 PM - 02:30 PM',
  '03:00 PM - 03:30 PM',
  '04:30 PM - 05:00 PM',
  '05:30 PM - 06:00 PM',
];

// @desc    Get available slots for a particular date
// @route   GET /api/appointments/available-slots
// @access  Public
exports.getAvailableSlots = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Please provide a date query parameter (YYYY-MM-DD)' });
    }

    // Find all appointments already booked for that date that are not cancelled
    const bookedAppointments = await Appointment.find({
      date,
      status: { $ne: 'cancelled' },
    }).select('timeSlot');

    const bookedSlots = bookedAppointments.map((app) => app.timeSlot);
    const availableSlots = ALL_SLOTS.filter((slot) => !bookedSlots.includes(slot));

    res.json({
      success: true,
      date,
      allSlots: ALL_SLOTS,
      bookedSlots,
      availableSlots,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient or Doctor)
exports.createAppointment = async (req, res, next) => {
  try {
    const {
      serviceId,
      date,
      timeSlot,
      consultationType,
      symptoms,
      patientName,
      patientEmail,
      patientPhone,
    } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Selected medical service not found' });
    }

    // Check if slot is already occupied
    const slotTaken = await Appointment.findOne({
      date,
      timeSlot,
      status: { $ne: 'cancelled' },
    });

    if (slotTaken) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already reserved. Please select another slot or time.',
      });
    }

    // Find default doctor
    const doctor = await User.findOne({ role: 'doctor' });

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctor ? doctor._id : undefined,
      service: service._id,
      patientName: patientName || req.user.name,
      patientEmail: patientEmail || req.user.email,
      patientPhone: patientPhone || req.user.phone || '',
      date,
      timeSlot,
      consultationType: consultationType || 'In-Person Clinic Visit',
      symptoms,
      paymentAmount: service.price,
      telehealthRoomId: consultationType === 'Telemedicine Video Call' ? `room-${Date.now()}` : '',
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('service', 'title category price durationMinutes icon')
      .populate('doctor', 'name doctorProfile');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      appointment: populatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments for the current logged in patient
// @route   GET /api/appointments/my-appointments
// @access  Private (Patient)
exports.getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('service', 'title category price durationMinutes icon')
      .populate('doctor', 'name doctorProfile avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments (Doctor/Admin view)
// @route   GET /api/appointments
// @access  Private (Doctor/Admin)
exports.getAllAppointments = async (req, res, next) => {
  try {
    const { status, date, search } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (date) {
      query.date = date;
    }

    if (search) {
      query.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { patientEmail: { $regex: search, $options: 'i' } },
        { patientPhone: { $regex: search, $options: 'i' } },
      ];
    }

    const appointments = await Appointment.find(query)
      .populate('service', 'title category price durationMinutes')
      .populate('patient', 'name email phone bloodGroup')
      .sort({ date: -1, timeSlot: 1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single appointment details
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('service')
      .populate('patient', 'name email phone bloodGroup allergies chronicConditions')
      .populate('doctor', 'name doctorProfile avatar');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Verify patient or doctor
    if (
      req.user.role === 'patient' &&
      appointment.patient._id.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this appointment' });
    }

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status or doctor notes
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor/Admin)
exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, doctorNotes, paymentStatus } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (status) appointment.status = status;
    if (doctorNotes !== undefined) appointment.doctorNotes = doctorNotes;
    if (paymentStatus) appointment.paymentStatus = paymentStatus;

    await appointment.save();

    const updated = await Appointment.findById(appointment._id)
      .populate('service')
      .populate('patient', 'name email phone');

    res.json({
      success: true,
      message: `Appointment updated to ${appointment.status}`,
      appointment: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an appointment (by patient)
// @route   PUT /api/appointments/:id/cancel
// @access  Private (Patient)
exports.cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.patient.toString() !== req.user.id.toString() && req.user.role !== 'doctor') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment has been cancelled',
      appointment,
    });
  } catch (error) {
    next(error);
  }
};
