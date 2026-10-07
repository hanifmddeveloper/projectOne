'use client';

import React from 'react';
import Link from 'next/link';
import {
  Stethoscope,
  HeartPulse,
  Video,
  Activity,
  Baby,
  FileSpreadsheet,
  Pill,
  ShieldAlert,
  Clock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface ServiceProps {
  service: {
    _id?: string;
    id?: string;
    slug?: string;
    title: string;
    category: string;
    shortDescription: string;
    fullDescription?: string;
    features: string[];
    price: number;
    durationMinutes: number;
    icon?: string;
    isPopular?: boolean;
  };
}

const iconMap: Record<string, React.ReactNode> = {
  Stethoscope: <Stethoscope className="w-6 h-6 text-teal-600" />,
  HeartPulse: <HeartPulse className="w-6 h-6 text-rose-500" />,
  Video: <Video className="w-6 h-6 text-sky-500" />,
  Activity: <Activity className="w-6 h-6 text-emerald-500" />,
  Baby: <Baby className="w-6 h-6 text-amber-500" />,
  FileSpreadsheet: <FileSpreadsheet className="w-6 h-6 text-indigo-500" />,
  Pill: <Pill className="w-6 h-6 text-purple-500" />,
  ShieldAlert: <ShieldAlert className="w-6 h-6 text-orange-500" />,
};

export default function ServiceCard({ service }: ServiceProps) {
  const icon = iconMap[service.icon || 'Stethoscope'] || <Stethoscope className="w-6 h-6 text-teal-600" />;

  return (
    <div
      className={`relative rounded-2xl bg-white border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden ${
        service.isPopular
          ? 'border-teal-500 shadow-md shadow-teal-500/10 ring-1 ring-teal-500/30'
          : 'border-slate-200/80 shadow-sm'
      }`}
    >
      {service.isPopular && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-teal-600 to-teal-500 text-white text-[11px] font-bold uppercase tracking-wider py-1 px-3 rounded-bl-xl shadow-sm">
          Most Requested
        </div>
      )}

      <div className="p-6">
        {/* Category & Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
            {icon}
          </div>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50/80 px-2.5 py-1 rounded-full border border-teal-100">
            {service.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug group-hover:text-teal-700 transition-colors">
          {service.title}
        </h3>

        {/* Short description */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
          {service.shortDescription}
        </p>

        {/* Duration & Fee info */}
        <div className="flex items-center justify-between py-3 px-3.5 mb-5 bg-slate-50 rounded-xl border border-slate-100 text-sm">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium text-xs">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{service.durationMinutes} Minutes Session</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 mr-1">Fee:</span>
            <span className="text-lg font-bold text-slate-900">${service.price}</span>
          </div>
        </div>

        {/* Feature bullets */}
        {service.features && service.features.length > 0 && (
          <div className="space-y-2 mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Included in visit:</p>
            {service.features.slice(0, 3).map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-6 pt-0 border-t border-slate-100 mt-auto bg-slate-50/50">
        <Link
          href={`/book-appointment?serviceId=${service._id || service.id || ''}`}
          className={`w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
            service.isPopular
              ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/25'
              : 'bg-white hover:bg-teal-50 text-teal-700 border border-teal-200 hover:border-teal-400'
          }`}
        >
          <span>Schedule Visit</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
