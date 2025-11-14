import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Filter, Search } from 'lucide-react';
import ResponsiveProductImage from '../components/ResponsiveProductImage';
import { productCatalog } from '../data/products';

const Product: React.FC = () => {
  const products = productCatalog;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-10 sm:py-20">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-1 sm:space-y-3">
          <h1 className="text-2xl sm:text-5xl font-bold text-white">PRODUCT</h1>
          <p className="hidden sm:block text-xl text-slate-200">
            Wellness you can feel, results you can see.
          </p>
        </div>
      </section>

      {/* Product Collection Section */}
      <section className="py-8 sm:py-20 bg-white">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative mb-10 sm:mb-16">
            <div className="pointer-events-none absolute -inset-6 bg-gradient-to-br from-purple-200/40 via-white to-emerald-200/40 blur-3xl" />
            <div className="relative grid grid-cols-1 items-center gap-8 sm:gap-10 lg:gap-12 lg:grid-cols-2">
            {/* Left Column - Image */}
            <div className="relative h-full hidden sm:block" data-aos="fade-up">
              <div className="relative h-full overflow-hidden rounded-3xl bg-white p-3 sm:p-4">
                <div className="pointer-events-none absolute -inset-3 sm:-inset-4 rounded-3xl bg-gradient-to-br from-myura-purple-200/50 via-white to-myura-green-200/40 blur-2xl"></div>
                <div className="relative flex h-full min-h-[210px] sm:min-h-[260px] lg:min-h-[320px] w-full items-center justify-center bg-transparent">
                  <img
                    src="/184259779_e669ef7a-646b-48c9-b4d8-b73a0d499df2.png"
                    alt="Happy customers illustration"
                    className="relative z-10 h-full w-auto max-h-[220px] sm:max-h-[280px] lg:max-h-[320px] object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Text */}
            <div className="space-y-4 sm:space-y-6 max-w-lg mx-auto lg:mx-0 text-center lg:text-left hidden sm:block" data-aos="fade-up" data-aos-delay="80">
              <p className="inline-flex items-center justify-center rounded-full bg-slate-900/5 px-3 py-1.5 text-[9px] sm:text-xs font-sharp uppercase tracking-[0.35em] text-slate-500">
                Myura Rituals
              </p>
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-4xl font-display text-slate-900 leading-tight">
                  <span className="font-bold">Myura </span>
                  <span className="font-light tracking-tight text-slate-500">Product Collection</span>
                </h2>
                <p className="text-lg sm:text-2xl font-display text-slate-800">
                  Nature-built formulas <span className="font-sharp text-myura-purple-600">crafted for daily balance.</span>
                </p>
              </div>
              <div className="space-y-2.5 text-sm sm:text-base text-slate-700 leading-relaxed">
                <p className="font-minimal">
                  Ayurvedic wisdom meets modern science so your body gets nutrients it recognises.
                </p>
                <p className="font-sharp italic text-slate-800">
                  Pick a ritual for focus, calm, gut harmony, or joint ease—every blend is small-batch and traceable.
                </p>
              </div>
            </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-8 sm:mb-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 pl-12 text-sm text-slate-600 shadow-[0_15px_35px_-28px_rgba(15,23,42,0.4)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-slate-500/70"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
              </div>
              <div className="flex w-full sm:w-auto items-center gap-2 sm:gap-4">
                <button className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.35)] transition-all duration-200 hover:border-slate-400">
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
                <select className="flex-1 sm:flex-none rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm text-slate-700 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.35)] focus:border-slate-400 focus:outline-none">
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
          <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const discountPercent = Math.round(
                ((product.originalPrice - product.price) / product.originalPrice) * 100
              );

              return (
                <div
                  key={product.id}
                  className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-950 text-white shadow-xl transition-transform duration-500 hover:-translate-y-1"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${product.accentGradient} opacity-90 transition-opacity duration-500 group-hover:opacity-100`}
                    aria-hidden="true"
                  ></div>
                  <div className="absolute inset-x-10 top-10 h-32 rounded-full bg-white/20 blur-3xl" aria-hidden="true"></div>
                  <div className="relative z-10 flex h-full flex-col gap-5 p-4 sm:p-6">
                    <div className="relative">
                      <Link
                        to={`/product/${product.id}`}
                        className="relative block rounded-3xl bg-white/5 p-3 sm:p-4 shadow-inner transition-transform duration-500 hover:scale-[1.01] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
                      >
                        <ResponsiveProductImage
                          image={product.image}
                          className="aspect-square overflow-hidden rounded-2xl"
                          imgClassName="object-contain scale-100 transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      </Link>
                      {product.inStock && (
                        <div className="absolute left-6 top-6 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
                          In Stock
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Link
                        to={`/product/${product.id}`}
                        className="inline-flex text-base sm:text-xl font-bold text-white hover:text-myura-purple-200 transition-colors"
                      >
                        {product.name}
                      </Link>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-1 text-amber-200">
                          {[...Array(product.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-[11px] sm:text-sm text-slate-200/80">({product.reviews})</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 sm:px-4 py-1 text-slate-900 shadow-[0_18px_36px_-24px_rgba(15,23,42,0.45)]">
                        <span className="inline-flex items-center justify-center rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                          Deal
                        </span>
                        <span className="font-display text-base sm:text-2xl font-semibold tracking-tight">
                          ₹{product.price}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-600">
                        Save {discountPercent}%
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">
                        MRP ₹{product.originalPrice}
                      </span>
                    </div>

                    <div className="mt-auto pt-2">
                      <Link
                        to={`/product/${product.id}`}
                        className="inline-flex w-full items-center justify-center rounded-full bg-white/15 px-6 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-white/25"
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
          <div className="mt-12 text-center">
            <button className="rounded-full bg-slate-900 px-10 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:bg-slate-700">
              Discover More Blends
            </button>
          </div>
        </div>
      </section>

      {/* Discover Benefits Section */}
      <section className="py-20 bg-stone-50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="space-y-6">
              <p className="text-sm text-slate-600 font-medium">Discover now Magical benefits of nature.</p>
              <h2 className="text-4xl font-bold text-slate-900 font-display">Your best health is waiting - are you?</h2>
              <p className="text-lg text-slate-700 font-minimal leading-relaxed">
                Experience the power of carefully selected herbs and botanicals that have been used for centuries 
                in Ayurvedic medicine. Our products are designed to work with your body's natural processes, 
                providing gentle yet effective support for your wellness journey.
              </p>
              <p className="text-lg text-slate-700 font-minimal leading-relaxed">
                Every ingredient is chosen for its proven benefits and synergistic effects, ensuring that you 
                get the maximum benefit from each product. We believe in transparency, so you'll always know 
                exactly what you're putting into your body.
              </p>
              <Link
                to="/product"
                className="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-sharp font-semibold rounded-lg hover:bg-slate-700 transition-colors"
              >
                Explore Now
              </Link>
            </div>

            {/* Right Column - Visual */}
            <div className="relative">
              <div className="pointer-events-none absolute -inset-6 bg-gradient-to-br from-slate-300 via-white to-slate-200 blur-3xl" />
              <div className="relative overflow-hidden rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur">
                <div className="absolute inset-0">
                  <div className="pointer-events-none absolute left-12 top-10 h-12 w-40 rounded-full border border-slate-200/70" />
                  <div className="pointer-events-none absolute bottom-6 right-8 h-32 w-32 rounded-full border border-dashed border-slate-200/60" />
                  <div className="pointer-events-none absolute -right-12 top-0 h-48 w-48 rounded-full bg-gradient-to-tr from-amber-200 via-rose-200 to-white opacity-70 blur-3xl" />
                  <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gradient-to-br from-cyan-200 via-sky-200 to-white opacity-60 blur-3xl" />
                </div>
                <div className="relative space-y-6 text-slate-700">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      Holistic Credentials
                    </p>
                    <h3 className="text-3xl font-bold text-slate-900 font-display">
                      Botanical benefits distilled with intention
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-100 bg-white/70 p-5 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Transparency</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">Full ingredient provenance</p>
                      <p className="mt-3 text-sm leading-relaxed">
                        Sourced from biodiverse farms with lab-verified potency reports available for every batch.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-white/70 p-5 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Synergy</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">Layered herbal pairings</p>
                      <p className="mt-3 text-sm leading-relaxed">
                        Harmonised blends of adaptogens, nervines, and tonics engineered for maximum bioavailability.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-white/70 p-5 shadow-sm sm:col-span-2">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Experience</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">Elevated, consistent rituals</p>
                      <p className="mt-3 text-sm leading-relaxed">
                        Each daily serving is calibrated to feel luxurious while anchoring meaningful, long-term wellness habits.
                      </p>
                    </div>
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

