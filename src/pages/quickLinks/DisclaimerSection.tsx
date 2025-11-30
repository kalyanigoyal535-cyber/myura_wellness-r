import React from "react";

const DisclaimerSection = () => {
  return (
    <section className="w-full bg-slate-50 py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <p className="inline-flex items-center text-xs font-semibold tracking-wide uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-3">
            Legal &amp; Safety
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3">
            Disclaimer – Myura Wellness
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto">
            Please read this carefully to understand how to safely use our products
            and the information shared on this website.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.08)] rounded-3xl p-6 md:p-8 space-y-6 md:space-y-7">
          {/* Intro */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900">
              Crafted with care, rooted in Ayurveda
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              At <span className="font-semibold">MYURA WELLNESS</span>, our Ayurvedic
              supplements are made with care in FSSAI-approved facilities, using ingredients
              rooted in ancient wisdom and supported by modern science. Our aim is to support
              your everyday wellness — naturally, gently, and effectively.
            </p>
          </div>

          {/* Information & Intent */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900">
              Purpose of information on this website
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              All the information and content on this website — including product details,
              wellness articles, and tips — is meant to guide and inspire healthier living.
              While we believe in the power of plant-based support, our products are{" "}
              <span className="font-semibold">
                not intended to diagnose, treat, cure, or prevent any disease.
              </span>
            </p>
          </div>

          {/* Individual differences */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900">
              Every body is different
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              Please remember that every body is different. Before starting any new supplement
              or wellness routine, we strongly recommend speaking with a healthcare professional —{" "}
              especially if you are pregnant, nursing, have a medical condition, or are on medication.
            </p>
          </div>

          {/* No medical advice */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900">
              No medical advice
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              <span className="font-semibold">MYURA WELLNESS</span> does not offer medical advice,
              and nothing on this site should be taken as a substitute for professional consultation,
              diagnosis, or treatment from a qualified healthcare provider.
            </p>
          </div>

          {/* Closing note */}
          <div className="mt-4 border-t border-slate-100 pt-5 md:pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <p className="text-sm md:text-base leading-relaxed text-slate-700 max-w-xl">
                We’re here to walk beside you on your wellness journey — honestly, respectfully,
                and with your well-being at heart.
              </p>
              <div className="text-xs md:text-sm text-slate-500 md:text-right">
                Last updated:{" "}
                <span className="font-medium text-slate-700">
                  {new Date().getFullYear()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DisclaimerSection;
