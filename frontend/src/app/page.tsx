'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  ShieldCheck,
  Award,
  Clock,
  PhoneCall,
  Video,
  HeartPulse,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  ChevronRight,
  Star,
} from 'lucide-react';
import api from '../lib/api';
import ServiceCard from '../components/ServiceCard';
import ReviewCard from '../components/ReviewCard';
import DoctorCredentials from '../components/DoctorCredentials';

export default function HomePage() {
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  useEffect(() => {
    fetchServices();
    fetchReviews();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      if (res.data?.services) {
        setServices(res.data.services);
      }
    } catch (err) {
      console.warn('Backend services request failed, using initial catalog:', err);
      // Fallback initial services if backend is not started yet
      setServices([
        {
          _id: 'srv-1',
          title: 'Comprehensive Health & Physical Checkup',
          category: 'General Consultation',
          shortDescription: 'Complete physical examination, vital signs analysis, and tailored preventive roadmap.',
          features: ['Blood pressure & BMI check', 'Digital medical report', 'Tailored nutrition advice'],
          price: 60,
          durationMinutes: 30,
          icon: 'Stethoscope',
          isPopular: true,
        },
        {
          _id: 'srv-2',
          title: 'Cardiology Consultation & ECG Analysis',
          category: 'Cardiology & Heart Care',
          shortDescription: 'In-depth cardiovascular health assessment with 12-lead ECG review and arrhythmia screening.',
          features: ['12-lead ECG interpretation', 'Cardiovascular risk scoring', 'Blood pressure titration'],
          price: 95,
          durationMinutes: 45,
          icon: 'HeartPulse',
          isPopular: true,
        },
        {
          _id: 'srv-3',
          title: 'Virtual Telehealth & Video Consultation',
          category: 'Telehealth & Online',
          shortDescription: 'Convenient HD video consultation from the comfort of your home with digital prescription delivery.',
          features: ['Encrypted video consult', 'Instant e-Prescription', 'Lab requisition ordering'],
          price: 50,
          durationMinutes: 25,
          icon: 'Video',
          isPopular: true,
        },
        {
          _id: 'srv-4',
          title: 'Chronic Disease Management (Hypertension & Diabetes)',
          category: 'Preventive Health',
          shortDescription: 'Continuous monitoring, therapy titration, and lifestyle coaching for chronic conditions.',
          features: ['HbA1c & sugar tracking', 'Cardiovascular risk audit', 'Bi-weekly portal check-ins'],
          price: 85,
          durationMinutes: 40,
          icon: 'Activity',
          isPopular: false,
        },
      ]);
    } finally {
      setIsLoadingServices(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews');
      if (res.data?.reviews) {
        setReviews(res.data.reviews);
      }
    } catch (err) {
      setReviews([
        {
          patientName: 'Michael Vance',
          rating: 5,
          treatmentReceived: 'Cardiology & Preventive Care',
          comment: 'Dr. Sarah Jenkins is hands down the most empathetic and thorough doctor I have ever had. She explained my blood pressure data clearly and created an actionable recovery plan without overwhelming me.',
        },
        {
          patientName: 'Eleanor Roosevelt D.',
          rating: 5,
          treatmentReceived: 'Virtual Telehealth Consultation',
          comment: 'Booking was completely frictionless! The video call worked seamlessly and Dr. Jenkins sent my prescription immediately to my portal. Highest recommendation!',
        },
        {
          patientName: 'David K. Miller',
          rating: 5,
          treatmentReceived: 'Annual Comprehensive Physical',
          comment: 'Modern clinic with world-class facilities and zero waiting time. The staff and Dr. Jenkins take real time to listen to your health concerns. A true standard of excellence.',
        },
      ]);
    }
  };

  const categories = [
    'All',
    'General Consultation',
    'Cardiology & Heart Care',
    'Telehealth & Online',
    'Preventive Health',
  ];

  const filteredServices =
    activeCategory === 'All'
      ? services
      : services.filter((s) => s.category === activeCategory);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-white to-slate-50 pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-teal-100/80 border border-teal-200 text-teal-800 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Modern Patient-First Healthcare Practice</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Compassionate Medicine,{' '}
                <span className="bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
                  Personalized Care
                </span>{' '}
                For Every Patient.
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Welcome to the official practice of <strong>Dr. Sarah Jenkins, MD, FACC</strong>.
                Combining 16+ years of clinical excellence, cutting-edge diagnostic technology,
                and seamless online scheduling to protect what matters most: your health.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  href="/book-appointment"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-teal-600/30 transition-all transform hover:-translate-y-0.5"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book In-Person or Telehealth</span>
                </Link>

                <Link
                  href="/services"
                  className="flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold px-6 py-3.5 rounded-xl border border-slate-300 shadow-sm transition-all"
                >
                  <span>Explore All Services</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">16+</div>
                  <div className="text-xs text-slate-500 font-medium">Years Clinical Practice</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">12k+</div>
                  <div className="text-xs text-slate-500 font-medium">Patients Treated</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center">
                    4.9
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400 ml-1 inline" />
                  </div>
                  <div className="text-xs text-slate-500 font-medium">Patient Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right Column: Doctor Profile Card & Badge */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-teal-500/20 to-sky-500/20 rounded-3xl blur-2xl -z-10"></div>

                {/* Card Container */}
                <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/80 relative overflow-hidden">
                  <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden mb-6 bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80"
                      alt="Dr. Sarah Jenkins, MD, FACC"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                      <span className="text-xs font-semibold bg-teal-500 text-white px-2.5 py-1 rounded-full w-fit mb-1">
                        Senior Attending Physician
                      </span>
                      <h3 className="text-2xl font-bold">Dr. Sarah Jenkins</h3>
                      <p className="text-xs text-slate-200">MD (Harvard), FACC (Cardiology)</p>
                    </div>
                  </div>

                  {/* Highlights list */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold text-slate-800 block">Board Certified Specialist</span>
                        <span className="text-slate-500">American Board of Internal Medicine</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-teal-50/50 border border-teal-100">
                      <Clock className="w-5 h-5 text-teal-600 shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold text-teal-900 block">Immediate Slot Availability</span>
                        <span className="text-teal-700">Same-day urgent appointments reserved</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency & Quick Access Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-600/30">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-rose-400">
                Direct Clinic Hotline & Urgent Care
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Need To Speak With Our Clinical Staff?
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                Call our reception directly for immediate triage, appointment rescheduling, or urgent inquiries.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
            <a
              href="tel:+15553827492"
              className="w-full md:w-auto text-center px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
            >
              Call +1 (555) 382-7492
            </a>
          </div>
        </div>
      </section>

      {/* Credentials Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full inline-block border border-teal-200">
            Medical Accreditations
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-3">
            Excellence & Credentials You Can Trust
          </h3>
        </div>
        <DoctorCredentials />
      </section>

      {/* Services Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full inline-block border border-teal-200">
              Clinical Specializations
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Total Outpatient Medical Services
            </h2>
            <p className="text-slate-600 text-sm mt-2 max-w-xl">
              From preventative wellness and in-clinic diagnostics to remote telemedicine,
              every service is tailored to provide clarity and comfort.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800 group"
          >
            <span>View Full Service Catalog</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of services */}
        {isLoadingServices ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <ServiceCard key={service._id || service.title} service={service} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950 px-3 py-1 rounded-full inline-block border border-teal-800">
              Frictionless Patient Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight">
              How Your Care Works
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Book online, connect with Dr. Jenkins, and manage your health seamlessly from any device.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/80 relative">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-lg mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Book Slot Online</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Choose between in-person clinic visits or convenient telehealth video calls. Select your preferred date and time slot in under two minutes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/80 relative">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-lg mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Detailed Consultation</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Discuss your symptoms in an attentive, unhurried session. Dr. Jenkins reviews past records, vitals, and conducts targeted medical exams.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/80 relative">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-lg mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Digital Rx & Care Plan</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Access your digital prescription, medicine dosages, diagnostic requisitions, and doctor advice directly inside your patient portal anytime.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/book-appointment"
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all"
            >
              <Calendar className="w-5 h-5" />
              <span>Schedule Your Visit Today</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Patient Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full inline-block border border-teal-200">
            Real Patient Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Trusted By Over 12,000+ Patients
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Read verified reviews from patients who experienced compassionate, attentive medical care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.slice(0, 3).map((rev, idx) => (
            <ReviewCard key={idx} review={rev} />
          ))}
        </div>
      </section>

      {/* Location, Clinic & Booking CTA Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-teal-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-teal-800/50 rounded-full blur-3xl"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs uppercase font-bold text-teal-300 tracking-wider">
                Visit Dr. Sarah Jenkins Medical Practice
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 leading-tight">
                Ready For Personalized, Compassionate Healthcare?
              </h2>
              <p className="text-teal-100 text-sm mt-4 leading-relaxed max-w-lg">
                Whether you need a routine annual physical, cardiology workup, or immediate telehealth support, our clinical team is ready to serve you.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-xs text-teal-200">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-teal-300" /> Suite 400, Apex Health Tower, New York
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-300" /> Mon - Sat: 9:00 AM - 6:00 PM
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <Link
                href="/book-appointment"
                className="bg-white hover:bg-slate-100 text-teal-950 font-bold px-8 py-4 rounded-xl text-center shadow-lg transition-all"
              >
                Book Appointment Online
              </Link>
              <Link
                href="/contact"
                className="bg-teal-800 hover:bg-teal-700 text-white font-semibold px-6 py-4 rounded-xl text-center border border-teal-700 transition-all"
              >
                Get Clinic Directions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
