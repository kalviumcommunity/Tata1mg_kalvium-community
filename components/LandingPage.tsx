"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import {
  Upload, UserCheck, Building2, Pill, Truck, FileText, Heart,
  Package, Shield, CheckCircle, Clock, Stethoscope, Users,
  ChevronRight, Facebook, Twitter, Instagram, Linkedin, Menu, X,
  Star, Activity, TrendingUp, Bell
} from 'lucide-react';

interface LandingPageProps {
  onRoleSelect: (role: 'doctor' | 'pharmacist' | 'admin') => void;
}

export function LandingPage({ onRoleSelect }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const services = [
    { icon: FileText, title: 'Issue Prescriptions', desc: 'Digitally issue prescriptions and track their fulfillment in real-time', color: '#FF6B6B', bg: '#FFF5F5' },
    { icon: Stethoscope, title: 'Doctor Portal', desc: 'Dedicated tools for verified medical professionals to manage patients', color: '#2563EB', bg: '#EFF6FF' },
    { icon: Shield, title: 'Pharmacy Management', desc: 'Streamlined inventory and order fulfillment for pharmacies', color: '#00B894', bg: '#F0FDF4' },
    { icon: Building2, title: 'Network Verification', desc: 'Robust verification system for all healthcare providers', color: '#F59E0B', bg: '#FFFBEB' },
    { icon: Truck, title: 'Fulfillment Tracking', desc: 'Monitor medicine dispensing and delivery statuses', color: '#8B5CF6', bg: '#F5F3FF' },
    { icon: Activity, title: 'Prescription Analytics', desc: 'Comprehensive analytics for prescription trends', color: '#EC4899', bg: '#FDF2F8' },
    { icon: Heart, title: 'Patient History', desc: 'Securely access patient records and prescription history', color: '#FF6B6B', bg: '#FFF5F5' },
    { icon: Package, title: 'Order Management', desc: 'End-to-end tracking of pharmacy orders', color: '#00B894', bg: '#F0FDF4' },
  ];

  const workflowSteps = [
    { step: 1, title: 'Doctor Issues Prescription', icon: FileText, color: '#2563EB' },
    { step: 2, title: 'Prescription Recorded', icon: UserCheck, color: '#00B894' },
    { step: 3, title: 'Pharmacy Receives Order', icon: Pill, color: '#F59E0B' },
    { step: 4, title: 'Inventory Checked', icon: Building2, color: '#8B5CF6' },
    { step: 5, title: 'Medicine Packed', icon: Package, color: '#FF6B6B' },
    { step: 6, title: 'Delivery Dispatched', icon: Truck, color: '#EC4899' },
    { step: 7, title: 'Order Completed', icon: CheckCircle, color: '#22C55E' },
  ];

  const stats = [
    { value: '50,000+', label: 'Patient Records', icon: Users },
    { value: '1,200+', label: 'Certified Doctors', icon: Stethoscope },
    { value: '500+', label: 'Verified Pharmacies', icon: Building2 },
    { value: '10M+', label: 'Prescriptions Processed', icon: FileText },
  ];

  const badges = [
    { text: 'Verified Doctor', color: '#2563EB', bg: '#EFF6FF' },
    { text: 'Certified Pharmacist', color: '#00B894', bg: '#F0FDF4' },
    { text: 'Verified Pharmacy', color: '#8B5CF6', bg: '#F5F3FF' },
    { text: 'Government Approved', color: '#FF6B6B', bg: '#FFF5F5' },
    { text: 'License Verified', color: '#F59E0B', bg: '#FFFBEB' },
  ];

  const medicines = [
    { name: 'Metformin 500mg', generic: 'Metformin HCl', brand: 'Glucophage', price: '₹45', stock: 120, rx: true },
    { name: 'Atorvastatin 20mg', generic: 'Atorvastatin Calcium', brand: 'Lipitor', price: '₹85', stock: 85, rx: true },
    { name: 'Amoxicillin 500mg', generic: 'Amoxicillin Trihydrate', brand: 'Amoxil', price: '₹65', stock: 200, rx: true },
    { name: 'Paracetamol 650mg', generic: 'Acetaminophen', brand: 'Calpol', price: '₹12', stock: 500, rx: false },
  ];

  const trackingSteps = [
    { title: 'Prescription Issued', time: '10:00 AM', done: true, color: '#2563EB' },
    { title: 'Doctor Approved', time: '10:30 AM', done: true, color: '#00B894' },
    { title: 'Pharmacist Verified', time: '11:00 AM', done: true, color: '#F59E0B' },
    { title: 'Medicine Packed', time: '11:45 AM', done: true, color: '#8B5CF6' },
    { title: 'Out for Delivery', time: '2:00 PM', done: false, color: '#FF6B6B' },
    { title: 'Delivered Successfully', time: '—', done: false, color: '#22C55E' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC', fontFamily: '"Inter", "Poppins", sans-serif' }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FF6B6B' }}>
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A1A2E' }}>
                Medi<span style={{ color: '#FF6B6B' }}>Track</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {['Home', 'Services', 'How It Works', 'About'].map(item => (
                <a key={item} href="#" className="text-gray-600 hover:text-gray-900 transition-colors" style={{ fontSize: '0.875rem' }}>{item}</a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onRoleSelect('doctor')}
                className="border-blue-200 text-blue-600 hover:bg-blue-50" style={{ fontSize: '0.8rem' }}>
                Doctor Login
              </Button>
              <Button variant="outline" size="sm" onClick={() => onRoleSelect('pharmacist')}
                className="border-green-200 text-green-600 hover:bg-green-50" style={{ fontSize: '0.8rem' }}>
                Pharmacist Login
              </Button>
              <Button size="sm" onClick={() => onRoleSelect('admin')}
                style={{ backgroundColor: '#FF6B6B', fontSize: '0.8rem' }} className="text-white hover:opacity-90">
                Admin Portal
              </Button>
            </div>

            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            <Button className="w-full" variant="outline" onClick={() => onRoleSelect('doctor')}>Doctor Login</Button>
            <Button className="w-full" variant="outline" onClick={() => onRoleSelect('pharmacist')}>Pharmacist Login</Button>
            <Button className="w-full text-white" style={{ backgroundColor: '#FF6B6B' }} onClick={() => onRoleSelect('admin')}>Admin Portal</Button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #5b21b6 50%, #be185d 100%)', minHeight: '85vh' }}>
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.15)' }}></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full opacity-10 bg-white"
              style={{ width: `${80 + i * 40}px`, height: `${80 + i * 40}px`, top: `${10 + i * 15}%`, left: `${5 + i * 16}%`, filter: 'blur(20px)' }} />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                <Star className="w-4 h-4 text-yellow-300" />
                <span style={{ fontSize: '0.8rem' }}>#1 Prescription Management Platform in India</span>
              </div>
              <h1 className="text-white mb-6 leading-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800 }}>
                Unified Platform for Healthcare Professionals
              </h1>
              <p className="mb-8" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', lineHeight: 1.8 }}>
                Issue digital prescriptions, manage pharmacy inventory, and streamline healthcare operations across verified medical networks securely.
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: Stethoscope, label: 'Doctor Portal', bg: 'white', textColor: '#FF6B6B', role: 'doctor' },
                  { icon: Building2, label: 'Pharmacy Portal', bg: 'transparent', textColor: 'white', role: 'pharmacist' },
                  { icon: Shield, label: 'Admin Access', bg: 'transparent', textColor: 'white', role: 'admin' },
                ].map((btn, i) => (
                  <Button key={i} size="lg"
                    onClick={() => onRoleSelect(btn.role as any)}
                    style={{ backgroundColor: btn.bg, color: btn.textColor, border: btn.bg === 'transparent' ? '1px solid rgba(255,255,255,0.5)' : 'none' }}
                    className="hover:opacity-90 transition-opacity">
                    <btn.icon className="w-4 h-4 mr-2" />
                    {btn.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Floating UI Demo */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-2xl" style={{ width: '300px' }}>
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
                      <Stethoscope className="w-5 h-5" style={{ color: '#2563EB' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1A2E' }}>Dr. Rajesh Kumar</p>
                      <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>MBBS, MD Cardiology</p>
                    </div>
                    <span className="ml-auto text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#F0FDF4', color: '#22C55E' }}>✓ Verified</span>
                  </div>
                  <div className="space-y-3 mb-4">
                    {[
                      { label: 'Prescription #', val: 'RX-2024-001' },
                      { label: 'Patient', val: 'Amit Sharma' },
                      { label: 'Medicine', val: 'Metformin 500mg' },
                      { label: 'Duration', val: '30 days / BD' },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between" style={{ fontSize: '0.8rem' }}>
                        <span style={{ color: '#9CA3AF' }}>{row.label}</span>
                        <span style={{ color: '#374151', fontWeight: 500 }}>{row.val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-xl" style={{ backgroundColor: '#F0FDF4' }}>
                    <p style={{ fontSize: '0.75rem', color: '#22C55E' }} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" /> Approved & Sent to Pharmacy
                    </p>
                  </div>
                </div>

                <div className="absolute -top-6 -right-10 bg-white rounded-xl p-3 shadow-xl" style={{ width: '175px' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0FDF4' }}>
                      <Truck className="w-4 h-4" style={{ color: '#22C55E' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1A1A2E' }}>Order Dispatched</p>
                      <p style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>ETA: 30 mins</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-10 bg-white rounded-xl p-3 shadow-xl" style={{ width: '175px' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF5F5' }}>
                      <Bell className="w-4 h-4" style={{ color: '#FF6B6B' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1A1A2E' }}>New Prescription</p>
                      <p style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>3 items verified</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block' }}>
            <path d="M0,60 L1440,60 L1440,20 C1200,60 900,0 720,20 C540,40 240,0 0,20 Z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#F0FDF4' }}>
                    <stat.icon className="w-6 h-6" style={{ color: '#00B894' }} />
                  </div>
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: '#1A1A2E', lineHeight: 1.2 }}>{stat.value}</p>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1 rounded-full mb-3" style={{ backgroundColor: '#FFF5F5', color: '#FF6B6B', fontSize: '0.8rem', fontWeight: 600 }}>
              Our Services
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '0.75rem' }}>Everything You Need for Healthcare</h2>
            <p style={{ color: '#6B7280', maxWidth: '36rem', margin: '0 auto' }}>From prescription management to medicine delivery, we've got your healthcare needs covered end-to-end.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{ transform: 'translateY(0)', transition: 'all 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: service.bg }}>
                  <service.icon className="w-6 h-6" style={{ color: service.color }} />
                </div>
                <h3 style={{ fontWeight: 600, color: '#1A1A2E', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{service.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.8rem', lineHeight: 1.6 }}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-20" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1 rounded-full mb-3" style={{ backgroundColor: '#EFF6FF', color: '#2563EB', fontSize: '0.8rem', fontWeight: 600 }}>
              How It Works
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '0.75rem' }}>Simple & Transparent Process</h2>
            <p style={{ color: '#6B7280' }}>From prescription upload to delivery, every step is tracked and verified.</p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-8 left-[8%] right-[8%] h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-300 z-0"></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6 relative z-10">
              {workflowSteps.map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 bg-white shadow-md border-2"
                    style={{ borderColor: step.color }}>
                    <step.icon className="w-7 h-7" style={{ color: step.color }} />
                  </div>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white mb-2" style={{ backgroundColor: step.color, fontSize: '0.7rem', fontWeight: 700 }}>
                    {step.step}
                  </div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 500, color: '#374151', lineHeight: 1.4 }}>{step.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Verification Badges */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '0.75rem' }}>Trusted & Verified Platform</h2>
            <p style={{ color: '#6B7280' }}>Every professional undergoes rigorous verification before joining our network</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {badges.map((badge, i) => (
              <div key={i} className="flex items-center gap-2 px-6 py-3 rounded-full shadow-sm border" style={{ backgroundColor: badge.bg, borderColor: badge.color + '30' }}>
                <CheckCircle className="w-5 h-5" style={{ color: badge.color }} />
                <span style={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>{badge.text}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Doctor Verification', items: ['Medical Council Registration', 'Hospital Affiliation Proof', 'Specialization Certificate', 'Digital Signature Setup'], color: '#2563EB', bg: '#EFF6FF', icon: Stethoscope },
              { title: 'Pharmacist Verification', items: ['Pharmacy License Check', 'Drug Handling Certificate', 'Professional Experience Audit', 'Background Verification'], color: '#00B894', bg: '#F0FDF4', icon: Pill },
              { title: 'Pharmacy Verification', items: ['Drug License Validation', 'GST Registration Check', 'Infrastructure Inspection', 'Owner KYC Verification'], color: '#8B5CF6', bg: '#F5F3FF', icon: Building2 },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="h-1.5" style={{ backgroundColor: item.color }}></div>
                <div className="p-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: item.bg }}>
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <h3 style={{ fontWeight: 600, color: '#1A1A2E', marginBottom: '1rem' }}>{item.title}</h3>
                  <ul className="space-y-2">
                    {item.items.map((step, j) => (
                      <li key={j} className="flex items-center gap-2" style={{ fontSize: '0.875rem', color: '#4B5563' }}>
                        <CheckCircle className="w-4 h-4 shrink-0" style={{ color: item.color }} />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Medicine Catalog */}
      <section className="py-20" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1 rounded-full mb-3" style={{ backgroundColor: '#F0FDF4', color: '#00B894', fontSize: '0.8rem', fontWeight: 600 }}>
              Medicine Catalog
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1A1A2E' }}>Verified Medicine Catalog</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {medicines.map((med, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-full h-28 rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: '#F0FDF4' }}>
                  <Pill className="w-12 h-12" style={{ color: '#00B894' }} />
                </div>
                {med.rx && (
                  <span className="inline-block text-xs px-2 py-1 rounded-full mb-2" style={{ backgroundColor: '#FFF5F5', color: '#FF6B6B' }}>
                    Rx Required
                  </span>
                )}
                <h3 style={{ fontWeight: 600, color: '#1A1A2E', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{med.name}</h3>
                <p style={{ color: '#9CA3AF', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{med.generic}</p>
                <p style={{ color: '#D1D5DB', fontSize: '0.75rem', marginBottom: '0.75rem' }}>Brand: {med.brand}</p>
                <div className="flex items-center justify-between">
                  <span style={{ fontWeight: 700, color: '#00B894', fontSize: '1.1rem' }}>{med.price}</span>
                  <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Stock: {med.stock}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Tracking */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '0.75rem' }}>Real-Time Order Tracking</h2>
            <p style={{ color: '#6B7280' }}>Stay updated at every step of your prescription journey</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            {trackingSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-4 mb-4 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center border-2 shrink-0"
                    style={{ borderColor: step.color, backgroundColor: step.done ? step.color : 'white' }}>
                    {step.done
                      ? <CheckCircle className="w-4 h-4 text-white" />
                      : <Clock className="w-4 h-4" style={{ color: step.color }} />}
                  </div>
                  {i < trackingSteps.length - 1 && (
                    <div className="w-0.5 h-8 mt-1" style={{ backgroundColor: step.done ? step.color : '#E5E7EB' }}></div>
                  )}
                </div>
                <div className="flex-1 pt-1.5">
                  <div className="flex items-center justify-between">
                    <p style={{ fontWeight: step.done ? 600 : 400, color: step.done ? '#1A1A2E' : '#9CA3AF', fontSize: '0.9rem' }}>{step.title}</p>
                    <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{step.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #5b21b6 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to Streamline Your Practice?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', fontSize: '1.1rem' }}>
            Join thousands of doctors and pharmacists on the MediTrack professional network
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white hover:bg-gray-100" style={{ color: '#5b21b6', fontWeight: 600 }} onClick={() => onRoleSelect('doctor')}>
              <Stethoscope className="w-4 h-4 mr-2" /> Join as Doctor
            </Button>
            <Button size="lg" className="bg-white hover:bg-gray-100" style={{ color: '#00B894', fontWeight: 600 }} onClick={() => onRoleSelect('pharmacist')}>
              <Pill className="w-4 h-4 mr-2" /> Join as Pharmacist
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#111827' }} className="text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FF6B6B' }}>
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Medi<span style={{ color: '#FF6B6B' }}>Track</span></span>
              </div>
              <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.7 }}>Smart healthcare management for medical professionals.</p>
            </div>
            {[
              { title: 'Services', links: ['Issue Prescriptions', 'Pharmacy Network', 'Patient Records', 'Inventory Management'] },
              { title: 'Support', links: ['Help Center', 'Privacy Policy', 'Terms of Service', 'Contact Us'] },
              { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Partner With Us'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}><a href="#" style={{ color: '#9CA3AF', fontSize: '0.875rem' }} className="hover:text-white transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: '#1F2937' }}>
            <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>© 2024 MediTrack. All rights reserved.</p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" style={{ backgroundColor: '#1F2937' }}>
                  <Icon className="w-4 h-4" style={{ color: '#9CA3AF' }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}