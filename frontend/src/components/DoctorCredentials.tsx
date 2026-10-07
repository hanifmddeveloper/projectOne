'use client';

import React from 'react';
import { Award, GraduationCap, Building2, Stethoscope, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function DoctorCredentials() {
  const credentials = [
    {
      icon: <GraduationCap className="w-6 h-6 text-teal-600" />,
      title: 'Harvard & Johns Hopkins',
      subtitle: 'MD & Postdoctoral Fellow in Cardiovascular Sciences',
    },
    {
      icon: <Award className="w-6 h-6 text-teal-600" />,
      title: 'FACC Certified',
      subtitle: 'Fellow of American College of Cardiology',
    },
    {
      icon: <Building2 className="w-6 h-6 text-teal-600" />,
      title: 'Senior Hospital Consultant',
      subtitle: 'Metropolitan General & University Health Hospital',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-teal-600" />,
      title: '16+ Years Experience',
      subtitle: 'Over 12,000+ Outpatient Consultations Conducted',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {credentials.map((cred, idx) => (
        <div
          key={idx}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-4 hover:border-teal-300 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            {cred.icon}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">
              {cred.title}
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cred.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
