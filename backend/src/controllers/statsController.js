const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Prescription = require('../models/Prescription');
const Service = require('../models/Service');
const Message = require('../models/Message');

// @desc    Get dashboard metrics for doctor/admin
// @route   GET /api/stats/dashboard
// @access  Private (Doctor/Admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [
      totalPatients,
      totalAppointments,
      pendingAppointments,
      completedAppointments,
      todayAppointments,
      totalPrescriptions,
      totalServices,
      unreadMessages,
      recentAppointments,
    ] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      Appointment.countDocuments({ status: 'completed' }),
      Appointment.countDocuments({ date: today }),
      Prescription.countDocuments(),
      Service.countDocuments({ isActive: true }),
      Message.countDocuments({ status: 'unread' }),
      Appointment.find()
        .populate('service', 'title category price')
        .populate('patient', 'name email phone')
        .sort({ createdAt: -1 })
        .limit(6),
    ]);

    // Calculate total consultation revenue
    const revenueAgg = await Appointment.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$paymentAmount' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    res.json({
      success: true,
      stats: {
        totalPatients,
        totalAppointments,
        pendingAppointments,
        completedAppointments,
        todayAppointments,
        totalPrescriptions,
        totalServices,
        unreadMessages,
        totalRevenue,
      },
      recentAppointments,
    });
  } catch (error) {
    next(error);
  }
};
