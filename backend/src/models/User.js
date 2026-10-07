const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['patient', 'doctor', 'admin'],
      default: 'patient',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      default: 'Prefer not to say',
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
      default: 'Unknown',
    },
    allergies: {
      type: [String],
      default: [],
    },
    chronicConditions: {
      type: [String],
      default: [],
    },
    emergencyContact: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      relationship: { type: String, default: '' },
    },
    address: {
      type: String,
      default: '',
    },
    doctorProfile: {
      specialization: { type: String, default: 'General Medicine & Cardiology' },
      title: { type: String, default: 'Senior Consultant Physician' },
      qualifications: {
        type: [String],
        default: ['MBBS (Gold Medalist)', 'MD (Internal Medicine)', 'FACC (Fellow American College of Cardiology)'],
      },
      experienceYears: { type: Number, default: 15 },
      bio: {
        type: String,
        default: 'Dedicated to compassionate, evidence-based medical care for patients of all ages, with 15+ years of specialized clinical experience.',
      },
      consultationFee: { type: Number, default: 75 },
      availableDays: {
        type: [String],
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      },
      availableTimeSlots: {
        type: [String],
        default: [
          '09:00 AM - 09:30 AM',
          '09:30 AM - 10:00 AM',
          '10:30 AM - 11:00 AM',
          '11:30 AM - 12:00 PM',
          '02:00 PM - 02:30 PM',
          '03:00 PM - 03:30 PM',
          '04:30 PM - 05:00 PM',
          '05:30 PM - 06:00 PM',
        ],
      },
      clinicAddress: { type: String, default: 'Suite 402, Apex Health Tower, 742 Evergreen Medical Blvd' },
      hospitalAffiliation: { type: String, default: 'St. Jude University Medical Center' },
      languages: { type: [String], default: ['English', 'Spanish', 'French'] },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
