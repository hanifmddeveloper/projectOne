const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    patientEmail: {
      type: String,
      required: true,
    },
    patientPhone: {
      type: String,
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD format
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    consultationType: {
      type: String,
      enum: ['In-Person Clinic Visit', 'Telemedicine Video Call'],
      default: 'In-Person Clinic Visit',
    },
    symptoms: {
      type: String,
      required: [true, 'Please briefly describe your symptoms or reason for visit'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    doctorNotes: {
      type: String,
      default: '',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'insurance_verified'],
      default: 'unpaid',
    },
    paymentAmount: {
      type: Number,
      default: 0,
    },
    telehealthRoomId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
