'use client';

import React from 'react';
import Link from 'next/link';
import {
  HeartPulse,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  ArrowRight,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-md">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Dr. Sarah Jenkins Medical Practice
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Providing holistic, patient-first outpatient medicine, advanced cardiovascular diagnostics,
              telehealth consultations, and lifelong preventive health roadmaps.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-teal-400 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Board Certified
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4" /> 16+ Years Experience
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-teal-500 pl-2">
              Patient Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-teal-500" /> General Health Checkup
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-teal-500" /> Cardiology & ECG Screening
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-teal-500" /> Virtual Telehealth Video Care
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-teal-500" /> Chronic Disease Management
                </Link>
              </li>
              <li>
                <Link href="/book-appointment" className="hover:text-teal-400 transition-colors flex items-center gap-1.5 font-medium text-teal-300">
                  <ArrowRight className="w-3.5 h-3.5 text-teal-400" /> Book An Appointment Online
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours & Availability */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-teal-500 pl-2">
              Consultation Hours
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-300">Monday - Friday</span>
                <span className="text-teal-400 font-medium">9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-300">Saturday</span>
                <span className="text-teal-400 font-medium">10:00 AM - 3:00 PM</span>
              </li>
              <li className="flex justify-between py-1">
                <span className="text-slate-300">Sunday</span>
                <span className="text-rose-400 font-medium">Emergency Calls Only</span>
              </li>
            </ul>
            <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
              <Clock className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
              <span>Same-day appointments prioritized for urgent symptoms and high fever cases.</span>
            </div>
          </div>

          {/* Clinic Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-teal-500 pl-2">
              Clinic & Location
            </h4>
            <div className="space-y-3 text-sm">
              <p className="flex items-start gap-2.5 text-slate-400">
                <MapPin className="w-4 h-4 text-teal-400 mt-1 shrink-0" />
                <span>Suite 400, Apex Medical Tower, 742 Evergreen Medical Blvd, New York, NY 10001</span>
              </p>
              <p className="flex items-center gap-2.5 text-slate-400">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <a href="tel:+15553827492" className="hover:text-white transition-colors">
                  +1 (555) 382-7492
                </a>
              </p>
              <p className="flex items-center gap-2.5 text-slate-400">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href="mailto:doctor@drjenkinsclinic.com" className="hover:text-white transition-colors">
                  doctor@drjenkinsclinic.com
                </a>
              </p>
              <div className="pt-2">
                <Link
                  href="/portal"
                  className="inline-block text-xs text-slate-400 hover:text-slate-200 underline"
                >
                  Patient Medical Records Portal
                </Link>
                <span className="text-slate-600 mx-2">|</span>
                <Link
                  href="/doctor"
                  className="inline-block text-xs text-slate-400 hover:text-slate-200 underline"
                >
                  Doctor Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom medical disclaimer */}
        <div className="pt-8 border-t border-slate-900 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            © {new Date().getFullYear()} Dr. Sarah Jenkins Medical Practice. All rights reserved. HIPAA Compliant & Secure.
          </p>
          <p className="text-center md:text-right text-slate-400 max-w-xl">
            <strong className="text-rose-400">Medical Notice:</strong> Information on this website is for educational and scheduling purposes. If you are experiencing a life-threatening emergency, call 911 or head to the nearest emergency department immediately.
          </p>
        </div>
      </div>
    </footer>
  );
}
