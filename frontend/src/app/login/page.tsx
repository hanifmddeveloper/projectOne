'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  HeartPulse,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Stethoscope,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      if (redirect) {
        router.push(redirect);
      } else {
        router.push('/portal');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoDoctor = async () => {
    setEmail('doctor@drjenkinsclinic.com');
    setPassword('Password123!');
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await login({ email: 'doctor@drjenkinsclinic.com', password: 'Password123!' });
      router.push('/doctor');
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo doctor login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoPatient = async () => {
    setEmail('patient@example.com');
    setPassword('Password123!');
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await login({ email: 'patient@example.com', password: 'Password123!' });
      router.push('/portal');
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo patient login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white mx-auto shadow-md shadow-teal-600/30">
            <HeartPulse className="w-8 h-8" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign In to Your Health Portal
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Access your consultation history, prescriptions, and clinic appointments
          </p>
        </div>

        {/* 1-Click Demo Accounts Strip */}
        <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-900 block text-center">
            ⚡ Instant 1-Click Demo Accounts:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoDoctor}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-teal-100/60 text-teal-800 border border-teal-300 rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
            >
              <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
              <span>Doctor Portal</span>
            </button>
            <button
              type="button"
              onClick={handleDemoPatient}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-teal-100/60 text-teal-800 border border-teal-300 rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
            >
              <User className="w-3.5 h-3.5 text-teal-600" />
              <span>Patient Portal</span>
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-sm disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>Don&apos;t have a patient account yet? </span>
          <Link href="/register" className="font-bold text-teal-700 hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-500">Loading sign in...</div>}>
      <LoginContent />
    </Suspense>
  );
}
