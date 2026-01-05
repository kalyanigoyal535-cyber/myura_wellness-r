import React from 'react'
import { Link } from 'react-router-dom'
import {
    CheckCircle,
    ArrowRight,
    Award,
    FlaskConical,
    ShieldCheck,
    BadgeCheck,
    Medal,
  } from "lucide-react";
type Props = {}

const AboutMyuraWellness = (props: Props) => {
  return (

    <section className="py-14 sm:py-16 bg-white">
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1fr)] gap-10 items-start">
        <div
          className="relative flex flex-col items-center gap-4 mt-6 sm:mt-8 lg:mt-10"
          data-aos="zoom-in"
          data-aos-delay="90"
          data-aos-duration="650"
        >
          <div className="bg-white rounded-[2rem] border border-slate-100/70 overflow-hidden mx-auto max-w-[11.5rem] sm:max-w-[13rem]">
            <div className="absolute inset-0 bg-white"></div>
            <div className="relative flex items-center justify-center">
              <img
                src="/wellness.png"
                alt="Myura wellness illustration"
                className="w-full h-full object-cover transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        <div
          className="space-y-5"
          data-aos="fade-up"
          data-aos-delay="160"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[1.95rem] sm:text-[2.25rem] font-display font-semibold tracking-tight leading-snug">
              <span className="bg-gradient-to-r from-[#112c3b] via-[#421335] to-[#537790] bg-clip-text text-transparent">
                At Myura Wellness
              </span>
            </h2>
            <Link
              to="/product"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-sm sm:text-base font-semibold text-white shadow-[0_22px_40px_-18px_rgba(15,23,42,0.55)] transition-all duration-300 hover:bg-slate-800 sm:self-start"
              data-aos="zoom-in"
              data-aos-delay="260"
            >
              EXPLORE PRODUCTS
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-slate-700 leading-relaxed font-premium bg-gradient-to-r from-white via-[#f8fafc] to-white border border-slate-100 rounded-2xl px-4 sm:px-5 py-4 shadow-[0_22px_44px_-30px_rgba(15,23,42,0.25)]">
            We believe true well-being comes from nature. Our thoughtfully
            crafted Ayurvedic supplements blend ancient wisdom with modern
            science to help you feel your best, naturally. Experience
            everyday balance, energy, and restoration.
          </p>
          <div
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="flex flex-1 items-center gap-3 rounded-2xl bg-gradient-to-br from-[#f3f6f8] to-white border border-slate-100/70 shadow-[0_18px_32px_-30px_rgba(17,44,59,0.3)] px-3 py-2 sm:px-4">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#112c3b] to-[#2b4f73] text-white shadow-[0_10px_18px_rgba(17,44,59,0.3)]">
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <span className="text-slate-700 font-minimal text-[0.6rem] sm:text-xs">
                Clean Ingredients
              </span>
            </div>
            <div className="flex flex-1 items-center gap-3 rounded-2xl bg-gradient-to-br from-[#f3f6f8] to-white border border-slate-100/70  shadow-[0_18px_32px_-30px_rgba(66,19,53,0.3)] px-3 py-2 sm:px-4">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#112c3b] to-[#2b4f73] text-white shadow-[0_10px_18px_rgba(17,44,59,0.3)]">
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <span className="text-slate-700 font-minimal text-[0.6rem] sm:text-xs">
                Traditionally Trusted Herbs
              </span>
            </div>
            <div className="flex flex-1 items-center gap-3 rounded-2xl bg-gradient-to-br from-[#f3f6f8] to-white border border-slate-100/70 shadow-[0_18px_32px_-30px_rgba(87,133,122,0.3)] px-3 py-2 sm:px-4">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#112c3b] to-[#2b4f73] text-white shadow-[0_10px_18px_rgba(17,44,59,0.3)]">
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <span className="text-slate-700 font-minimal text-[0.6rem] sm:text-xs">
                No Harmful Additives
              </span>
            </div>
            <div className="flex flex-1 items-center gap-3 rounded-2xl bg-gradient-to-br from-[#f3f6f8] to-white border border-slate-100/70  shadow-[0_18px_32px_-30px_rgba(251,146,60,0.3)] px-3 py-2 sm:px-4">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#112c3b] to-[#2b4f73] text-white shadow-[0_10px_18px_rgba(17,44,59,0.3)]">
                <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <span className="text-slate-700 font-minimal text-[0.6rem] sm:text-xs">
                Highly Result-Oriented
              </span>
            </div>
            <div className="flex flex-1 items-center gap-3 rounded-2xl bg-gradient-to-br from-[#f3f6f8] to-white border border-slate-100/70   shadow-[0_18px_32px_-30px_rgba(59,130,246,0.3)] px-3 py-2 sm:px-4">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#112c3b] to-[#2b4f73] text-white shadow-[0_10px_18px_rgba(17,44,59,0.3)]">
                <FlaskConical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <span className="text-slate-700 font-minimal text-[0.6rem] sm:text-xs">
                Lab Tested
              </span>
            </div>
            <div className="flex flex-1 items-center gap-3 rounded-2xl bg-gradient-to-br from-[#f3f6f8] to-white border border-slate-100/70  shadow-[0_18px_32px_-30px_rgba(34,197,94,0.3)] px-3 py-2 sm:px-4">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#112c3b] to-[#2b4f73] text-white shadow-[0_10px_18px_rgba(17,44,59,0.3)]">
                <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <span className="text-slate-700 font-minimal text-[0.6rem] sm:text-xs">
                Verified Authentic Ingredients
              </span>
            </div>
            <div className="flex flex-1 items-center gap-3 rounded-2xl bg-gradient-to-br from-[#f3f6f8] to-white border border-slate-100/70  shadow-[0_18px_32px_-30px_rgba(234,179,8,0.3)] px-3 py-2 sm:px-4">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#112c3b] to-[#2b4f73] text-white shadow-[0_10px_18px_rgba(17,44,59,0.3)]">
                <BadgeCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <span className="text-slate-700 font-minimal text-[0.6rem] sm:text-xs">
                GMP Certified
              </span>
            </div>
            <div className="flex flex-1 items-center gap-3 rounded-2xl bg-gradient-to-br from-[#f3f6f8] to-white border border-slate-100/70  shadow-[0_18px_32px_-30px_rgba(236,72,153,0.3)] px-3 py-2 sm:px-4">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#112c3b] to-[#2b4f73] text-white shadow-[0_10px_18px_rgba(17,44,59,0.3)]">
                <Medal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <span className="text-slate-700 font-minimal text-[0.6rem] sm:text-xs">
                FSSAI
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  )
}

export default AboutMyuraWellness