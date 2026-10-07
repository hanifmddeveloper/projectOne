import { NextRequest, NextResponse } from 'next/server';
import { dbStore, ALL_SLOTS, signToken, verifyToken } from '@/lib/serverData';

export const dynamic = 'force-dynamic';

function getAuthUser(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) return null;
  const user = dbStore.users.find((u) => u._id === decoded.id || u.id === decoded.id);
  return user || null;
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug?: string[] } }
) {
  const slug = params.slug || [];
  const path = slug.join('/');
  const { searchParams } = new URL(req.url);

  // 1. Health check
  if (path === 'health' || path === '') {
    return NextResponse.json(
      {
        status: 'online',
        timestamp: new Date().toISOString(),
        service: 'Dr. Sarah Jenkins Medical Practice API',
        version: '1.0.0',
      },
      { headers: corsHeaders() }
    );
  }

  // 2. Auth: /api/auth/me
  if (path === 'auth/me') {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Not authorized, token invalid or expired' }, { status: 401, headers: corsHeaders() });
    }
    const safeUser = { ...user };
    delete safeUser.password;
    return NextResponse.json({ success: true, user: safeUser }, { headers: corsHeaders() });
  }

  // 3. Auth: /api/auth/doctor-profile
  if (path === 'auth/doctor-profile') {
    const doctor = dbStore.users.find((u) => u.role === 'doctor') || dbStore.users[0];
    return NextResponse.json({
      success: true,
      doctor: {
        id: doctor._id || doctor.id,
        _id: doctor._id || doctor.id,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        avatar: doctor.avatar,
        doctorProfile: doctor.doctorProfile,
      },
    }, { headers: corsHeaders() });
  }

  // 4. Services: /api/services
  if (path === 'services') {
    const category = searchParams.get('category');
    let services = dbStore.services.filter((s) => s.isActive !== false);
    if (category && category !== 'All') {
      services = services.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }
    return NextResponse.json({
      success: true,
      count: services.length,
      services,
    }, { headers: corsHeaders() });
  }

  // 5. Service by ID: /api/services/:idOrSlug
  if (path.startsWith('services/') && slug.length === 2) {
    const idOrSlug = slug[1];
    const service = dbStore.services.find(
      (s) => s._id === idOrSlug || s.id === idOrSlug || s.slug === idOrSlug
    );
    if (!service) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404, headers: corsHeaders() });
    }
    return NextResponse.json({ success: true, service }, { headers: corsHeaders() });
  }

  // 6. Reviews: /api/reviews
  if (path === 'reviews') {
    const reviews = dbStore.reviews.filter((r) => r.isApproved !== false);
    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1)
        : '5.0';
    return NextResponse.json({
      success: true,
      count: reviews.length,
      averageRating: avgRating,
      reviews,
    }, { headers: corsHeaders() });
  }

  // 7. Appointments: /api/appointments/available-slots
  if (path === 'appointments/available-slots') {
    const date = searchParams.get('date');
    if (!date) {
      return NextResponse.json({ success: false, message: 'Please provide a date query parameter (YYYY-MM-DD)' }, { status: 400, headers: corsHeaders() });
    }
    const bookedAppointments = dbStore.appointments.filter(
      (app) => app.date === date && app.status !== 'cancelled'
    );
    const bookedSlots = bookedAppointments.map((app) => app.timeSlot);
    const availableSlots = ALL_SLOTS.filter((slot) => !bookedSlots.includes(slot));
    return NextResponse.json({
      success: true,
      date,
      allSlots: ALL_SLOTS,
      bookedSlots,
      availableSlots,
    }, { headers: corsHeaders() });
  }

  // 8. Appointments: /api/appointments/my-appointments
  if (path === 'appointments/my-appointments') {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401, headers: corsHeaders() });
    }
    const userId = user._id || user.id;
    const userAppointments = dbStore.appointments.filter(
      (app) => app.patient?._id === userId || app.patient?.id === userId || app.patient === userId
    );
    return NextResponse.json({
      success: true,
      count: userAppointments.length,
      appointments: userAppointments,
    }, { headers: corsHeaders() });
  }

  // 9. Appointments: /api/appointments (all, doctor/admin view)
  if (path === 'appointments') {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401, headers: corsHeaders() });
    }
    return NextResponse.json({
      success: true,
      count: dbStore.appointments.length,
      appointments: [...dbStore.appointments].reverse(),
    }, { headers: corsHeaders() });
  }

  // 10. Single appointment: /api/appointments/:id
  if (path.startsWith('appointments/') && slug.length === 2 && slug[1] !== 'available-slots' && slug[1] !== 'my-appointments') {
    const app = dbStore.appointments.find((a) => a._id === slug[1] || a.id === slug[1]);
    if (!app) {
      return NextResponse.json({ success: false, message: 'Appointment not found' }, { status: 404, headers: corsHeaders() });
    }
    return NextResponse.json({ success: true, appointment: app }, { headers: corsHeaders() });
  }

  // 11. Prescriptions: /api/prescriptions/my-prescriptions
  if (path === 'prescriptions/my-prescriptions') {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401, headers: corsHeaders() });
    }
    const userId = user._id || user.id;
    const userPrescriptions = dbStore.prescriptions.filter(
      (rx) => rx.patient?._id === userId || rx.patient?.id === userId || rx.patient === userId
    );
    return NextResponse.json({
      success: true,
      count: userPrescriptions.length,
      prescriptions: userPrescriptions,
    }, { headers: corsHeaders() });
  }

  // 12. Prescriptions: /api/prescriptions (all, doctor view)
  if (path === 'prescriptions') {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401, headers: corsHeaders() });
    }
    return NextResponse.json({
      success: true,
      count: dbStore.prescriptions.length,
      prescriptions: [...dbStore.prescriptions].reverse(),
    }, { headers: corsHeaders() });
  }

  // 13. Single Prescription: /api/prescriptions/:id
  if (path.startsWith('prescriptions/') && slug.length === 2 && slug[1] !== 'my-prescriptions') {
    const rx = dbStore.prescriptions.find((p) => p._id === slug[1] || p.id === slug[1]);
    if (!rx) {
      return NextResponse.json({ success: false, message: 'Prescription not found' }, { status: 404, headers: corsHeaders() });
    }
    return NextResponse.json({ success: true, prescription: rx }, { headers: corsHeaders() });
  }

  // 14. Messages: /api/messages (doctor view)
  if (path === 'messages') {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401, headers: corsHeaders() });
    }
    return NextResponse.json({
      success: true,
      count: dbStore.messages.length,
      messages: [...dbStore.messages].reverse(),
    }, { headers: corsHeaders() });
  }

  // 15. Stats Dashboard: /api/stats/dashboard
  if (path === 'stats/dashboard') {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401, headers: corsHeaders() });
    }

    const today = new Date().toISOString().split('T')[0];
    const totalPatients = dbStore.users.filter((u) => u.role === 'patient').length;
    const totalAppointments = dbStore.appointments.length;
    const pendingAppointments = dbStore.appointments.filter((a) => a.status === 'pending').length;
    const completedAppointments = dbStore.appointments.filter((a) => a.status === 'completed').length;
    const todayAppointments = dbStore.appointments.filter((a) => a.date === today).length;
    const totalPrescriptions = dbStore.prescriptions.length;
    const totalServices = dbStore.services.filter((s) => s.isActive !== false).length;
    const unreadMessages = dbStore.messages.filter((m) => m.status === 'unread').length;
    const totalRevenue = dbStore.appointments
      .filter((a) => ['confirmed', 'completed'].includes(a.status))
      .reduce((sum, a) => sum + (Number(a.paymentAmount) || 0), 0);

    const recentAppointments = [...dbStore.appointments].reverse().slice(0, 6);

    return NextResponse.json({
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
    }, { headers: corsHeaders() });
  }

  return NextResponse.json({ success: false, message: `Cannot GET /api/${path}` }, { status: 404, headers: corsHeaders() });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug?: string[] } }
) {
  const slug = params.slug || [];
  const path = slug.join('/');
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  // 1. Auth: Login
  if (path === 'auth/login') {
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Please provide both email and password' }, { status: 400, headers: corsHeaders() });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = dbStore.users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401, headers: corsHeaders() });
    }

    const token = signToken({ id: user._id || user.id, role: user.role });
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        _id: user._id || user.id,
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
    }, { headers: corsHeaders() });
  }

  // 2. Auth: Register
  if (path === 'auth/register') {
    const { name, email, password, role, phone, bloodGroup, address } = body;
    if (!email || !password || !name) {
      return NextResponse.json({ success: false, message: 'Please provide name, email, and password' }, { status: 400, headers: corsHeaders() });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const exists = dbStore.users.some((u) => u.email.toLowerCase() === normalizedEmail);
    if (exists) {
      return NextResponse.json({ success: false, message: 'An account with this email already exists' }, { status: 400, headers: corsHeaders() });
    }

    const newId = `user-${Date.now()}`;
    const newUser = {
      _id: newId,
      id: newId,
      name,
      email: normalizedEmail,
      password,
      role: role && ['doctor', 'patient'].includes(role) ? role : 'patient',
      phone: phone || '',
      bloodGroup: bloodGroup || 'Unknown',
      address: address || '',
      avatar: `https://images.unsplash.com/photo-${1534528741775 + (dbStore.users.length % 5)}?w=200&auto=format&fit=crop&q=80`,
    };

    dbStore.users.push(newUser);
    const token = signToken({ id: newId, role: newUser.role });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: newId,
        _id: newId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        bloodGroup: newUser.bloodGroup,
        avatar: newUser.avatar,
      },
    }, { status: 201, headers: corsHeaders() });
  }

  // 3. Appointments: Book Appointment
  if (path === 'appointments') {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401, headers: corsHeaders() });
    }

    const {
      serviceId,
      date,
      timeSlot,
      consultationType,
      symptoms,
      patientName,
      patientEmail,
      patientPhone,
    } = body;

    const service = dbStore.services.find((s) => s._id === serviceId || s.id === serviceId);
    if (!service) {
      return NextResponse.json({ success: false, message: 'Selected medical service not found' }, { status: 404, headers: corsHeaders() });
    }

    const slotTaken = dbStore.appointments.find(
      (a) => a.date === date && a.timeSlot === timeSlot && a.status !== 'cancelled'
    );
    if (slotTaken) {
      return NextResponse.json({
        success: false,
        message: 'This time slot is already reserved. Please select another slot or time.',
      }, { status: 400, headers: corsHeaders() });
    }

    const doctor = dbStore.users.find((u) => u.role === 'doctor') || dbStore.users[0];
    const newId = `app-${Date.now()}`;
    const newApp = {
      _id: newId,
      id: newId,
      patient: {
        _id: user._id || user.id,
        id: user._id || user.id,
        name: patientName || user.name,
        email: patientEmail || user.email,
        phone: patientPhone || user.phone || '',
        bloodGroup: user.bloodGroup || 'O+',
      },
      doctor: {
        _id: doctor._id || doctor.id,
        id: doctor._id || doctor.id,
        name: doctor.name,
        doctorProfile: doctor.doctorProfile,
      },
      service: {
        _id: service._id || service.id,
        id: service._id || service.id,
        title: service.title,
        category: service.category,
        price: service.price,
        durationMinutes: service.durationMinutes,
        icon: service.icon,
      },
      patientName: patientName || user.name,
      patientEmail: patientEmail || user.email,
      patientPhone: patientPhone || user.phone || '',
      date,
      timeSlot,
      consultationType: consultationType || 'In-Person Clinic Visit',
      symptoms: symptoms || '',
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentAmount: service.price,
      doctorNotes: '',
      telehealthRoomId: consultationType === 'Telemedicine Video Call' ? `room-${Date.now()}` : '',
      createdAt: new Date().toISOString(),
    };

    dbStore.appointments.push(newApp);

    return NextResponse.json({
      success: true,
      message: 'Appointment booked successfully!',
      appointment: newApp,
    }, { status: 201, headers: corsHeaders() });
  }

  // 4. Prescriptions: Create Prescription
  if (path === 'prescriptions') {
    const user = getAuthUser(req);
    if (!user || user.role !== 'doctor') {
      return NextResponse.json({ success: false, message: 'Doctor authorization required' }, { status: 403, headers: corsHeaders() });
    }

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
    } = body;

    let targetPatient = dbStore.users.find((u) => u._id === patientId || u.id === patientId);

    if (appointmentId) {
      const app = dbStore.appointments.find((a) => a._id === appointmentId || a.id === appointmentId);
      if (app) {
        app.status = 'completed';
        if (!targetPatient && app.patient) {
          targetPatient = dbStore.users.find((u) => u._id === app.patient._id || u.id === app.patient.id) || app.patient;
        }
      }
    }

    const rxId = `rx-${Date.now()}`;
    const newRx = {
      _id: rxId,
      id: rxId,
      appointment: appointmentId,
      patient: targetPatient || {
        _id: patientId,
        id: patientId,
        name: 'Patient',
        email: 'patient@example.com',
      },
      doctor: {
        _id: user._id || user.id,
        id: user._id || user.id,
        name: user.name,
        avatar: user.avatar,
        phone: user.phone,
        doctorProfile: user.doctorProfile,
      },
      diagnosis,
      symptomsObserved,
      vitals: vitals || {},
      medicines: medicines || [],
      testsRecommended: testsRecommended || [],
      advice: advice || '',
      followUpDate: followUpDate || '',
      createdAt: new Date().toISOString(),
    };

    dbStore.prescriptions.push(newRx);

    return NextResponse.json({
      success: true,
      message: 'Prescription created successfully',
      prescription: newRx,
    }, { status: 201, headers: corsHeaders() });
  }

  // 5. Reviews: Create Review
  if (path === 'reviews') {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Please log in to submit a review' }, { status: 401, headers: corsHeaders() });
    }

    const { rating, comment, treatmentReceived } = body;
    const revId = `rev-${Date.now()}`;
    const newRev = {
      _id: revId,
      id: revId,
      patient: user._id || user.id,
      patientName: user.name,
      rating: Number(rating) || 5,
      comment,
      treatmentReceived: treatmentReceived || 'General Health Consultation',
      isApproved: true,
      isFeatured: true,
      createdAt: new Date().toISOString(),
    };

    dbStore.reviews.unshift(newRev);

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your review has been submitted.',
      review: newRev,
    }, { status: 201, headers: corsHeaders() });
  }

  // 6. Messages: Send Message
  if (path === 'messages') {
    const { name, email, phone, subject, message } = body;
    const msgId = `msg-${Date.now()}`;
    const newMsg = {
      _id: msgId,
      id: msgId,
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message,
      status: 'unread',
      replyText: null,
      repliedAt: null,
      createdAt: new Date().toISOString(),
    };

    dbStore.messages.unshift(newMsg);

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been submitted. Dr. Jenkins office will reach out shortly.',
      data: newMsg,
    }, { status: 201, headers: corsHeaders() });
  }

  return NextResponse.json({ success: false, message: `Cannot POST /api/${path}` }, { status: 404, headers: corsHeaders() });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug?: string[] } }
) {
  const slug = params.slug || [];
  const path = slug.join('/');
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  // 1. Auth: Profile Update
  if (path === 'auth/profile') {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401, headers: corsHeaders() });
    }

    Object.assign(user, body);
    const safeUser = { ...user };
    delete safeUser.password;

    return NextResponse.json({ success: true, user: safeUser }, { headers: corsHeaders() });
  }

  // 2. Appointments: Status Update (/api/appointments/:id/status)
  if (path.startsWith('appointments/') && path.endsWith('/status')) {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401, headers: corsHeaders() });
    }

    const appointmentId = slug[1];
    const app = dbStore.appointments.find((a) => a._id === appointmentId || a.id === appointmentId);
    if (!app) {
      return NextResponse.json({ success: false, message: 'Appointment not found' }, { status: 404, headers: corsHeaders() });
    }

    app.status = body.status || app.status;
    return NextResponse.json({
      success: true,
      message: 'Appointment status updated successfully',
      appointment: app,
    }, { headers: corsHeaders() });
  }

  // 3. Appointments: Cancel (/api/appointments/:id/cancel)
  if (path.startsWith('appointments/') && path.endsWith('/cancel')) {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401, headers: corsHeaders() });
    }

    const appointmentId = slug[1];
    const app = dbStore.appointments.find((a) => a._id === appointmentId || a.id === appointmentId);
    if (!app) {
      return NextResponse.json({ success: false, message: 'Appointment not found' }, { status: 404, headers: corsHeaders() });
    }

    app.status = 'cancelled';
    return NextResponse.json({
      success: true,
      message: 'Appointment cancelled successfully',
      appointment: app,
    }, { headers: corsHeaders() });
  }

  // 4. Messages: Reply (/api/messages/:id/reply)
  if (path.startsWith('messages/') && path.endsWith('/reply')) {
    const user = getAuthUser(req);
    if (!user || user.role !== 'doctor') {
      return NextResponse.json({ success: false, message: 'Doctor authorization required' }, { status: 403, headers: corsHeaders() });
    }

    const messageId = slug[1];
    const msg = dbStore.messages.find((m) => m._id === messageId || m.id === messageId);
    if (!msg) {
      return NextResponse.json({ success: false, message: 'Message not found' }, { status: 404, headers: corsHeaders() });
    }

    msg.replyText = body.replyText;
    msg.status = 'replied';
    msg.repliedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: 'Reply sent successfully',
      data: msg,
    }, { headers: corsHeaders() });
  }

  return NextResponse.json({ success: false, message: `Cannot PUT /api/${path}` }, { status: 404, headers: corsHeaders() });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug?: string[] } }
) {
  const slug = params.slug || [];
  const path = slug.join('/');

  if (path.startsWith('services/') && slug.length === 2) {
    const serviceId = slug[1];
    const idx = dbStore.services.findIndex((s) => s._id === serviceId || s.id === serviceId);
    if (idx === -1) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404, headers: corsHeaders() });
    }
    dbStore.services.splice(idx, 1);
    return NextResponse.json({ success: true, message: 'Service deleted successfully' }, { headers: corsHeaders() });
  }

  return NextResponse.json({ success: false, message: `Cannot DELETE /api/${path}` }, { status: 404, headers: corsHeaders() });
}
