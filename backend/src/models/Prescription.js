const mongoose = require('mongoose');

const medicineItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true }, // e.g. "500 mg", "1 tablet"
  frequency: { type: String, required: true }, // e.g. "1-0-1 (Morning & Night)", "Once daily"
  duration: { type: String, required: true }, // e.g. "7 days", "1 month"
  instructions: { type: String, default: 'Take with or after food' },
});

const prescriptionSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    diagnosis: {
      type: String,
      required: [true, 'Please provide primary diagnosis'],
    },
    symptomsObserved: {
      type: String,
      default: '',
    },
    vitals: {
      bloodPressure: { type: String, default: '120/80 mmHg' },
      pulseRate: { type: String, default: '72 bpm' },
      temperature: { type: String, default: '98.6 °F' },
      weightKg: { type: String, default: '70 kg' },
    },
    medicines: [medicineItemSchema],
    testsRecommended: {
      type: [String],
      default: [],
    },
    advice: {
      type: String,
      default: 'Rest adequately, drink plenty of fluids, and monitor symptoms.',
    },
    followUpDate: {
      type: String, // YYYY-MM-DD
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Prescription', prescriptionSchema);
