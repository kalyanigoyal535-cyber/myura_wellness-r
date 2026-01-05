import React from 'react'
import { Sparkles, } from 'lucide-react'

type Props = {}

const IntroTextStrip = (props: Props) => {
  return (
    <section className="relative py-8 sm:py-12">
    <div className="absolute inset-0 bg-[#112c3b]"></div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(87,133,122,0.45),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(164,63,134,0.35),transparent_55%)] opacity-75"></div>
    <div
      className="relative w-full mx-auto px-4 sm:px-6 lg:px-8"
      data-aos="zoom-in"
      data-aos-delay="90"
    >
      <div className="relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] border border-white/12 bg-white/10 backdrop-blur-2xl shadow-[0_42px_85px_-40px_rgba(17,44,59,0.85)] px-5 sm:px-8 lg:px-12 py-10 sm:py-12 text-center">
        <div
          className="absolute -top-10 -left-8 h-28 w-28 rounded-full bg-[#3e8]/22 blur-3xl animate-[softPulse_7s_ease-in-out_infinite]"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute -bottom-12 -right-10 h-32 w-32 rounded-full bg-[#a43f86]/22 blur-3xl animate-[softPulse_5.5s_ease-in-out_infinite]"
          style={{ animationDelay: "2.2s" }}
        ></div>
        <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_60%)] opacity-55"></div>

        <div className="relative flex flex-col items-center gap-4">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3.5 py-1 text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80"
            data-aos="fade-up"
            data-aos-delay="120"
          >
            <Sparkles className="h-4 w-4 text-emerald-200" />
            Signature Ritual
          </div>

          <h2
            className="whitespace-nowrap text-[1.35rem] xs:text-[1.5rem] sm:text-[2.05rem] lg:text-[2.5rem] font-sharp font-semibold leading-tight tracking-[0.002em] text-white drop-shadow-[0_14px_28px_rgba(17,44,59,0.35)] text-center lg:text-left"
            data-aos="fade-up"
            data-aos-delay="160"
          >
            Your Wellness, Our Promise.
          </h2>
        </div>
      </div>
    </div>
  </section>
  )
}

export default IntroTextStrip