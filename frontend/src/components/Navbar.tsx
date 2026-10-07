'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
  HeartPulse,
  Calendar,
  User,
  LogOut,
  Menu,
  X,
  Stethoscope,
  PhoneCall,
  Clock,
  LayoutDashboard,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      {/* Top emergency & clinic info bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-400 font-medium">Walk-ins & Telehealth Open</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:+15553827492"
              className="flex items-center gap-1 text-slate-200 hover:text-teal-300 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
              <span>Clinic: +1 (555) 382-7492</span>
            </a>
            <span className="text-slate-600">|</span>
            <span className="text-red-400 font-medium flex items-center gap-1">
              <span>Emergency 24/7: 911</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="font-bold text-xl text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>Dr. Sarah Jenkins</span>
                <span className="text-xs bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded-full">
                  MD, FACC
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Comprehensive Medical & Heart Care</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 font-medium text-sm text-slate-600">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/') ? 'text-teal-700 bg-teal-50 font-semibold' : 'hover:text-teal-600 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              href="/services"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/services') ? 'text-teal-700 bg-teal-50 font-semibold' : 'hover:text-teal-600 hover:bg-slate-50'
              }`}
            >
              Medical Services
            </Link>
            <Link
              href="/about"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/about') ? 'text-teal-700 bg-teal-50 font-semibold' : 'hover:text-teal-600 hover:bg-slate-50'
              }`}
            >
              About Doctor
            </Link>
            <Link
              href="/contact"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/contact') ? 'text-teal-700 bg-teal-50 font-semibold' : 'hover:text-teal-600 hover:bg-slate-50'
              }`}
            >
              Contact & Clinic
            </Link>

            {/* Portal Link if logged in */}
            {user?.role === 'patient' && (
              <Link
                href="/portal"
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive('/portal') ? 'text-teal-700 bg-teal-50 font-semibold' : 'hover:text-teal-600 hover:bg-slate-50'
                }`}
              >
                <User className="w-4 h-4 text-teal-600" />
                <span>My Health Portal</span>
              </Link>
            )}

            {/* Doctor Dashboard Link if doctor/admin */}
            {(user?.role === 'doctor' || user?.role === 'admin') && (
              <Link
                href="/doctor"
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive('/doctor') ? 'text-teal-700 bg-teal-50 font-semibold' : 'hover:text-teal-600 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-teal-600" />
                <span>Doctor Workspace</span>
              </Link>
            )}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/book-appointment"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-medium px-5 py-2.5 rounded-xl shadow-md shadow-teal-600/25 transition-all transform hover:-translate-y-0.5 text-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                <Link
                  href={user.role === 'doctor' ? '/doctor' : '/portal'}
                  className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-teal-600 py-1.5 px-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-300"
                  />
                  <span className="hidden md:inline truncate max-w-[120px]">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-700 hover:text-teal-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/book-appointment"
              className="text-xs bg-teal-600 text-white px-3 py-2 rounded-lg font-medium"
            >
              Book Now
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fadeIn">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-teal-50 hover:text-teal-700"
          >
            Home
          </Link>
          <Link
            href="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-teal-50 hover:text-teal-700"
          >
            Medical Services
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-teal-50 hover:text-teal-700"
          >
            About Doctor
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-teal-50 hover:text-teal-700"
          >
            Contact & Clinic
          </Link>

          {user && (
            <Link
              href={user.role === 'doctor' ? '/doctor' : '/portal'}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-teal-700 font-semibold bg-teal-50"
            >
              {user.role === 'doctor' ? 'Doctor Workspace' : 'Patient Health Portal'}
            </Link>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Signed in as {user.name}</span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-600 font-semibold flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 border border-slate-300 rounded-xl text-slate-700 font-medium text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 bg-teal-600 text-white rounded-xl font-medium text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
