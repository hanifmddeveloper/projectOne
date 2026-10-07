const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');

// @desc    Create a new prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor)
exports.createPrescription = async (req, res, next) => {
  try {
    const {
      appointmentId,
      patientId,
      diagnosis,
      symptomsObserved,
      vitals,
      medicines,
      testsRecommended,
      advice,
      followUpDate,
    } = req.body;

    let targetPatientId = patientId;

    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId);
      if (appointment) {
        targetPatientId = targetPatientId || appointment.patient;
        appointment.status = 'completed';
        await appointment.save();
      }
    }

    if (!targetPatientId) {
      return res.status(400).json({ success: false, message: 'Please specify patient for prescription' });
    }

    const prescription = await Prescription.create({
      appointment: appointmentId,
      patient: targetPatientId,
      doctor: req.user.id,
      diagnosis,
      symptomsObserved,
      vitals,
      medicines: medicines || [],
      testsRecommended: testsRecommended || [],
      advice,
      followUpDate,
    });

    const populated = await Prescription.findById(prescription._id)
      .populate('patient', 'name email phone bloodGroup')
      .populate('doctor', 'name doctorProfile avatar')
      .populate('appointment');

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      prescription: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get prescriptions for current patient
// @route   GET /api/prescriptions/my-prescriptions
// @access  Private (Patient)
exports.getMyPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user.id })
      .populate('doctor', 'name doctorProfile avatar')
      .populate('appointment', 'date timeSlot service')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: prescriptions.length,
      prescriptions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all prescriptions (Doctor view)
// @route   GET /api/prescriptions
// @access  Private (Doctor/Admin)
exports.getAllPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('patient', 'name email phone bloodGroup')
      .populate('doctor', 'name')
      .populate('appointment', 'date timeSlot')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: prescriptions.length,
      prescriptions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single prescription by id
// @route   GET /api/prescriptions/:id
// @access  Private
exports.getPrescriptionById = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'name email phone bloodGroup address allergies')
      .populate('doctor', 'name doctorProfile avatar phone')
      .populate('appointment');

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    // Check authorization
    if (
      req.user.role === 'patient' &&
      prescription.patient._id.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this prescription' });
    }

    res.json({
      success: true,
      prescription,
    });
  } catch (error) {
    next(error);
  }
};
