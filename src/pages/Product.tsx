import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Filter, Search, ShieldCheck, Award, CheckCircle2 } from 'lucide-react';
import ResponsiveProductImage from '../components/ResponsiveProductImage';
import { productCatalog } from '../data/products';

const Product: React.FC = () => {
  const products = productCatalog;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-4 sm:py-6"
        data-aos="fade-down"
        data-aos-duration="900"
        data-aos-easing="ease-out-cubic"
        data-aos-once="true"
      >
        <div
          className="w-full mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-0.5 sm:space-y-2"
          data-aos="zoom-in"
          data-aos-delay="120"
          data-aos-duration="900"
          data-aos-easing="ease-out-cubic"
          data-aos-once="true"
        >
          <h1 className="text-lg sm:text-4xl font-bold text-white leading-tight tracking-[0.3em]">
            PRODUCT
          </h1>
          <p className="hidden sm:block text-sm sm:text-lg text-slate-200 leading-snug">
            Wellness you can feel, results you can see.
          </p>
        </div>
      </section>

      {/* Product Collection Section */}
      <section className="py-8 sm:py-20 bg-white">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Search and Filter Bar */}
          <div
            className="mb-8 sm:mb-10"
            data-aos="fade-up"
            data-aos-duration="850"
            data-aos-easing="ease-out-quart"
            data-aos-once="true"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 pl-12 text-xs sm:text-sm text-slate-600 shadow-[0_15px_35px_-28px_rgba(15,23,42,0.4)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-slate-500/70"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
              </div>
              <div className="flex w-full sm:w-auto items-center gap-2 sm:gap-4">
                <button className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-700 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.35)] transition-all duration-200 hover:border-slate-400">
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
                <select className="flex-1 sm:flex-none rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-xs sm:text-sm text-slate-700 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.35)] focus:border-slate-400 focus:outline-none">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div
            className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
            data-aos="fade-up"
        data-aos-duration="900"
        data-aos-delay="180"
        data-aos-easing="ease-out-cubic"
        data-aos-once="true"
          >
        {products.map((product, index) => {
              const discountPercent = Math.round(
                ((product.originalPrice - product.price) / product.originalPrice) * 100
              );

              return (
                <div
                  key={product.id}
                  className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-100 bg-slate-950 text-white shadow-xl transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] hover:-translate-y-1.5 hover:scale-[1.01]"
                  data-aos="fade-up"
                  data-aos-delay={160 + index * 80}
                  data-aos-duration="850"
                  data-aos-easing="ease-out-cubic"
                  data-aos-once="true"
                >
                  <div
                    className="absolute right-3 top-3 sm:right-4 sm:top-4 z-20 rounded-full bg-rose-500/95 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.3em] text-white shadow-lg backdrop-blur transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-1 group-hover:bg-rose-400/95"
                    data-aos="zoom-in"
                    data-aos-delay="220"
                    data-aos-duration="700"
                    data-aos-easing="ease-out-cubic"
                    data-aos-once="true"
                  >
                    Sale
                  </div>
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${product.accentGradient} opacity-90 transition-opacity duration-500 group-hover:opacity-100`}
                    aria-hidden="true"
                  ></div>
                  <div className="absolute inset-x-8 top-10 hidden sm:block h-32 rounded-full bg-white/20 blur-3xl" aria-hidden="true"></div>
                  <div className="relative z-10 flex h-full flex-col gap-3 p-3 sm:p-4">
                    <div className="relative">
                      <Link
                        to={`/product/${product.id}`}
                        className="relative block rounded-3xl bg-white/5 shadow-inner transition-transform duration-500 hover:scale-[1.01] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
                      >
                        <ResponsiveProductImage
                          image={product.image}
                          className="w-full aspect-square overflow-hidden rounded-3xl"
                          imgClassName="object-contain w-full h-full p-0 m-0 transition-transform duration-700 ease-out"
                        />
                      </Link>
                      {product.inStock && (
                        <div className="absolute left-6 top-6 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
                          In Stock
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          to={`/product/${product.id}`}
                          className="inline-flex text-xs font-semibold sm:text-lg text-white hover:text-myura-purple-200 transition-colors"
                        >
                          {product.name}
                        </Link>
                        <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5">
                          <div className="flex items-center gap-0.5 text-amber-200">
                            {[...Array(product.rating)].map((_, i) => (
                              <Star key={i} className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current" />
                            ))}
                          </div>
                          <span className="text-[9px] sm:text-[10px] font-semibold text-white/80">{product.rating}.0</span>
                        </div>
                      </div>
                      <span className="text-[8px] sm:text-xs uppercase tracking-[0.24em] text-white/60">
                        {product.reviews} reviews
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2 py-0.5 sm:px-3 sm:py-1 text-slate-900 shadow-[0_18px_36px_-24px_rgba(15,23,42,0.45)]">
                        <span className="inline-flex items-center justify-center rounded-full bg-slate-900 px-1 py-0.5 text-[7px] sm:text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
                          Deal
                        </span>
                        <span className="font-display text-xs sm:text-xl font-semibold tracking-tight">
                          ₹{product.price}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50 px-1 py-0.5 text-[7px] sm:text-[9px] font-semibold uppercase tracking-[0.24em] text-emerald-600">
                        Save {discountPercent}%
                      </span>
                      <span className="text-[6.5px] sm:text-[9px] font-semibold uppercase tracking-[0.24em] text-white/70">
                        MRP ₹{product.originalPrice}
                      </span>
                    </div>

                    <div className="mt-auto pt-1">
                      <Link
                        to={`/product/${product.id}`}
                        className="inline-flex w-full items-center justify-center rounded-full bg-white/15 px-4 py-1.5 text-[10px] sm:text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-white/25"
                      >
                        Explore Ritual
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          <div
            className="mt-12 text-center"
            data-aos="fade-up"
            data-aos-duration="850"
            data-aos-delay="220"
            data-aos-easing="ease-out-cubic"
            data-aos-once="true"
          >
            <button className="rounded-full bg-slate-900 px-10 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:bg-slate-700">
              Discover More Blends
            </button>
          </div>
        </div>
      </section>

      {/* Discover Benefits Section */}
      <section
        className="py-20 bg-stone-50"
        data-aos="fade-up"
        data-aos-duration="900"
        data-aos-easing="ease-out-cubic"
        data-aos-once="true"
      >
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div
              className="space-y-6"
              data-aos="fade-right"
              data-aos-delay="140"
              data-aos-duration="900"
              data-aos-easing="ease-out-cubic"
              data-aos-once="true"
            >
              <p className="text-sm text-slate-600 font-medium">Discover now Magical benefits of nature.</p>
              <h2 className="text-4xl font-bold text-slate-900 font-display">Your best health is waiting - are you?</h2>
              <p className="text-lg text-slate-800 font-display italic leading-relaxed tracking-tight">
                We build routines for every need: from boosting focus and calming your mind to soothing your gut and
                supporting flexible joints. Every blend is made in small, tested batches and fits effortlessly into your
                busy life. Start your journey to a better you.
              </p>
              <div className="space-y-6">
                <div className="space-y-2 text-left">
                  <p className="text-xs font-sharp tracking-[0.4em] text-slate-500 uppercase">
                    Certified Rituals
                  </p>
                  <h3 className="text-3xl font-display text-slate-900 leading-tight">
                    Credentials that protect your wellness
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col items-start gap-3 rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-display text-slate-900 uppercase tracking-[0.2em]">
                      GMP Certified
                    </p>
                    <p className="text-xs font-minimal text-slate-600 leading-relaxed">
                      WHO-GMP audited facility with stability-tested batches.
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-3 rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                      <Award className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-display text-slate-900 uppercase tracking-[0.2em]">
                      Lab Verified
                    </p>
                    <p className="text-xs font-minimal text-slate-600 leading-relaxed">
                      Each blend carries COA-backed potency and purity checks.
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-3 rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-display text-slate-900 uppercase tracking-[0.2em]">
                      Clean Label
                    </p>
                    <p className="text-xs font-minimal text-slate-600 leading-relaxed">
                      Non-GMO botanicals with transparent ingredient sourcing.
                    </p>
                  </div>
                </div>
              </div>
              <Link
                to="/product"
                className="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-display tracking-[0.2em] text-xs sm:text-sm rounded-full hover:bg-slate-700 transition-all"
              >
                Explore Now
              </Link>
            </div>

            {/* Right Column - Visual */}
            <div
              className="relative"
              data-aos="fade-left"
              data-aos-delay="220"
              data-aos-duration="900"
              data-aos-easing="ease-out-cubic"
              data-aos-once="true"
            >
              <div className="pointer-events-none absolute -inset-6 bg-gradient-to-br from-slate-300 via-white to-slate-200 blur-3xl" />
              <div className="relative overflow-hidden rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur">
                <div className="absolute inset-0">
                  <div className="pointer-events-none absolute left-12 top-10 h-12 w-40 rounded-full border border-slate-200/70" />
                  <div className="pointer-events-none absolute bottom-6 right-8 h-32 w-32 rounded-full border border-dashed border-slate-200/60" />
                  <div className="pointer-events-none absolute -right-12 top-0 h-48 w-48 rounded-full bg-gradient-to-tr from-amber-200 via-rose-200 to-white opacity-70 blur-3xl" />
                  <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gradient-to-br from-cyan-200 via-sky-200 to-white opacity-60 blur-3xl" />
                </div>
                <div className="relative flex items-center justify-center text-slate-700">
                  <div className="absolute inset-0 rounded-[30px] bg-gradient-to-br from-rose-100 via-emerald-50 to-slate-50 blur-2xl opacity-70" />
                  <div className="relative rounded-[26px] bg-white/80 shadow-xl border border-white/60 p-4">
                    <img
                      src="/184259779_e669ef7a-646b-48c9-b4d8-b73a0d499df2.png"
                      alt="Happy customers illustration"
                      className="w-full max-w-sm mx-auto object-contain drop-shadow-2xl"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Product;

