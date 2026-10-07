import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'doctor_portal_super_secret_jwt_key_2026_modern_health';

export function signToken(payload: { id: string; role?: string }, expiresInSec: number = 30 * 24 * 3600): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + expiresInSec;
  const fullPayload = { ...payload, exp, iat: Math.floor(Date.now() / 1000) };

  const encodeBase64Url = (obj: any) =>
    Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

  const headerB64 = encodeBase64Url(header);
  const payloadB64 = encodeBase64Url(fullPayload);
  const data = `${headerB64}.${payloadB64}`;

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${data}.${signature}`;
}

export function verifyToken(token: string): { id: string; role?: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, signature] = parts;

    const data = `${headerB64}.${payloadB64}`;
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(data)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (signature !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf8'));
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

// Initial Database In-Memory Seed
const initialDoctor = {
  _id: 'user-doc-1',
  id: 'user-doc-1',
  name: 'Dr. Sarah Jenkins, MD, FACC',
  email: 'doctor@drjenkinsclinic.com',
  password: 'Password123!',
  role: 'doctor',
  phone: '+1 (555) 382-7492',
  avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
  address: '742 Evergreen Medical Blvd, Suite 400, New York, NY 10001',
  doctorProfile: {
    title: 'Senior Board-Certified Consultant Physician & Cardiologist',
    specialization: 'Internal Medicine, Cardiology & Preventive Healthcare',
    qualifications: [
      'MBBS (Johns Hopkins University)',
      'MD in Internal Medicine (Harvard Medical School)',
      'Fellow of the American College of Cardiology (FACC)',
      'Board Certified in Preventive Cardiovascular Medicine',
    ],
    experienceYears: 16,
    bio: 'Dr. Sarah Jenkins has dedicated over 16 years to delivering comprehensive, patient-centered clinical care. Combining cutting-edge cardiovascular diagnostics with empathetic lifestyle counseling, Dr. Jenkins focuses on treating root causes rather than just symptoms.',
    consultationFee: 75,
    hospitalAffiliation: 'Metropolitan General & University Health Hospital',
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
      '05:30 PM - 06:00 PM',
    ],
    languages: ['English', 'Spanish', 'French'],
  },
};

const initialPatient = {
  _id: 'user-pat-1',
  id: 'user-pat-1',
  name: 'Michael Vance',
  email: 'patient@example.com',
  password: 'Password123!',
  role: 'patient',
  phone: '+1 (555) 891-2304',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  bloodGroup: 'O+',
  dateOfBirth: '1990-05-14',
  gender: 'Male',
  address: '14 Elm Street, Apt 3B, New York, NY 10002',
  allergies: ['Penicillin', 'Peanuts'],
  chronicConditions: ['Mild Essential Hypertension'],
  emergencyContact: {
    name: 'Rachel Vance',
    phone: '+1 (555) 891-2399',
    relationship: 'Spouse',
  },
};

const initialServices = [
  {
    _id: 'srv-1',
    id: 'srv-1',
    slug: 'comprehensive-health-physical-checkup',
    title: 'Comprehensive Health & Physical Checkup',
    category: 'General Consultation',
    shortDescription: 'Complete head-to-toe physical examination, vital signs analysis, and tailored preventive roadmap.',
    fullDescription: 'Our flagship full-body consultation includes detailed evaluation of cardiovascular, respiratory, abdominal, and neurological systems. We review family medical history, current lifestyle factors, and prescribe personalized health goals.',
    features: [
      'Comprehensive physical examination',
      'Blood pressure & BMI assessment',
      'Holistic lifestyle & dietary evaluation',
      'Digital medical report within 24 hours',
    ],
    price: 60,
    durationMinutes: 30,
    icon: 'Stethoscope',
    isPopular: true,
    isActive: true,
  },
  {
    _id: 'srv-2',
    id: 'srv-2',
    slug: 'cardiology-consultation-ecg-analysis',
    title: 'Cardiology Consultation & ECG Analysis',
    category: 'Cardiology & Heart Care',
    shortDescription: 'In-depth cardiovascular health assessment with 12-lead ECG review and arrhythmia screening.',
    fullDescription: 'Specialized evaluation for chest pain, palpitations, hypertension, and heart disease risk factors. Includes immediate electrocardiogram (ECG) interpretation, risk stratification, and preventive medication management.',
    features: [
      '12-Lead ECG interpretation & report',
      'Cardiovascular risk factor scoring',
      'Cholesterol & hypertension management',
      'Same-day prescription adjustment',
    ],
    price: 95,
    durationMinutes: 45,
    icon: 'HeartPulse',
    isPopular: true,
    isActive: true,
  },
  {
    _id: 'srv-3',
    id: 'srv-3',
    slug: 'virtual-telehealth-video-consultation',
    title: 'Virtual Telehealth & Video Consultation',
    category: 'Telehealth & Online',
    shortDescription: 'Convenient HD video consultation from the comfort of your home with digital prescription delivery.',
    fullDescription: 'Secure, HIPAA-compliant video appointment for symptom evaluation, lab result reviews, medication follow-ups, and non-emergency medical advice. Immediate e-prescription sent straight to your portal.',
    features: [
      'Secure high-definition video room',
      'Instant digital e-Prescription (PDF/Portal)',
      'Lab test requisition ordering',
      'Flexible schedule with weekend availability',
    ],
    price: 50,
    durationMinutes: 25,
    icon: 'Video',
    isPopular: true,
    isActive: true,
  },
  {
    _id: 'srv-4',
    id: 'srv-4',
    slug: 'chronic-disease-management-hypertension-diabetes',
    title: 'Chronic Disease Management (Hypertension & Diabetes)',
    category: 'Preventive Health',
    shortDescription: 'Continuous monitoring, therapy titration, and lifestyle coaching for chronic conditions.',
    fullDescription: 'Tailored clinical care plans designed to maintain target glycemic levels and optimal blood pressure numbers, avoiding organ damage and long-term complications.',
    features: [
      'Glycemic & HbA1c trajectory tracking',
      'Kidney and lipid function reviews',
      'Medication reconciliation & side-effect audit',
      'Bi-weekly digital check-in support',
    ],
    price: 85,
    durationMinutes: 40,
    icon: 'Activity',
    isPopular: false,
    isActive: true,
  },
  {
    _id: 'srv-5',
    id: 'srv-5',
    slug: 'pediatric-family-wellness-exam',
    title: 'Pediatric & Family Wellness Exam',
    category: 'Pediatrics & Family',
    shortDescription: 'Gentle, attentive medical care for children, teens, and whole-family health guidance.',
    fullDescription: 'Comprehensive developmental milestones monitoring, immunization schedules, childhood allergy diagnostics, and common acute illness treatment.',
    features: [
      'Growth & developmental tracking',
      'Vaccination & immunization record review',
      'Child-friendly empathetic exam environment',
      'Direct pediatric guidance for parents',
    ],
    price: 65,
    durationMinutes: 30,
    icon: 'Baby',
    isPopular: false,
    isActive: true,
  },
  {
    _id: 'srv-6',
    id: 'srv-6',
    slug: 'preventive-diagnostics-full-lab-panel-review',
    title: 'Preventive Diagnostics & Full Lab Panel Review',
    category: 'Diagnostics & Lab Tests',
    shortDescription: 'Complete review of comprehensive metabolic panel, CBC, thyroid profile, and lipid biomarkers.',
    fullDescription: 'Deep dive into your laboratory bio-markers. Dr. Jenkins translates complex numbers into plain English and crafts a targeted intervention plan.',
    features: [
      'Metabolic & liver enzyme breakdown',
      'Full thyroid & endocrine assessment',
      'Early cardiovascular biomarker screening',
      'Actionable supplement & nutrition protocol',
    ],
    price: 110,
    durationMinutes: 35,
    icon: 'FileSpreadsheet',
    isPopular: false,
    isActive: true,
  },
  {
    _id: 'srv-7',
    id: 'srv-7',
    slug: 'prescription-refill-medication-review',
    title: 'Prescription Refill & Medication Review',
    category: 'General Consultation',
    shortDescription: 'Quick follow-up for medication renewals, safety monitoring, and dosage adjustments.',
    fullDescription: 'Review ongoing maintenance medications to confirm tolerance, check for drug interactions, and authorize refills directly to your preferred pharmacy.',
    features: [
      'Thorough drug-interaction verification',
      'Dosage optimization',
      'Direct digital transmission to pharmacy',
      'Fast turnaround time',
    ],
    price: 40,
    durationMinutes: 20,
    icon: 'Pill',
    isPopular: false,
    isActive: true,
  },
  {
    _id: 'srv-8',
    id: 'srv-8',
    slug: 'urgent-care-acute-illness-evaluation',
    title: 'Urgent Care & Acute Illness Evaluation',
    category: 'General Consultation',
    shortDescription: 'Priority consultation for acute symptoms such as severe cough, flu, acute infections, and migraines.',
    fullDescription: 'Rapid clinical triage and treatment for non-life-threatening acute conditions requiring prompt medical intervention and symptom relief.',
    features: [
      'Same-day priority slot allocation',
      'Rapid diagnostics and symptomatic relief',
      'Work/school medical leave certificates',
      '72-hour clinical follow-up protocol',
    ],
    price: 90,
    durationMinutes: 35,
    icon: 'ShieldAlert',
    isPopular: false,
    isActive: true,
  },
];

const initialAppointments = [
  {
    _id: 'app-1',
    id: 'app-1',
    patient: {
      _id: 'user-pat-1',
      id: 'user-pat-1',
      name: 'Michael Vance',
      email: 'patient@example.com',
      phone: '+1 (555) 891-2304',
      bloodGroup: 'O+',
    },
    doctor: {
      _id: 'user-doc-1',
      id: 'user-doc-1',
      name: 'Dr. Sarah Jenkins, MD, FACC',
      doctorProfile: initialDoctor.doctorProfile,
    },
    service: {
      _id: 'srv-2',
      id: 'srv-2',
      title: 'Cardiology Consultation & ECG Analysis',
      category: 'Cardiology & Heart Care',
      price: 95,
      durationMinutes: 45,
      icon: 'HeartPulse',
    },
    patientName: 'Michael Vance',
    patientEmail: 'patient@example.com',
    patientPhone: '+1 (555) 891-2304',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: '10:30 AM - 11:00 AM',
    consultationType: 'In-Person Clinic Visit',
    symptoms: 'Occasional chest tightness after jogging and elevated blood pressure reading (142/90 mmHg).',
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentAmount: 95,
    doctorNotes: 'Patient has mild hypertension history. Scheduled for in-clinic resting ECG and lifestyle review.',
    telehealthRoomId: '',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'app-2',
    id: 'app-2',
    patient: {
      _id: 'user-pat-1',
      id: 'user-pat-1',
      name: 'Michael Vance',
      email: 'patient@example.com',
      phone: '+1 (555) 891-2304',
      bloodGroup: 'O+',
    },
    doctor: {
      _id: 'user-doc-1',
      id: 'user-doc-1',
      name: 'Dr. Sarah Jenkins, MD, FACC',
      doctorProfile: initialDoctor.doctorProfile,
    },
    service: {
      _id: 'srv-3',
      id: 'srv-3',
      title: 'Virtual Telehealth & Video Consultation',
      category: 'Telehealth & Online',
      price: 50,
      durationMinutes: 25,
      icon: 'Video',
    },
    patientName: 'Michael Vance',
    patientEmail: 'patient@example.com',
    patientPhone: '+1 (555) 891-2304',
    date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    timeSlot: '02:00 PM - 02:30 PM',
    consultationType: 'Telemedicine Video Call',
    symptoms: 'Seasonal throat irritation, dry cough and mild fatigue.',
    status: 'completed',
    paymentStatus: 'paid',
    paymentAmount: 50,
    doctorNotes: 'Prescribed Azithromycin course and warm saline gargles. Patient responded very well.',
    telehealthRoomId: 'room-tele-demo',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

const initialPrescriptions = [
  {
    _id: 'rx-1',
    id: 'rx-1',
    appointment: 'app-2',
    patient: {
      _id: 'user-pat-1',
      id: 'user-pat-1',
      name: 'Michael Vance',
      email: 'patient@example.com',
      phone: '+1 (555) 891-2304',
      bloodGroup: 'O+',
      address: '14 Elm Street, Apt 3B, New York, NY 10002',
      allergies: ['Penicillin', 'Peanuts'],
    },
    doctor: {
      _id: 'user-doc-1',
      id: 'user-doc-1',
      name: 'Dr. Sarah Jenkins, MD, FACC',
      avatar: initialDoctor.avatar,
      phone: initialDoctor.phone,
      doctorProfile: initialDoctor.doctorProfile,
    },
    diagnosis: 'Acute Upper Respiratory Tract Irritation & Seasonal Bronchial Allergy',
    symptomsObserved: 'Mild pharyngeal erythema, clear chest auscultation, normal oxygen saturation (99%).',
    vitals: {
      bloodPressure: '124/82 mmHg',
      pulseRate: '74 bpm',
      temperature: '98.4 °F',
      weightKg: '74 kg',
    },
    medicines: [
      {
        name: 'Levocetirizine 5mg',
        dosage: '5 mg',
        frequency: '0-0-1 (Night time)',
        duration: '5 days',
        instructions: 'Take 1 tablet after dinner before bedtime. May cause mild drowsiness.',
      },
      {
        name: 'Paracetamol 650mg',
        dosage: '650 mg',
        frequency: '1-0-1 (As needed)',
        duration: '3 days',
        instructions: 'Take 1 tablet if fever or headache persists, with food.',
      },
      {
        name: 'Ascorbic Acid (Vitamin C + Zinc)',
        dosage: '500 mg',
        frequency: '1-0-0 (Morning)',
        duration: '10 days',
        instructions: 'Chewable tablet after breakfast for immune resilience.',
      },
    ],
    testsRecommended: ['Complete Blood Count (CBC) if symptoms persist past 7 days'],
    advice: 'Hydrate well with warm water (minimum 2.5L daily), avoid cold drinks and smoke exposure, perform warm saline gargling twice daily.',
    followUpDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

const initialReviews = [
  {
    _id: 'rev-1',
    id: 'rev-1',
    patient: 'user-pat-1',
    patientName: 'Michael Vance',
    rating: 5,
    treatmentReceived: 'Cardiology & Preventive Care',
    comment: 'Dr. Sarah Jenkins is hands down the most empathetic and thorough doctor I have ever had. She explained my blood pressure data clearly and created an actionable recovery plan without overwhelming me.',
    isApproved: true,
    isFeatured: true,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    _id: 'rev-2',
    id: 'rev-2',
    patient: 'user-pat-demo2',
    patientName: 'Eleanor Roosevelt D.',
    rating: 5,
    treatmentReceived: 'Virtual Telehealth Consultation',
    comment: 'Booking was completely frictionless! The video call worked seamlessly and Dr. Jenkins sent my prescription immediately to my portal. Highest recommendation!',
    isApproved: true,
    isFeatured: true,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    _id: 'rev-3',
    id: 'rev-3',
    patient: 'user-pat-demo3',
    patientName: 'David K. Miller',
    rating: 5,
    treatmentReceived: 'Annual Comprehensive Physical',
    comment: 'Modern clinic with world-class facilities and zero waiting time. The staff and Dr. Jenkins take real time to listen to your health concerns. A true standard of excellence.',
    isApproved: true,
    isFeatured: true,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

const initialMessages = [
  {
    _id: 'msg-1',
    id: 'msg-1',
    name: 'Claire Underwood',
    email: 'claire@example.com',
    phone: '+1 (555) 492-1049',
    subject: 'Inquiry regarding ECG and Holter Monitor availability',
    message: 'Hello Dr. Jenkins, I would like to schedule an ECG evaluation for my father who recently had dizzy spells. Do you offer same-day testing?',
    status: 'unread',
    replyText: null,
    repliedAt: null,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
];

// In-Memory Global Store (persisted across warm invocations)
declare global {
  // eslint-disable-next-line no-var
  var __doctorPortalData: {
    users: any[];
    services: any[];
    appointments: any[];
    prescriptions: any[];
    reviews: any[];
    messages: any[];
  } | undefined;
}

if (!global.__doctorPortalData) {
  global.__doctorPortalData = {
    users: [JSON.parse(JSON.stringify(initialDoctor)), JSON.parse(JSON.stringify(initialPatient))],
    services: JSON.parse(JSON.stringify(initialServices)),
    appointments: JSON.parse(JSON.stringify(initialAppointments)),
    prescriptions: JSON.parse(JSON.stringify(initialPrescriptions)),
    reviews: JSON.parse(JSON.stringify(initialReviews)),
    messages: JSON.parse(JSON.stringify(initialMessages)),
  };
}

export const dbStore = global.__doctorPortalData;

export const ALL_SLOTS = [
  '09:00 AM - 09:30 AM',
  '09:30 AM - 10:00 AM',
  '10:30 AM - 11:00 AM',
  '11:30 AM - 12:00 PM',
  '02:00 PM - 02:30 PM',
  '03:00 PM - 03:30 PM',
  '04:30 PM - 05:00 PM',
  '05:30 PM - 06:00 PM',
];
