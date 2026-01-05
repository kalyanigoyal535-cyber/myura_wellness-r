import React from "react";
import { Truck, Shield, Headphones, CheckCircle } from "lucide-react";
type Props = {};

const MyuraAdvantage = (props: Props) => {
  return (
    <section className="relative py-14 sm:py-16 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-emerald-100/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-20 right-24 h-40 w-40 rounded-full bg-emerald-200/20 blur-[100px]" />
      <div className="absolute -bottom-16 left-16 h-32 w-32 rounded-full bg-sky-200/25 blur-[90px]" />
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-white/70 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-700 shadow-[0_16px_40px_-34px_rgba(16,185,129,0.65)]">
            Myura Advantages
          </span>
          <h2 className="mt-3 text-xl sm:text-2xl font-display font-semibold text-slate-900">
            Concierge Care For Every Order
          </h2>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {[
            {
              id: "shipping",
              label: "Free Shipping",
              sublabel: "₹699+ orders",
              icon: Truck,
              halo: "from-[#0F2A44]/85 to-[#0F2A44]/40",
              ring: "ring-[#0F2A44]/30",
            },
            {
              id: "secure",
              label: "Secure Payment",
              sublabel: "256-bit",
              icon: Shield,
              halo: "from-[#0F2A44]/85 to-[#0F2A44]/40",
              ring: "ring-[#0F2A44]/30",
            },
            {
              id: "guarantee",
              label: "30-Day Guarantee",
              sublabel: "Easy exchange",
              icon: CheckCircle,
              halo: "from-[#0F2A44]/85 to-[#0F2A44]/40",
              ring: "ring-[#0F2A44]/30",
            },
            {
              id: "support",
              label: "24/7 Support",
              sublabel: "Concierge help",
              icon: Headphones,
              halo: "from-[#0F2A44]/85 to-[#0F2A44]/40",
              ring: "ring-[#0F2A44]/30",
            },
          ].map(({ id, label, sublabel, icon: Icon, halo, ring }, index) => (
            <div
              key={id}
              className="group relative overflow-hidden rounded-3xl border border-white/40 bg-white/[0.9] shadow-[0_20px_55px_-42px_rgba(15,23,42,0.28)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_-48px_rgba(15,23,42,0.38)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative flex flex-col gap-3 p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div
                    className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${halo} ring-4 ${ring} shadow-[0_18px_28px_-18px_rgba(16,185,129,0.35)] transition-transform duration-500 group-hover:scale-105`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400/80">
                    0{index + 1}
                  </span>
                </div>
                <div className="space-y-0.5 text-left">
                  <h3 className="text-base font-semibold text-slate-900 font-sharp">
                    {label}
                  </h3>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {sublabel}
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-12 -right-12 h-24 w-24 rounded-full bg-emerald-200/35 blur-[70px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyuraAdvantage;
