'use client';

import React from 'react';
import Link from 'next/link';
import {
  Award,
  GraduationCap,
  Building,
  HeartPulse,
  Languages,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import DoctorCredentials from '../../components/DoctorCredentials';

export default function AboutPage() {
  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Bio Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80"
                alt="Dr. Sarah Jenkins, MD"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs bg-teal-500 text-white font-bold px-3 py-1 rounded-full w-fit mb-1">
                  16+ Years Clinical Excellence
                </span>
                <h3 className="text-2xl font-bold">Dr. Sarah Jenkins</h3>
                <p className="text-xs text-slate-200">MD (Harvard), FACC (Cardiology)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-semibold">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            <span>Meet Your Physician</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Comprehensive Medical Excellence, Powered by Genuine Compassion.
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Dr. Sarah Jenkins is a double board-certified physician specializing in Internal Medicine and Cardiovascular Diseases. Over the course of 16 years in clinical practice, she has spearheaded modern outpatient diagnostic models that combine evidence-based protocols with deeply attentive patient listening.
          </p>

          <p className="text-slate-600 text-sm leading-relaxed">
            Prior to establishing her private practice at Apex Medical Tower, Dr. Jenkins served as Chief Resident at Harvard Medical School&apos;s affiliated teaching hospitals and subsequently completed her fellowship at the American College of Cardiology.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-800 block text-sm">Languages Spoken</span>
              <span className="text-slate-600">English, Spanish, French (Fluent)</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-800 block text-sm">Hospital Privileges</span>
              <span className="text-slate-600">Metropolitan General Hospital</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/book-appointment"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-teal-600/30 transition-all text-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule A Consultation With Dr. Jenkins</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Accreditations Grid */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Education & Board Certifications</h2>
          <p className="text-xs text-slate-500 mt-1">Credentials verified by the American Medical Association</p>
        </div>
        <DoctorCredentials />
      </div>

      {/* Philosophy of Care */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
            Clinical Philosophy
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
            Treating The Whole Patient, Not Just The Numbers.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center font-bold text-white">
              01
            </div>
            <h3 className="font-bold text-base text-white">Zero Rush Consultations</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We never double-book time slots. Every patient receives dedicated, unhurried time to voice symptoms, family history, and personal concerns.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center font-bold text-white">
              02
            </div>
            <h3 className="font-bold text-base text-white">Root Cause Prevention</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Rather than writing endless medication refills, we identify biochemical, dietary, and cardiovascular root causes to restore genuine vitality.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center font-bold text-white">
              03
            </div>
            <h3 className="font-bold text-base text-white">Digital Continuity of Care</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your care does not end when you exit the clinic door. Receive instant portal prescriptions, ongoing lab tracking, and secure doctor check-ins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
