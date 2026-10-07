'use client';

import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

interface ReviewProps {
  review: {
    patientName: string;
    rating: number;
    treatmentReceived?: string;
    comment: string;
    createdAt?: string;
  };
}

export default function ReviewCard({ review }: ReviewProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between">
      <Quote className="w-8 h-8 text-teal-100 absolute top-4 right-4" />

      <div>
        {/* Rating stars */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
              }`}
            />
          ))}
          <span className="text-xs font-bold text-slate-700 ml-1.5">{review.rating}.0</span>
        </div>

        {/* Comment quote */}
        <p className="text-slate-700 text-sm italic leading-relaxed mb-4">
          &ldquo;{review.comment}&rdquo;
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold text-slate-900">{review.patientName}</h4>
            <span title="Verified Patient">
              <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
            </span>
          </div>
          {review.treatmentReceived && (
            <p className="text-xs text-slate-400 font-medium">{review.treatmentReceived}</p>
          )}
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
          Verified Care
        </span>
      </div>
    </div>
  );
}
