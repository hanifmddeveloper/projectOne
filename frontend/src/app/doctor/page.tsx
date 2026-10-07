'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  Calendar,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
  Send,
  MessageSquare,
  Activity,
  HeartPulse,
  Filter,
  Search,
} from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import PrescriptionModal from '../../components/PrescriptionModal';

export default function DoctorDashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'prescriptions' | 'messages'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  // Filter state for appointments
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchPatient, setSearchPatient] = useState('');

  // Prescription creation modal state
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [selectedAppointmentForRx, setSelectedAppointmentForRx] = useState<any | null>(null);
  const [rxDiagnosis, setRxDiagnosis] = useState('');
  const [rxSymptoms, setRxSymptoms] = useState('');
  const [rxBp, setRxBp] = useState('120/80 mmHg');
  const [rxPulse, setRxPulse] = useState('72 bpm');
  const [rxTemp, setRxTemp] = useState('98.6 °F');
  const [rxWeight, setRxWeight] = useState('70 kg');
  const [rxAdvice, setRxAdvice] = useState('Rest adequately and take medications on time.');
  const [rxFollowUp, setRxFollowUp] = useState('');
  const [rxMedicines, setRxMedicines] = useState([
    { name: 'Paracetamol 650mg', dosage: '650 mg', frequency: '1-0-1 after food', duration: '5 days', instructions: 'Take with water' },
  ]);

  // Reply modal / form state
  const [replyMessageId, setReplyMessageId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Selected prescription preview
  const [previewPrescription, setPreviewPrescription] = useState<any | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'doctor' && user.role !== 'admin'))) {
      router.push('/login?redirect=/doctor');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && (user.role === 'doctor' || user.role === 'admin')) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, appRes, rxRes, msgRes] = await Promise.all([
        api.get('/stats/dashboard'),
        api.get('/appointments'),
        api.get('/prescriptions'),
        api.get('/messages'),
      ]);

      if (statsRes.data?.stats) setStats(statsRes.data.stats);
      if (appRes.data?.appointments) setAppointments(appRes.data.appointments);
      if (rxRes.data?.prescriptions) setPrescriptions(rxRes.data.prescriptions);
      if (msgRes.data?.messages) setMessages(msgRes.data.messages);
    } catch (err: any) {
      console.warn('Error loading doctor dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId: string, newStatus: string) => {
    try {
      await api.put(`/appointments/${appointmentId}/status`, { status: newStatus });
      setNotice(`Appointment status changed to ${newStatus}.`);
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const openCreateRx = (appointment: any) => {
    setSelectedAppointmentForRx(appointment);
    setRxDiagnosis('');
    setRxSymptoms(appointment.symptoms || '');
    setIsRxModalOpen(true);
  };

  const handleAddMedicineRow = () => {
    setRxMedicines([
      ...rxMedicines,
      { name: '', dosage: '', frequency: '1-0-1', duration: '5 days', instructions: 'Take after meal' },
    ]);
  };

  const handleRemoveMedicineRow = (index: number) => {
    setRxMedicines(rxMedicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index: number, field: string, val: string) => {
    const updated = [...rxMedicines];
    (updated[index] as any)[field] = val;
    setRxMedicines(updated);
  };

  const handleSavePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxDiagnosis.trim()) {
      alert('Please enter a clinical diagnosis');
      return;
    }

    try {
      await api.post('/prescriptions', {
        appointmentId: selectedAppointmentForRx?._id,
        patientId: selectedAppointmentForRx?.patient?._id,
        diagnosis: rxDiagnosis,
        symptomsObserved: rxSymptoms,
        vitals: {
          bloodPressure: rxBp,
          pulseRate: rxPulse,
          temperature: rxTemp,
          weightKg: rxWeight,
        },
        medicines: rxMedicines.filter((m) => m.name.trim() !== ''),
        advice: rxAdvice,
        followUpDate: rxFollowUp,
      });

      setIsRxModalOpen(false);
      setNotice('Prescription created and appointment marked as completed!');
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to create prescription');
    }
  };

  const handleSendReply = async (messageId: string) => {
    if (!replyText.trim()) return;
    try {
      await api.put(`/messages/${messageId}/reply`, { replyText });
      setReplyMessageId(null);
      setReplyText('');
      setNotice('Reply transmitted to patient.');
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to send reply');
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch =
      app.patientName?.toLowerCase().includes(searchPatient.toLowerCase()) ||
      app.patientEmail?.toLowerCase().includes(searchPatient.toLowerCase()) ||
      app.service?.title?.toLowerCase().includes(searchPatient.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (authLoading || !user) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm">Authenticating Doctor Workspace...</p>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <span className="text-xs bg-teal-400 text-slate-950 font-bold px-2.5 py-0.5 rounded-full">
                Lead Physician Workspace
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {user.doctorProfile?.title || 'Senior Board-Certified Consultant Physician'} •{' '}
              {user.doctorProfile?.clinicAddress || 'Apex Medical Tower, New York'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedAppointmentForRx(null);
              setIsRxModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Blank Prescription</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex justify-between items-center">
          <span>{notice}</span>
          <button onClick={() => setNotice('')} className="font-bold">✕</button>
        </div>
      )}

      {/* Workspace Metric Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Total Patients</span>
              <Users className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{stats.totalPatients}</div>
            <span className="text-[11px] text-teal-600 font-medium">Registered in EMR</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Pending Requests</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-amber-600">{stats.pendingAppointments}</div>
            <span className="text-[11px] text-slate-500 font-medium">Needs Doctor Approval</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Completed Visits</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-600">{stats.completedAppointments}</div>
            <span className="text-[11px] text-slate-500 font-medium">Conducted & Treated</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Prescriptions Issued</span>
              <FileText className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{stats.totalPrescriptions}</div>
            <span className="text-[11px] text-slate-500 font-medium">Digital Rx Records</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Consultation Fees</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">${stats.totalRevenue}</div>
            <span className="text-[11px] text-emerald-600 font-medium">Recorded Gross</span>
          </div>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { key: 'overview', label: 'Dashboard Overview', icon: <Activity className="w-4 h-4" /> },
          { key: 'appointments', label: 'Appointments Registry', icon: <Calendar className="w-4 h-4" />, count: appointments.length },
          { key: 'prescriptions', label: 'Issued Prescriptions', icon: <FileText className="w-4 h-4" />, count: prescriptions.length },
          { key: 'messages', label: 'Patient Inquiries & Messages', icon: <MessageSquare className="w-4 h-4" />, count: messages.length },
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

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Appointments */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-slate-900 text-base">Recent Patient Bookings</h3>
              <button
                onClick={() => setActiveTab('appointments')}
                className="text-xs text-teal-700 font-semibold hover:underline"
              >
                View All Appointments →
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {appointments.slice(0, 5).map((app) => (
                <div key={app._id} className="py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{app.patientName}</h4>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'completed' ? 'bg-sky-100 text-sky-800' :
                        app.status === 'cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {app.service?.title} • {app.date} ({app.timeSlot})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {app.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus(app._id, 'confirmed')}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                      >
                        Confirm Slot
                      </button>
                    )}
                    {app.status !== 'completed' && app.status !== 'cancelled' && (
                      <button
                        onClick={() => openCreateRx(app)}
                        className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                      >
                        Write Rx
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Doctor Info & Timetable */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Practice Hours & Coverage</h3>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Regular OPD:</span>
                  <strong className="text-slate-900">Mon - Sat (9am - 6pm)</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Standard Consultation Fee:</span>
                  <strong className="text-teal-700">${user.doctorProfile?.consultationFee || 75}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Hospital Affiliation:</span>
                  <strong className="text-slate-900">Metropolitan General</strong>
                </div>
              </div>
            </div>

            <div className="bg-teal-900 text-white rounded-3xl p-6 shadow-md space-y-3">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-teal-300" />
                <h4 className="font-bold text-sm">Emergency Triage Protocol</h4>
              </div>
              <p className="text-xs text-teal-100 leading-relaxed">
                Acute chest pains, dyspnea, or anaphylaxis cases are redirected to emergency immediate triage automatically via SMS alert.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: APPOINTMENTS REGISTRY */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient name, email, or service..."
                value={searchPatient}
                onChange={(e) => setSearchPatient(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    statusFilter === status
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Schedule</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Doctor Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{app.patientName}</div>
                      <div className="text-[11px] text-slate-500">{app.patientEmail} • {app.patientPhone}</div>
                      <div className="text-[11px] text-slate-400 italic max-w-xs truncate mt-0.5">
                        Symptoms: {app.symptoms}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {app.service?.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{app.date}</div>
                      <div className="text-slate-500 text-[11px]">{app.timeSlot}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-teal-800">{app.consultationType}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'completed' ? 'bg-sky-100 text-sky-800' :
                        app.status === 'cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {app.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(app._id, 'confirmed')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold"
                        >
                          Confirm
                        </button>
                      )}
                      {app.status !== 'completed' && app.status !== 'cancelled' && (
                        <button
                          onClick={() => openCreateRx(app)}
                          className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[11px] font-semibold"
                        >
                          Write Rx
                        </button>
                      )}
                      {app.status !== 'cancelled' && app.status !== 'completed' && (
                        <button
                          onClick={() => handleUpdateStatus(app._id, 'cancelled')}
                          className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-[11px] font-semibold"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ISSUED PRESCRIPTIONS */}
      {activeTab === 'prescriptions' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base">Historical Digital Prescriptions</h3>
            <span className="text-xs text-slate-500">Total: {prescriptions.length}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {prescriptions.map((rx) => (
              <div key={rx._id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif italic font-bold text-teal-700 text-base">℞</span>
                    <h4 className="font-bold text-sm text-slate-900">{rx.diagnosis}</h4>
                    <span className="text-xs text-slate-400">
                      for <strong>{rx.patient?.name || 'Patient'}</strong>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Issued: {new Date(rx.createdAt).toLocaleDateString()} • {rx.medicines?.length || 0} medications • Follow-up: {rx.followUpDate || 'None specified'}
                  </p>
                </div>

                <button
                  onClick={() => setPreviewPrescription(rx)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View & Print Rx Certificate</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PATIENT INQUIRIES & MESSAGES */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-base">Patient Inquiries & Contact Forms</h3>

          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{msg.subject}</h4>
                    <p className="text-xs text-slate-500">
                      From <strong>{msg.name}</strong> ({msg.email}) {msg.phone ? `• ${msg.phone}` : ''}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    msg.status === 'replied' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {msg.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                  {msg.message}
                </p>

                {msg.replyText ? (
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900">
                    <strong className="block font-bold">Doctor Reply Sent:</strong>
                    <span>{msg.replyText}</span>
                  </div>
                ) : (
                  <div>
                    {replyMessageId === msg._id ? (
                      <div className="space-y-2 mt-2">
                        <textarea
                          rows={3}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your clinical advice or reply to this patient..."
                          className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        ></textarea>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setReplyMessageId(null)}
                            className="px-3 py-1.5 text-xs text-slate-600 font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSendReply(msg._id)}
                            className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
                          >
                            <Send className="w-3.5 h-3.5" /> Send Reply
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setReplyMessageId(msg._id);
                          setReplyText('');
                        }}
                        className="text-xs font-bold text-teal-700 hover:underline"
                      >
                        Reply To Message →
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: WRITE PRESCRIPTION */}
      {isRxModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="font-serif italic text-teal-700 text-xl">℞</span>
                  Issue Digital Prescription (Rx)
                </h3>
                <p className="text-xs text-slate-500">
                  Patient:{' '}
                  <strong>{selectedAppointmentForRx?.patientName || 'Clinical Outpatient'}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsRxModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePrescription} className="space-y-6 text-xs">
              {/* Diagnosis */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Diagnosis:</label>
                <input
                  type="text"
                  required
                  value={rxDiagnosis}
                  onChange={(e) => setRxDiagnosis(e.target.value)}
                  placeholder="e.g. Stage 1 Essential Hypertension, Bronchial Allergy..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {/* Vitals */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">Recorded Vitals:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Blood Pressure:</span>
                    <input
                      type="text"
                      value={rxBp}
                      onChange={(e) => setRxBp(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Pulse Rate:</span>
                    <input
                      type="text"
                      value={rxPulse}
                      onChange={(e) => setRxPulse(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Temperature:</span>
                    <input
                      type="text"
                      value={rxTemp}
                      onChange={(e) => setRxTemp(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Weight:</span>
                    <input
                      type="text"
                      value={rxWeight}
                      onChange={(e) => setRxWeight(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Medicines Schedule */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-bold text-slate-700">Prescribed Medicines:</label>
                  <button
                    type="button"
                    onClick={handleAddMedicineRow}
                    className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 text-[11px]"
                  >
                    <Plus className="w-3 h-3" /> Add Medicine
                  </button>
                </div>

                <div className="space-y-3">
                  {rxMedicines.map((med, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          required
                          placeholder="Medicine name & mg"
                          value={med.name}
                          onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Dosage (500mg)"
                          value={med.dosage}
                          onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Freq (1-0-1)"
                          value={med.frequency}
                          onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Duration (5 days)"
                          value={med.duration}
                          onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                        />
                        {rxMedicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicineRow(idx)}
                            className="p-1 text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advice & Follow-up */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Doctor Advice / Lifestyle:</label>
                  <textarea
                    rows={3}
                    value={rxAdvice}
                    onChange={(e) => setRxAdvice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  ></textarea>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Follow-up Date:</label>
                  <input
                    type="date"
                    value={rxFollowUp}
                    onChange={(e) => setRxFollowUp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs mb-2"
                  />
                  <p className="text-[11px] text-slate-400">
                    Patient will receive an automatic follow-up prompt on this date.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRxModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md"
                >
                  Save & Issue Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescription Preview Modal */}
      {previewPrescription && (
        <PrescriptionModal
          prescription={previewPrescription}
          onClose={() => setPreviewPrescription(null)}
        />
      )}
    </div>
  );
}
