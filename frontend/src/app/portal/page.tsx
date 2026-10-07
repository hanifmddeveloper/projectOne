'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  FileText,
  User as UserIcon,
  MessageSquare,
  Star,
  Clock,
  Video,
  AlertCircle,
  CheckCircle2,
  Phone,
  Printer,
  ChevronRight,
  Shield,
  Activity,
  HeartPulse,
} from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import PrescriptionModal from '../../components/PrescriptionModal';

export default function PatientPortalPage() {
  const router = useRouter();
  const { user, token, isLoading: authLoading, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'appointments' | 'prescriptions' | 'profile' | 'inquiries' | 'review'>('appointments');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<any | null>(null);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    bloodGroup: '',
    allergies: '',
    chronicConditions: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRel: '',
  });

  // Direct Inquiry State
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState('');

  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTreatment, setReviewTreatment] = useState('General Consultation');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const [messageNotice, setMessageNotice] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/portal');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        bloodGroup: user.bloodGroup || 'Unknown',
        allergies: (user.allergies || []).join(', '),
        chronicConditions: (user.chronicConditions || []).join(', '),
        emergencyContactName: (user as any).emergencyContact?.name || '',
        emergencyContactPhone: (user as any).emergencyContact?.phone || '',
        emergencyContactRel: (user as any).emergencyContact?.relationship || '',
      });
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const [appRes, rxRes] = await Promise.all([
        api.get('/appointments/my-appointments'),
        api.get('/prescriptions/my-prescriptions'),
      ]);

      if (appRes.data?.appointments) setAppointments(appRes.data.appointments);
      if (rxRes.data?.prescriptions) setPrescriptions(rxRes.data.prescriptions);
    } catch (err: any) {
      console.warn('Error loading patient data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.put(`/appointments/${id}/cancel`);
      setMessageNotice('Appointment cancelled successfully.');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel appointment');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', {
        name: profileForm.name,
        phone: profileForm.phone,
        bloodGroup: profileForm.bloodGroup,
        allergies: profileForm.allergies
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        chronicConditions: profileForm.chronicConditions
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        emergencyContact: {
          name: profileForm.emergencyContactName,
          phone: profileForm.emergencyContactPhone,
          relationship: profileForm.emergencyContactRel,
        },
      });
      setMessageNotice('Your health profile has been updated!');
      await refreshUser();
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    }
  };

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/messages', {
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        subject: inquirySubject,
        message: inquiryMessage,
      });
      setInquirySuccess('Your message has been sent to Dr. Jenkins clinic! We will follow up with you promptly.');
      setInquirySubject('');
      setInquiryMessage('');
    } catch (err: any) {
      alert(err.message || 'Failed to submit inquiry');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/reviews', {
        rating: reviewRating,
        treatmentReceived: reviewTreatment,
        comment: reviewComment,
      });
      setReviewSuccess('Thank you! Your feedback review has been recorded.');
      setReviewComment('');
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    }
  };

  if (authLoading || !user) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm">Authenticating your health records...</p>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Patient Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400/50 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <span className="text-xs bg-teal-500/20 text-teal-300 font-semibold px-2.5 py-0.5 rounded-full border border-teal-500/30">
                Patient ID: #{user.id?.slice(-6) || user._id?.slice(-6) || '9281'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-3">
              <span>Email: {user.email}</span>
              <span>•</span>
              <span>Blood Group: <strong className="text-teal-300">{user.bloodGroup || 'O+'}</strong></span>
              <span>•</span>
              <span>Phone: {user.phone || 'Not recorded'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/book-appointment"
            className="w-full md:w-auto text-center bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Book New Appointment</span>
          </Link>
        </div>
      </div>

      {/* Global message notice */}
      {messageNotice && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex justify-between items-center">
          <span>{messageNotice}</span>
          <button onClick={() => setMessageNotice('')} className="font-bold ml-2">✕</button>
        </div>
      )}

      {/* Portal Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2 no-scrollbar">
        {[
          { key: 'appointments', label: 'My Appointments', icon: <Calendar className="w-4 h-4" />, count: appointments.length },
          { key: 'prescriptions', label: 'Digital Prescriptions (Rx)', icon: <FileText className="w-4 h-4" />, count: prescriptions.length },
          { key: 'profile', label: 'Medical Profile & History', icon: <UserIcon className="w-4 h-4" /> },
          { key: 'inquiries', label: 'Ask Doctor / Message', icon: <MessageSquare className="w-4 h-4" /> },
          { key: 'review', label: 'Leave Feedback', icon: <Star className="w-4 h-4" /> },
        ].map((tab: any) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.key ? 'bg-teal-800 text-teal-100' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your Scheduled Visits</h2>
              <p className="text-xs text-slate-500">Track pending, confirmed, and completed consultations.</p>
            </div>
          </div>

          {isLoadingData ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : appointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {appointments.map((app) => (
                <div
                  key={app._id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                        {app.service?.category || 'General Consultation'}
                      </span>
                      <span
                        className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          app.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : app.status === 'completed'
                            ? 'bg-sky-100 text-sky-800 border border-sky-200'
                            : app.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base mb-1">
                      {app.service?.title || 'Medical Consultation'}
                    </h3>

                    <div className="space-y-1.5 text-xs text-slate-600 my-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-teal-600" />
                        <span className="font-medium text-slate-800">
                          {app.date} at {app.timeSlot}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {app.consultationType.includes('Video') ? (
                          <Video className="w-4 h-4 text-sky-500" />
                        ) : (
                          <HeartPulse className="w-4 h-4 text-rose-500" />
                        )}
                        <span>{app.consultationType}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                      <strong className="text-slate-700">Symptoms noted:</strong> {app.symptoms}
                    </p>

                    {app.doctorNotes && (
                      <div className="mt-2 text-xs bg-teal-50/80 p-2.5 rounded-xl border border-teal-100 text-teal-900">
                        <strong className="block text-teal-950 font-bold">Doctor Notes:</strong>
                        <span>{app.doctorNotes}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400">Consultation Fee:</span>{' '}
                      <strong className="text-slate-800">${app.paymentAmount || app.service?.price || 60}</strong>
                    </div>

                    {app.status !== 'cancelled' && app.status !== 'completed' && (
                      <button
                        onClick={() => handleCancelAppointment(app._id)}
                        className="text-rose-600 hover:text-rose-800 font-semibold"
                      >
                        Cancel Slot
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Appointments Booked Yet</h3>
              <p className="text-slate-500 text-xs mt-1">
                Schedule your first visit or virtual video consultation with Dr. Jenkins today.
              </p>
              <Link
                href="/book-appointment"
                className="mt-4 inline-block px-5 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-semibold shadow-md"
              >
                Book Appointment
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRESCRIPTIONS */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your Digital Prescriptions (Rx)</h2>
              <p className="text-xs text-slate-500">
                Official prescriptions issued by Dr. Sarah Jenkins with dosage schedules and printable certificates.
              </p>
            </div>
          </div>

          {isLoadingData ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : prescriptions.length > 0 ? (
            <div className="space-y-4">
              {prescriptions.map((rx) => (
                <div
                  key={rx._id}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-teal-300 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-serif italic font-bold text-lg text-teal-700">℞</span>
                      <h3 className="font-bold text-slate-900 text-base">{rx.diagnosis}</h3>
                    </div>
                    <p className="text-xs text-slate-500">
                      Issued on{' '}
                      {new Date(rx.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      by <strong>{rx.doctor?.name || 'Dr. Sarah Jenkins'}</strong>
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-lg">
                        <strong>Medicines Prescribed:</strong> {rx.medicines?.length || 0}
                      </span>
                      {rx.followUpDate && (
                        <span className="bg-teal-50 text-teal-800 px-2.5 py-1 rounded-lg">
                          <strong>Next Follow-up:</strong> {rx.followUpDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPrescription(rx)}
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all text-xs"
                  >
                    <Printer className="w-4 h-4" />
                    <span>View & Print Rx</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Prescriptions Issued Yet</h3>
              <p className="text-slate-500 text-xs mt-1">
                Your medical prescriptions will appear here once Dr. Jenkins completes your consultation.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MEDICAL PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm max-w-2xl">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Personal Medical Profile</h2>
          <p className="text-xs text-slate-500 mb-6">
            Keep your health details up to date for safer drug prescribing and clinical accuracy.
          </p>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name:</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number:</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Blood Group:</label>
                <select
                  value={profileForm.bloodGroup}
                  onChange={(e) => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  {['Unknown', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Emergency Contact Name:</label>
                <input
                  type="text"
                  value={profileForm.emergencyContactName}
                  onChange={(e) => setProfileForm({ ...profileForm, emergencyContactName: e.target.value })}
                  placeholder="e.g. Spouse / Parent"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Emergency Contact Phone:</label>
                <input
                  type="text"
                  value={profileForm.emergencyContactPhone}
                  onChange={(e) => setProfileForm({ ...profileForm, emergencyContactPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Emergency Relationship:</label>
                <input
                  type="text"
                  value={profileForm.emergencyContactRel}
                  onChange={(e) => setProfileForm({ ...profileForm, emergencyContactRel: e.target.value })}
                  placeholder="e.g. Spouse, Sibling"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Known Drug / Food Allergies (comma separated):
              </label>
              <input
                type="text"
                value={profileForm.allergies}
                onChange={(e) => setProfileForm({ ...profileForm, allergies: e.target.value })}
                placeholder="e.g. Penicillin, Sulfa drugs, Peanuts..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Chronic Medical Conditions (comma separated):
              </label>
              <input
                type="text"
                value={profileForm.chronicConditions}
                onChange={(e) => setProfileForm({ ...profileForm, chronicConditions: e.target.value })}
                placeholder="e.g. Hypertension, Type 2 Diabetes, Asthma..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md transition-all"
              >
                Save Health Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: ASK DOCTOR / INQUIRY */}
      {activeTab === 'inquiries' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm max-w-2xl">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Send A Clinical Message To Dr. Jenkins</h2>
          <p className="text-xs text-slate-500 mb-6">
            Non-urgent queries, medication questions, or general health concerns directly to our clinic staff.
          </p>

          {inquirySuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{inquirySuccess}</span>
            </div>
          )}

          <form onSubmit={handleSendInquiry} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject / Query Topic:</label>
              <input
                type="text"
                required
                value={inquirySubject}
                onChange={(e) => setInquirySubject(e.target.value)}
                placeholder="e.g. Clarification about blood pressure dosage..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Detailed Message:</label>
              <textarea
                required
                rows={5}
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder="Write your question here..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              ></textarea>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md transition-all"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: LEAVE REVIEW */}
      {activeTab === 'review' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm max-w-2xl">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Share Your Experience</h2>
          <p className="text-xs text-slate-500 mb-6">
            Your review helps other patients make confident decisions about their care.
          </p>

          {reviewSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{reviewSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Rating:</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= reviewRating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Treatment / Consultation Name:</label>
              <input
                type="text"
                required
                value={reviewTreatment}
                onChange={(e) => setReviewTreatment(e.target.value)}
                placeholder="e.g. Cardiology Consultation, Annual Physical..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Your Feedback & Experience:</label>
              <textarea
                required
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Tell us about the consultation, clarity of explanations, clinic atmosphere..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              ></textarea>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md transition-all"
              >
                Submit Patient Review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Prescription Print/View Modal */}
      {selectedPrescription && (
        <PrescriptionModal
          prescription={selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
        />
      )}
    </div>
  );
}
