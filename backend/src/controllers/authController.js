const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'doctor_portal_super_secret_jwt_key_2026_modern_health',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, bloodGroup, address } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role && ['patient', 'doctor'].includes(role) ? role : 'patient',
      phone: phone || '',
      bloodGroup: bloodGroup || 'Unknown',
      address: address || '',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        avatar: user.avatar,
        doctorProfile: user.doctorProfile,
        allergies: user.allergies,
        chronicConditions: user.chronicConditions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      bloodGroup: req.body.bloodGroup,
      allergies: req.body.allergies,
      chronicConditions: req.body.chronicConditions,
      emergencyContact: req.body.emergencyContact,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
    };

    if (req.user.role === 'doctor' && req.body.doctorProfile) {
      fieldsToUpdate.doctorProfile = req.body.doctorProfile;
    }

    // Clean undefined fields
    Object.keys(fieldsToUpdate).forEach(
      (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const updatedUser = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get lead doctor profile for public clinic pages
// @route   GET /api/auth/doctor-profile
// @access  Public
exports.getDoctorProfile = async (req, res, next) => {
  try {
    let doctor = await User.findOne({ role: 'doctor' });

    if (!doctor) {
      // Return default clinic profile if no doctor is created yet
      return res.json({
        success: true,
        doctor: {
          name: 'Dr. Sarah Jenkins, MD, FACC',
          email: 'doctor@drjenkinsclinic.com',
          phone: '+1 (555) 382-7492',
          avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
          doctorProfile: {
            title: 'Lead Consultant Physician & Cardiologist',
            specialization: 'Comprehensive Primary & Preventive Medicine, Cardiology',
            experienceYears: 16,
            bio: 'Recognized for clinical excellence and patient-centered medicine. Committed to providing 360-degree holistic care, from advanced diagnostics and preventive wellness to telehealth and chronic illness recovery.',
            consultationFee: 75,
            hospitalAffiliation: 'Metropolitan General & University Health',
            clinicAddress: '742 Evergreen Medical Blvd, Suite 400, New York, NY 10001',
            availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            availableTimeSlots: [
              '09:00 AM - 09:30 AM',
              '09:30 AM - 10:00 AM',
              '10:30 AM - 11:00 AM',
              '11:30 AM - 12:00 PM',
              '02:00 PM - 02:30 PM',
              '03:00 PM - 03:30 PM',
              '04:30 PM - 05:00 PM',
            ],
            languages: ['English', 'Spanish', 'French'],
          },
        },
      });
    }

    res.json({
      success: true,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        avatar: doctor.avatar,
        doctorProfile: doctor.doctorProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};
