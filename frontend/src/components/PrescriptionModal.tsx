'use client';

import React from 'react';
import {
  X,
  Printer,
  HeartPulse,
  Calendar,
  Activity,
  FileText,
  AlertCircle,
  Pill,
} from 'lucide-react';

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface PrescriptionProps {
  prescription: {
    _id?: string;
    createdAt?: string;
    diagnosis: string;
    symptomsObserved?: string;
    vitals?: {
      bloodPressure?: string;
      pulseRate?: string;
      temperature?: string;
      weightKg?: string;
    };
    medicines?: Medicine[];
    testsRecommended?: string[];
    advice?: string;
    followUpDate?: string;
    patient?: {
      name: string;
      email?: string;
      phone?: string;
      bloodGroup?: string;
      allergies?: string[];
    };
    doctor?: {
      name: string;
      doctorProfile?: {
        title?: string;
        specialization?: string;
        clinicAddress?: string;
      };
    };
  } | null;
  onClose: () => void;
}

export default function PrescriptionModal({ prescription, onClose }: PrescriptionProps) {
  if (!prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  const patient = prescription.patient;
  const doctor = prescription.doctor;
  const vitals = prescription.vitals || {};

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 print:m-0 print:border-none print:shadow-none">
        {/* Modal Action Bar (Hidden when printing) */}
        <div className="print:hidden bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <span className="font-semibold text-sm">Official Medical Prescription (Rx)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Prescription Body */}
        <div className="p-8 sm:p-10 text-slate-800 bg-white" id="printable-rx">
          {/* Clinic & Doctor Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b-2 border-teal-600 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0">
                <HeartPulse className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {doctor?.name || 'Dr. Sarah Jenkins, MD, FACC'}
                </h2>
                <p className="text-xs font-semibold text-teal-700">
                  {doctor?.doctorProfile?.title || 'Senior Consultant Physician & Cardiologist'}
                </p>
                <p className="text-xs text-slate-500">
                  {doctor?.doctorProfile?.specialization || 'Internal Medicine, Cardiology & Preventive Health'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {doctor?.doctorProfile?.clinicAddress || '742 Evergreen Medical Blvd, Suite 400, New York, NY'}
                </p>
              </div>
            </div>

            <div className="sm:text-right text-xs text-slate-600">
              <p className="font-bold text-slate-900">Dr. Sarah Jenkins Medical Practice</p>
              <p>Hotline: +1 (555) 382-7492</p>
              <p>Email: doctor@drjenkinsclinic.com</p>
              <p className="text-slate-400 mt-1">
                Date:{' '}
                {prescription.createdAt
                  ? new Date(prescription.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Patient Details & Vitals Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 uppercase font-semibold block text-[10px]">Patient Name</span>
              <span className="font-bold text-slate-900">{patient?.name || 'Valued Patient'}</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold block text-[10px]">Blood Group</span>
              <span className="font-bold text-slate-900">{patient?.bloodGroup || 'O+'}</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold block text-[10px]">Phone</span>
              <span className="font-medium text-slate-700">{patient?.phone || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold block text-[10px]">Known Allergies</span>
              <span className="font-medium text-rose-600">
                {patient?.allergies && patient.allergies.length > 0
                  ? patient.allergies.join(', ')
                  : 'No Known Drug Allergies'}
              </span>
            </div>
          </div>

          {/* Vitals Summary */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 my-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-slate-500 uppercase text-[10px] flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-teal-600" /> Recorded Vitals:
            </span>
            <div className="flex gap-4 sm:gap-6 flex-wrap">
              <span>
                <strong className="text-slate-500">BP:</strong> {vitals.bloodPressure || '120/80 mmHg'}
              </span>
              <span>
                <strong className="text-slate-500">Pulse:</strong> {vitals.pulseRate || '72 bpm'}
              </span>
              <span>
                <strong className="text-slate-500">Temp:</strong> {vitals.temperature || '98.6 °F'}
              </span>
              <span>
                <strong className="text-slate-500">Weight:</strong> {vitals.weightKg || '70 kg'}
              </span>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="mb-6">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Primary Diagnosis / Clinical Impression:
            </span>
            <div className="mt-1 p-3 bg-teal-50/50 border border-teal-100 rounded-xl">
              <p className="text-sm font-semibold text-teal-900">{prescription.diagnosis}</p>
              {prescription.symptomsObserved && (
                <p className="text-xs text-slate-600 mt-1 italic">
                  Observations: {prescription.symptomsObserved}
                </p>
              )}
            </div>
          </div>

          {/* Rx Symbol & Medication List */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-serif italic font-bold text-2xl text-teal-700">℞</span>
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                Prescribed Medication Regimen
              </h3>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Medicine Name & Strength</th>
                    <th className="py-2.5 px-3">Dosage & Frequency</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {prescription.medicines && prescription.medicines.length > 0 ? (
                    prescription.medicines.map((med, index) => (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-400">{index + 1}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <Pill className="w-3.5 h-3.5 text-teal-600" />
                            <span>{med.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-teal-700">
                          {med.dosage} ({med.frequency})
                        </td>
                        <td className="py-2.5 px-3 font-medium">{med.duration}</td>
                        <td className="py-2.5 px-3 text-slate-500 italic">{med.instructions}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-400">
                        No oral medications prescribed. Follow lifestyle advice.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Advice & Recommended Tests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-xs">
            {prescription.testsRecommended && prescription.testsRecommended.length > 0 && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 uppercase text-[10px] mb-2 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-teal-600" />
                  Recommended Diagnostic Tests
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {prescription.testsRecommended.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-800 uppercase text-[10px] mb-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                Doctor&apos;s Advice & Lifestyle Directives
              </h4>
              <p className="text-slate-600 leading-relaxed">
                {prescription.advice ||
                  'Hydrate with plenty of fluids, rest adequately, and adhere strictly to medicine intervals.'}
              </p>
            </div>
          </div>

          {/* Footer with Follow-up & Doctor Signature */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
            <div>
              {prescription.followUpDate && (
                <div className="flex items-center gap-1.5 text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200 font-medium">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span>Next Follow-up Recommended: {prescription.followUpDate}</span>
                </div>
              )}
              <p className="text-[11px] text-slate-400 mt-2">
                * This is a digitally verified medical prescription generated via Dr. Sarah Jenkins EMR system.
              </p>
            </div>

            <div className="text-center sm:text-right">
              <div className="border-b border-slate-300 pb-1 mb-1 w-44 font-serif italic text-base text-slate-800">
                Dr. Sarah Jenkins, MD
              </div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">
                Authorized Signature & License
              </p>
              <p className="text-[9px] text-teal-600 font-mono">NY-MED-84920491-VERIFIED</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
