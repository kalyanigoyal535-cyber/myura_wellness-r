import React from "react";

type Props = {};

const BrandDirectorySection = (props: Props) => {
  return (
    <section className="w-full bg-slate-50 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <p className="inline-flex items-center text-xs font-semibold tracking-wide uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-3">
            Brand Directory
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3">
            Discover MYURA WELLNESS
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto">
            A curated overview of our philosophy, product categories, and key
            links to help you explore the MYURA ecosystem with ease.
          </p>
        </div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 md:gap-8">
          {/* Left: About + Products + Philosophy */}
          <div className="space-y-6 md:space-y-7">
            {/* About MYURA */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.08)] rounded-3xl p-6 md:p-7 space-y-3">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
                About MYURA
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-slate-600">
                <span className="font-semibold">MYURA WELLNESS</span> blends ancient
                Ayurvedic wisdom with modern clinical research to deliver personalized
                wellness solutions. Our formulations are science-backed,
                FSSAI-compliant, and made using standardized herbal extracts and
                nutraceutical bioactives.
              </p>
            </div>

            {/* Product Categories */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.08)] rounded-3xl p-6 md:p-7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
                  Product Categories
                </h2>
                <span className="hidden md:inline-flex text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                  Ayurveda-first formulations
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {[
                  "Men's Vitality Booster",
                  "Women's Health Plus",
                  "Daily Ayurvedic Multivitamins",
                  "Gut and Digestion Support",
                  "Bone and Joint Support",
                  "Shilajit Gold Resins",
                  "Omega-3 Plant-Based",
                  "Liver Detox Formula",
                  "Diabetes Management",
                ].map((item) => (
                  <div
                    key={item}
                    className="group rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-emerald-50/70 hover:border-emerald-100 transition-all duration-200 p-3 md:p-4 cursor-default"
                  >
                    <p className="text-sm font-medium text-slate-800 group-hover:text-emerald-800 leading-snug">
                      {item}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 group-hover:text-emerald-700/80">
                      View products in this range
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Philosophy */}
            <div className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border border-emerald-100/60 rounded-3xl p-6 md:p-7 shadow-[0_14px_35px_rgba(16,185,129,0.15)]">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-2">
                Our Philosophy
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-slate-700">
                We believe wellness starts from within. That’s why every MYURA product
                is designed to heal, energize, and restore balance—without harmful
                additives. Our mission is to support long-term vitality through
                nature-led, clinically aligned formulations that respect your body’s
                natural rhythm.
              </p>
            </div>
          </div>

          {/* Right: Quick Links + Customer Support */}
          <div className="space-y-6 md:space-y-7">
            {/* Quick Links */}
            {/* <div className="bg-white/80 backdrop-blur-sm border border-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.08)] rounded-3xl p-6 md:p-7">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-3">
                Quick Links
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mb-4">
                Navigate to key policy and support pages across the MYURA ecosystem.
              </p>
              <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
                <a
                  href="/terms-and-conditions"
                  className="flex items-center justify-between rounded-2xl border border-slate-100 px-3 py-2 hover:border-emerald-200 hover:bg-emerald-50/60 transition-all"
                >
                  <span className="text-slate-800">Terms &amp; Conditions</span>
                  <span className="text-xs text-emerald-700">View</span>
                </a>
                <a
                  href="/privacy-policy"
                  className="flex items-center justify-between rounded-2xl border border-slate-100 px-3 py-2 hover:border-emerald-200 hover:bg-emerald-50/60 transition-all"
                >
                  <span className="text-slate-800">Privacy Policy</span>
                  <span className="text-xs text-emerald-700">View</span>
                </a>
                <a
                  href="/return-refund-policy"
                  className="flex items-center justify-between rounded-2xl border border-slate-100 px-3 py-2 hover:border-emerald-200 hover:bg-emerald-50/60 transition-all"
                >
                  <span className="text-slate-800">Return &amp; Refund Policy</span>
                  <span className="text-xs text-emerald-700">View</span>
                </a>
                <a
                  href="/disclaimer"
                  className="flex items-center justify-between rounded-2xl border border-slate-100 px-3 py-2 hover:border-emerald-200 hover:bg-emerald-50/60 transition-all"
                >
                  <span className="text-slate-800">Disclaimer</span>
                  <span className="text-xs text-emerald-700">View</span>
                </a>
                <a
                  href="/faq"
                  className="flex items-center justify-between rounded-2xl border border-slate-100 px-3 py-2 hover:border-emerald-200 hover:bg-emerald-50/60 transition-all"
                >
                  <span className="text-slate-800">FAQs</span>
                  <span className="text-xs text-emerald-700">View</span>
                </a>
                <a
                  href="/contact"
                  className="flex items-center justify-between rounded-2xl border border-slate-100 px-3 py-2 hover:border-emerald-200 hover:bg-emerald-50/60 transition-all"
                >
                  <span className="text-slate-800">Contact Us</span>
                  <span className="text-xs text-emerald-700">Reach out</span>
                </a>
              </nav>
            </div> */}

            {/* Customer Support */}
            <div className="bg-slate-900 text-slate-50 rounded-3xl p-6 md:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.4)] flex flex-col gap-4">
              <h2 className="text-lg md:text-xl font-semibold">
                Customer Support
              </h2>
              <p className="text-sm md:text-base text-slate-200">
                Need help with an order, product, or wellness guidance? Our support
                team is here to assist you.
              </p>

              <div className="space-y-3 text-sm md:text-base">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5">📍</span>
                  <p>
                    <span className="text-slate-300">
                      Store / Office Address:
                    </span>{" "}
                    <span className="font-medium">
                      [Location to be inserted]
                    </span>
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="mt-0.5">📧</span>
                  <p>
                    <span className="text-slate-300">Email:</span>{" "}
                    <span className="font-medium">
                      [support email to be inserted]
                    </span>
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="mt-0.5">📞</span>
                  <p>
                    <span className="text-slate-300">Phone:</span>
                    <span className="font-semibold text-emerald-300">
                      +91-9133001177
                    </span>
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center w-full md:w-auto rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-900 text-sm font-semibold px-4 py-2.5 transition-colors"
                >
                  Chat with Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandDirectorySection;
