/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { PricingTable, SignedIn, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { checkAndAllocateCredits } from "@/actions/credits";
import { checkUser } from "@/lib/checkUser";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Clock,
  Shield,
  Users,
  Star,
  ArrowRight,
  Video,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Stethoscope,
  Brain,
  Zap,
  Activity,
  ChevronRight,
  Play,
} from "lucide-react";
import HeroImage from '@/assets/Hero Image.webp';
import Logo from "@/assets/Logo.png";
import ChatbotModal from "@/components/chatbot-modal";
import Link from "next/link";

export default function Home() {
  const { user: clerkUser } = useUser();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    const allocateIfNeeded = async () => {
      if (!clerkUser) return;
      try {
        const dbUser = await checkUser();
        if (!('error' in dbUser) && (dbUser as any).role === 'PATIENT') {
          await checkAndAllocateCredits(dbUser);
        }
      } catch (err) {
        console.error("[Home] Credit allocation error:", err);
      }
    };

    allocateIfNeeded();
  }, [clerkUser]);


  const features = [
    {
      icon: Video,
      title: "HD Video Consultations",
      description: "Connect face-to-face with top doctors from anywhere. Crystal-clear video, zero commute.",
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/40",
    },
    {
      icon: MessageCircle,
      title: "Secure Messaging",
      description: "End-to-end encrypted chat with your healthcare providers. Private, fast, and always available.",
      color: "from-indigo-500 to-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
    },
    {
      icon: Calendar,
      title: "Instant Scheduling",
      description: "Book an appointment in under 60 seconds. Real-time availability, smart reminders.",
      color: "from-sky-500 to-sky-600",
      bg: "bg-sky-50 dark:bg-sky-950/40",
    },
    {
      icon: Brain,
      title: "AI Health Assistant",
      description: "Our RAG-powered AI provides context-aware medical information around the clock.",
      color: "from-violet-500 to-violet-600",
      bg: "bg-violet-50 dark:bg-violet-950/40",
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Your health data is fully encrypted and protected to the highest security standards.",
      color: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      icon: Zap,
      title: "Instant Prescriptions",
      description: "Receive digital prescriptions and referrals immediately after your consultation.",
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-50 dark:bg-amber-950/40",
    },
  ];

  const stats = [
    { number: "10K+", label: "Happy Patients", icon: Users },
    { number: "500+", label: "Expert Doctors", icon: Stethoscope },
    { number: "50K+", label: "Consultations", icon: Activity },
    { number: "99%", label: "Satisfaction Rate", icon: Star },
  ];

  const steps = [
    {
      step: "01",
      title: "Create Your Account",
      desc: "Sign up in seconds and complete your health profile with ease.",
      icon: Users,
    },
    {
      step: "02",
      title: "Choose a Specialist",
      desc: "Browse verified doctors by specialty and pick a time that works for you.",
      icon: Stethoscope,
    },
    {
      step: "03",
      title: "Consult & Get Care",
      desc: "Video call your doctor and receive prescriptions, referrals instantly.",
      icon: CheckCircle2,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      content: "MediCure completely changed how I access healthcare. The video consultations are incredibly convenient and the doctors are top-notch.",
      rating: 5,
      avatar: "SJ",
      avatarColor: "from-pink-500 to-rose-500",
    },
    {
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      content: "As a doctor, I love how MediCure streamlines patient care. The platform is intuitive and the secure messaging is perfect for follow-ups.",
      rating: 5,
      avatar: "MC",
      avatarColor: "from-blue-500 to-indigo-500",
    },
    {
      name: "Emily Rodriguez",
      role: "Patient",
      content: "I booked an appointment in 30 seconds. MediCure made healthcare accessible and stress-free for my entire family.",
      rating: 5,
      avatar: "ER",
      avatarColor: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">

      {/* ── Chatbot FAB ─────────────────────────────────────────────── */}
      {!isChatbotOpen && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed z-50 bottom-6 right-6 md:bottom-8 md:right-8 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full shadow-2xl p-4 flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all hover:scale-105 active:scale-95"
          aria-label="Open Health Assistant"
          style={{ boxShadow: '0 8px 32px rgba(59,130,246,0.45)' }}
        >
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          <MessageCircle className="h-6 w-6" />
          <span className="hidden md:inline font-semibold text-sm pr-1">AI Health Assistant</span>
        </button>
      )}

      {/* ── HERO SECTION ────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30 pointer-events-none" />
        {/* Decorative blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200/40 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-200/40 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-100/30 dark:bg-sky-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left — Content */}
            <div className="text-center lg:text-left">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50 rounded-full px-4 py-1.5 text-sm font-medium mb-7">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Trusted by 10,000+ patients worldwide
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.08] tracking-tight mb-6">
                Healthcare,{" "}
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
                    reimagined
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 9C50 3 150 1 298 9" stroke="url(#underline-grad)" strokeWidth="3" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="underline-grad" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#3b82f6"/>
                        <stop offset="1" stopColor="#6366f1"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>{" "}
                <br className="hidden sm:block" />
                for you.
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Talk to certified doctors anytime, anywhere — via video, chat, or AI-powered health guidance. Premium care without the waiting room.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Link href="/onboarding">
                  <button className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl text-base font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto">
                    Get Started Free
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/doctors">
                  <button className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 px-8 py-4 rounded-2xl text-base font-semibold transition-all hover:-translate-y-0.5 shadow-sm w-full sm:w-auto">
                    <Play className="h-4 w-4 text-blue-500" />
                    Find a Doctor
                  </button>
                </Link>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2.5">
                    {['from-blue-400 to-blue-600', 'from-indigo-400 to-indigo-600', 'from-sky-400 to-sky-600', 'from-violet-400 to-violet-600'].map((grad, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-br ${grad} border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-[10px] font-bold`}>
                        Dr
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">500+ Doctors</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium ml-1">4.9 / 5 rating</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">HIPAA Secure</span>
                </div>
              </div>
            </div>

            {/* Right — Hero Image */}
            <div className="relative hidden lg:block">
              {/* Card glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-3xl blur-2xl scale-95" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20 border border-white/60 dark:border-slate-700/60">
                <img
                  src={HeroImage.src}
                  alt="Doctor consulting patient via video call"
                  className="w-full h-auto object-cover"
                />
                {/* Floating status card */}
                <div className="absolute bottom-6 left-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-slate-100 dark:border-slate-700">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Next available</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">Dr. Chen · In 5 mins</p>
                  </div>
                  <span className="ml-2 w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                </div>
                {/* Floating rating card */}
                <div className="absolute top-6 right-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-3 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">4.9 Avg. Rating</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────────── */}
      <section className="relative py-14 bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px'}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ number, label, icon: Icon }, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/15 rounded-2xl mb-3">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">{number}</div>
                <div className="text-blue-200 text-sm font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              Everything you need
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight">
              Why patients choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">MediCure</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              A complete healthcare ecosystem built to make expert care accessible, affordable, and effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className={`group relative p-6 rounded-2xl ${f.bg} border border-transparent hover:border-blue-200 dark:hover:border-blue-800/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} shadow-lg mb-5`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{f.description}</p>
                <div className="mt-4 flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              Simple as 1-2-3
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight">
              Get care in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">three steps</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              From sign-up to prescription — in minutes, not days.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-14 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-200 via-indigo-300 to-blue-200 dark:from-blue-800 dark:via-indigo-700 dark:to-blue-800" />

            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center relative">
                {/* Step number bubble */}
                <div className="relative z-10 w-28 h-28 rounded-3xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <span className="text-xs font-bold text-blue-500 dark:text-blue-400 mb-1">{s.step}</span>
                  <s.icon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{s.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-14">
            <Link href="/onboarding">
              <button className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-10 py-4 rounded-2xl text-base font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:-translate-y-0.5">
                Start Your Health Journey
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              Loved by patients & doctors
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight">
              Real people,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">real results</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="relative p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800/60 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Quote mark */}
                <div className="absolute top-5 right-6 text-6xl text-blue-100 dark:text-blue-900/50 font-serif leading-none select-none">&ldquo;</div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-5 text-sm">{t.content}</p>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                  </div>
                  <CheckCircle2 className="ml-auto w-5 h-5 text-blue-500 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700" />
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px'}} />
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white rounded-full px-4 py-1.5 text-sm font-medium mb-6 border border-white/20">
            <Heart className="w-4 h-4" />
            Your health is our mission
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Take control of your health
            <br />today — it&apos;s free to start.
          </h2>
          <p className="text-blue-200 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of patients who&apos;ve transformed their healthcare experience. No insurance headaches, no waiting rooms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding">
              <button className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-2xl text-base font-bold shadow-lg hover:-translate-y-0.5 transition-all active:translate-y-0 w-full sm:w-auto">
                Get Started — It&apos;s Free
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
            <Link href="/doctors">
              <button className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-2xl text-base font-semibold transition-all hover:-translate-y-0.5 w-full sm:w-auto backdrop-blur-sm">
                <Clock className="h-5 w-5" />
                Browse Doctors
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              Transparent pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight">
              Simple,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">flexible plans</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Choose the plan that fits your healthcare needs. Upgrade or downgrade anytime.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-blue-500/5 p-6 sm:p-10 border border-slate-100 dark:border-slate-700">
            <PricingTable />
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Brand */}
            <div className="lg:col-span-1 space-y-5">
              <div className="flex items-center gap-2.5">
                <img src={Logo.src} alt="MediCure Logo" className="w-9 h-9 rounded-xl" />
                <span className="text-xl font-extrabold text-white">MediCure</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Revolutionizing healthcare delivery with technology that puts patients first. Expert care, anywhere.
              </p>
              <div className="flex gap-3">
                {[
                  <path key="tw" d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />,
                  <path key="li" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />,
                ].map((path, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 flex items-center justify-center transition-all duration-200">
                    <svg className="w-4 h-4 text-slate-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                      {path}
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              {
                title: "Platform",
                links: [
                  { label: "Find Doctors", href: "/doctors" },
                  { label: "Book Appointment", href: "/onboarding" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "AI Assistant", href: "#" },
                ],
              },
              {
                title: "Services",
                links: [
                  { label: "Telemedicine", href: "#" },
                  { label: "Mental Health", href: "#" },
                  { label: "Prescriptions", href: "#" },
                  { label: "Specialist Care", href: "#" },
                ],
              },
              {
                title: "Support",
                links: [
                  { label: "Help Center", href: "#" },
                  { label: "Contact Us", href: "/contact" },
                  { label: "FAQs", href: "#" },
                  { label: "Privacy Policy", href: "#" },
                ],
              },
            ].map((col, i) => (
              <div key={i} className="space-y-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">{col.title}</h3>
                <ul className="space-y-2.5">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <Link href={link.href} className="text-slate-500 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1.5 group">
                        <ChevronRight className="w-3 h-3 text-slate-700 group-hover:text-blue-400 transition-colors" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 mt-14 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">© 2025 MediCure. All rights reserved.</p>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              Built with care for better healthcare
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot Modal */}
      <ChatbotModal
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
    </div>
  );
}
