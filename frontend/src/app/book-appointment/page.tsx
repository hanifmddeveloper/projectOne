'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Video,
  Building,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [services, setServices] = useState<any[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [consultationType, setConsultationType] = useState<string>('In-Person Clinic Visit');

  // Step 2 state
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(tomorrow);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Step 3 state: Patient info & symptoms
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [symptoms, setSymptoms] = useState('');

  // Status & submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (user) {
      setPatientName(user.name || '');
      setPatientEmail(user.email || '');
      setPatientPhone(user.phone || '');
    }
  }, [user]);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      if (res.data?.services) {
        setServices(res.data.services);
        const queryServiceId = searchParams.get('serviceId');
        if (queryServiceId) {
          const match = res.data.services.find(
            (s: any) => s._id === queryServiceId || s.id === queryServiceId
          );
          if (match) setSelectedServiceId(match._id || match.id);
        } else if (res.data.services.length > 0) {
          setSelectedServiceId(res.data.services[0]._id || res.data.services[0].id);
        }
      }
    } catch (err) {
      console.warn('Error loading services:', err);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchSlots = async (date: string) => {
    setIsLoadingSlots(true);
    try {
      const res = await api.get(`/appointments/available-slots?date=${date}`);
      if (res.data?.availableSlots) {
        setAvailableSlots(res.data.availableSlots);
        if (res.data.availableSlots.length > 0) {
          setSelectedSlot(res.data.availableSlots[0]);
        } else {
          setSelectedSlot('');
        }
      }
    } catch (err) {
      // Default slots fallback
      setAvailableSlots([
        '09:00 AM - 09:30 AM',
        '10:30 AM - 11:00 AM',
        '11:30 AM - 12:00 PM',
        '02:00 PM - 02:30 PM',
        '04:30 PM - 05:00 PM',
      ]);
      setSelectedSlot('09:00 AM - 09:30 AM');
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleNextStep = () => {
    setErrorMessage('');
    if (step === 1) {
      if (!selectedServiceId) {
        setErrorMessage('Please select a medical service to proceed.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedDate || !selectedSlot) {
        setErrorMessage('Please select both a date and available consultation time slot.');
        return;
      }
      setStep(3);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!user) {
      setErrorMessage('Please sign in or create a patient account before confirming your appointment.');
      return;
    }

    if (!symptoms.trim()) {
      setErrorMessage('Please briefly describe your symptoms or reason for visit.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/appointments', {
        serviceId: selectedServiceId,
        date: selectedDate,
        timeSlot: selectedSlot,
        consultationType,
        symptoms,
        patientName,
        patientEmail,
        patientPhone,
      });

      if (res.data?.success) {
        setBookingSuccess(res.data.appointment);
        setStep(4);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to book appointment. Please try another slot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedService = services.find(
    (s) => (s._id || s.id) === selectedServiceId
  );

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Wizard Header */}
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3.5 py-1.5 rounded-full inline-block border border-teal-200">
          Online Appointment Reservation
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
          Book Your Medical Consultation
        </h1>
        <p className="text-slate-600 text-sm mt-2">
          Reserve your slot with Dr. Sarah Jenkins in 3 simple steps.
        </p>
      </div>

      {/* Step Progress Indicators */}
      {step < 4 && (
        <div className="flex items-center justify-between mb-8 max-w-xl mx-auto">
          {[
            { num: 1, label: 'Select Service' },
            { num: 2, label: 'Date & Slot' },
            { num: 3, label: 'Patient Info' },
          ].map((item) => (
            <div key={item.num} className="flex items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === item.num
                    ? 'bg-teal-600 text-white ring-4 ring-teal-100 shadow-md'
                    : step > item.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step > item.num ? <CheckCircle2 className="w-5 h-5" /> : item.num}
              </div>
              <span
                className={`text-xs font-semibold hidden sm:inline ${
                  step >= item.num ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Error message toast */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Wizard Card Body */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl">
        {/* STEP 1: SERVICE & CONSULTATION TYPE */}
        {step === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                1. Choose Consultation Format
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Select whether you want to visit Dr. Jenkins in our New York clinic or consult remotely.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setConsultationType('In-Person Clinic Visit')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-4 transition-all ${
                    consultationType === 'In-Person Clinic Visit'
                      ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-600'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">In-Person Clinic Visit</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Apex Medical Tower, Suite 400. Full physical exam & on-site diagnostic tests.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setConsultationType('Telemedicine Video Call')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-4 transition-all ${
                    consultationType === 'Telemedicine Video Call'
                      ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-600'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Telemedicine Video Call</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Encrypted HD video room from home. Instant e-prescription & digital follow-up.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                2. Select Medical Service
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Select the service you wish to schedule with Dr. Jenkins.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1">
                {services.map((srv) => {
                  const srvId = srv._id || srv.id;
                  const isSelected = selectedServiceId === srvId;
                  return (
                    <div
                      key={srvId}
                      onClick={() => setSelectedServiceId(srvId)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-600 shadow-sm'
                          : 'border-slate-200 hover:border-teal-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-semibold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                            {srv.category}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">${srv.price}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">{srv.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{srv.shortDescription}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {srv.durationMinutes} mins
                        </span>
                        {isSelected && (
                          <span className="text-teal-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Selected
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all text-sm"
              >
                <span>Continue to Date & Time</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DATE & TIME SLOT SELECTION */}
        {step === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Choose Consultation Date & Time Slot
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Dr. Jenkins consults Monday through Saturday. Select a convenient day to view open slots.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Date Picker Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Select Appointment Date:
                  </label>
                  <div className="relative">
                    <CalendarIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1.5">
                    <p className="font-semibold text-slate-800">Clinic Hours Note:</p>
                    <p>• Weekdays: 9:00 AM – 6:00 PM</p>
                    <p>• Saturday: 10:00 AM – 3:00 PM</p>
                    <p>• Slots are dynamically checked to guarantee zero waiting room overlap.</p>
                  </div>
                </div>

                {/* Available Slots Grid */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Available Time Slots for {selectedDate}:
                  </label>

                  {isLoadingSlots ? (
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse"></div>
                      ))}
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                            selectedSlot === slot
                              ? 'bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-200'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-teal-50/30'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs text-center">
                      All slots are currently booked for this date. Please pick another date.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Selected Summary Card */}
            {selectedService && (
              <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                <div>
                  <span className="text-teal-800 font-bold block">{selectedService.title}</span>
                  <span className="text-slate-600">
                    {consultationType} • {selectedDate} at {selectedSlot || 'Select slot'}
                  </span>
                </div>
                <div className="font-bold text-base text-teal-900">${selectedService.price}</div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold px-4 py-2.5 rounded-xl text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all text-sm"
              >
                <span>Continue to Patient Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PATIENT INFORMATION & SYMPTOMS */}
        {step === 3 && (
          <form onSubmit={handleBookingSubmit} className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Patient Information & Reason for Visit
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Please provide patient contact details and describe symptoms so Dr. Jenkins can prepare beforehand.
              </p>

              {!user && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="font-bold block">Patient Account Required</span>
                    <span>Sign in or register an account to link your appointments and view digital prescriptions.</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/login?redirect=/book-appointment"
                      className="px-3 py-1.5 bg-amber-600 text-white font-semibold rounded-lg text-xs whitespace-nowrap"
                    >
                      Sign In Now
                    </Link>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Patient Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address:
                  </label>
                  <input
                    type="email"
                    required
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="e.g. john@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / WhatsApp Number:
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 234-5678"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Symptoms & Medical Concerns:
                </label>
                <textarea
                  required
                  rows={4}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your primary reason for visiting: duration of symptoms, medications currently taking, pain level (1-10)..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                ></textarea>
              </div>
            </div>

            {/* Final Booking Summary Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
              <div className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">
                Appointment Summary Review:
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Doctor:</span>
                <span className="font-semibold">Dr. Sarah Jenkins, MD, FACC</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Service:</span>
                <span className="font-semibold">{selectedService?.title}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Schedule:</span>
                <span className="font-semibold">{selectedDate} ({selectedSlot})</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Type:</span>
                <span className="font-semibold">{consultationType}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm text-slate-900">
                <span>Total Consultation Fee:</span>
                <span className="text-teal-700">${selectedService?.price}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold px-4 py-2.5 rounded-xl text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all text-sm disabled:opacity-50"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>{isSubmitting ? 'Confirming Reservation...' : 'Confirm Appointment Booking'}</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION */}
        {step === 4 && bookingSuccess && (
          <div className="text-center py-8 space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Booking Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                Your Appointment Is Scheduled!
              </h2>
              <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
                Thank you, <strong>{patientName}</strong>. A confirmation has been registered for{' '}
                <strong>{bookingSuccess.date}</strong> at <strong>{bookingSuccess.timeSlot}</strong>.
              </p>
            </div>

            <div className="max-w-md mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold text-slate-900">{bookingSuccess.service?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Consultation Type:</span>
                <span className="font-semibold text-teal-800">{bookingSuccess.consultationType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-600 capitalize">{bookingSuccess.status}</span>
              </div>
              {bookingSuccess.telehealthRoomId && (
                <div className="pt-2 border-t border-slate-200 text-sky-700">
                  <span className="font-semibold block">Telehealth Video Room:</span>
                  <span className="font-mono text-[11px]">{bookingSuccess.telehealthRoomId}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/portal"
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all text-sm"
              >
                Go To My Health Portal
              </Link>
              <Link
                href="/"
                className="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3 rounded-xl border border-slate-300 transition-all text-sm"
              >
                Back To Homepage
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookAppointmentPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-500">Loading booking wizard...</div>}>
      <BookingContent />
    </Suspense>
  );
}
