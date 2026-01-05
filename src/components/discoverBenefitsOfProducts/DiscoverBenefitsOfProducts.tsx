import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Award, CheckCircle2 } from 'lucide-react'
type Props = {}

const DiscoverBenefitsOfProducts = (props: Props) => {
  return (
    <section
    className="relative py-20 bg-stone-50 overflow-hidden"
    data-aos="fade-up"
    data-aos-duration="900"
    data-aos-easing="ease-out-cubic"
  >
    {/* Halo colors covering the whole section */}
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-300 via-white to-slate-200 blur-3xl opacity-60" />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-100 via-emerald-50 to-slate-50 blur-2xl opacity-50" />

    <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Column - Text */}
        <div
          className="space-y-4 translate-x-4 sm:translate-x-6"
          data-aos="fade-right"
          data-aos-delay="140"
          data-aos-duration="900"
          data-aos-easing="ease-out-cubic"
        >
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Discover now Magical benefits of nature.
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            Your best health is waiting - are you?
          </h2>
          <p className="text-sm sm:text-base text-slate-800 font-display italic leading-relaxed tracking-tight">
            We build routines for every need: from boosting focus and
            calming your mind to soothing your gut and supporting flexible
            joints. Every blend is made in small, tested batches and fits
            effortlessly into your busy life. Start your journey to a better
            you.
          </p>
          <div className="space-y-4">
            <div className="space-y-1.5 text-left">
              <p className="text-[10px] sm:text-xs font-sharp tracking-[0.4em] text-slate-500 uppercase">
                Certified Rituals
              </p>
              <h3 className="text-xl sm:text-2xl font-display text-slate-900 leading-tight">
                Credentials that protect your wellness
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col items-start gap-2 rounded-2xl border border-slate-100 bg-white/80 p-3 shadow-sm">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <p className="text-xs font-display text-slate-900 uppercase tracking-[0.2em]">
                  GMP Certified
                </p>
                <p className="text-[10px] sm:text-xs font-minimal text-slate-600 leading-relaxed">
                  WHO-GMP audited facility with stability-tested batches.
                </p>
              </div>
              <div className="flex flex-col items-start gap-2 rounded-2xl border border-slate-100 bg-white/80 p-3 shadow-sm">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                  <Award className="h-5 w-5" />
                </div>
                <p className="text-xs font-display text-slate-900 uppercase tracking-[0.2em]">
                  Lab Verified
                </p>
                <p className="text-[10px] sm:text-xs font-minimal text-slate-600 leading-relaxed">
                  Each blend carries COA-backed potency and purity checks.
                </p>
              </div>
              <div className="flex flex-col items-start gap-2 rounded-2xl border border-slate-100 bg-white/80 p-3 shadow-sm">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-xs font-display text-slate-900 uppercase tracking-[0.2em]">
                  Clean Label
                </p>
                <p className="text-[10px] sm:text-xs font-minimal text-slate-600 leading-relaxed">
                  Non-GMO botanicals with transparent ingredient sourcing.
                </p>
              </div>
            </div>
          </div>
          <Link
            to="/product"
            className="inline-flex items-center px-5 py-2.5 bg-slate-900 text-white font-display tracking-[0.2em] text-xs rounded-full hover:bg-slate-700 transition-all"
          >
            Explore Now
          </Link>
        </div>

        {/* Right Column - Visual */}
        <div
          className="relative"
          data-aos="zoom-in"
          data-aos-delay="220"
          data-aos-duration="1000"
          data-aos-easing="ease-out-cubic"
        >
          <div className="relative overflow-hidden rounded-3xl bg-transparent">
            <img
              src="/color changed.png"
              alt="Myura wellness Instagram illustration with supplement bottles"
              className="w-full object-contain translate-x-4 sm:translate-x-6"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default DiscoverBenefitsOfProducts