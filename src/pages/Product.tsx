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
      <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-20">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">PRODUCT</h1>
          <p className="text-xl text-slate-200">
            Wellness you can feel, results you can see.
          </p>
        </div>
      </section>

      {/* Product Collection Section */}
      <section className="py-20 bg-white">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 mb-16">
            {/* Left Column - Image */}
            <div className="relative">
              <div className="pointer-events-none absolute -inset-6 bg-gradient-to-br from-slate-200 via-white to-slate-200 blur-3xl" />
              <div className="relative overflow-hidden rounded-3xl bg-white/80 p-8 shadow-2xl backdrop-blur">
                <div className="absolute inset-0">
                  <div className="pointer-events-none absolute -left-16 top-10 h-40 w-40 rounded-full bg-gradient-to-br from-purple-200 via-fuchsia-200 to-slate-100 opacity-70 blur-3xl" />
                  <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-gradient-to-br from-teal-200 via-emerald-200 to-slate-100 opacity-70 blur-3xl" />
                  <div className="pointer-events-none absolute right-12 top-12 h-20 w-20 rounded-full border border-slate-200/70" />
                  <div className="pointer-events-none absolute bottom-12 left-10 h-16 w-36 rounded-full border border-slate-200/60" />
                </div>
                <div className="relative space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
                      Since 2012
                    </p>
                    <h3 className="text-3xl font-bold text-slate-900 font-display">Myura Apothecary</h3>
                    <p className="text-base text-slate-600 font-minimal">
                      Ritual-led wellness crafted through slow extraction, mindful sourcing, and uncompromising purity.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-sm text-slate-600">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Botanicals</p>
                        <p className="text-lg font-semibold text-slate-900">38 Wild-Harvested</p>
                      </div>
                      <p className="leading-relaxed">
                        Each blend balances adaptogens, antioxidants, and bioavailable minerals for daily rituals that feel
                        indulgent yet purposeful.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Craft Hours</p>
                        <p className="text-lg font-semibold text-slate-900">72 Slow-Steeped</p>
                      </div>
                      <p className="leading-relaxed">
                        Small-batch infusion ensures every capsule carries the full-spectrum essence of its botanical origin.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Text */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-slate-900 font-display">MYURA Product Collection</h2>
              <p className="text-xl text-slate-600 font-medium font-sharp">Your Wellness Transformation Starts Here</p>
              <p className="text-lg text-slate-700 font-minimal leading-relaxed">
                At Myura, we believe in the power of nature to heal, restore, and energize. Our carefully crafted 
                supplements blend ancient Ayurvedic wisdom with modern science to bring you the best of both worlds. 
                Each product is designed to work with your body's natural processes, providing gentle yet effective 
                support for your wellness journey.
              </p>
              <p className="text-lg text-slate-700 font-minimal leading-relaxed">
                Our formulations are created with purpose, addressing specific health needs while maintaining the 
                highest standards of purity and effectiveness. From energy and hormonal balance to gut health and 
                joint support, we have thoughtfully crafted blends for every aspect of your wellness.
              </p>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full px-4 py-3 pl-12 pr-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                  <Filter className="h-5 w-5" />
                  <span>Filter</span>
                </button>
                <select className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500">
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
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-950 text-white shadow-xl transition-transform duration-500 hover:-translate-y-1"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${product.accentGradient} opacity-90 transition-opacity duration-500 group-hover:opacity-100`}
                  aria-hidden="true"
                ></div>
                <div className="absolute inset-x-10 top-10 h-32 rounded-full bg-white/20 blur-3xl" aria-hidden="true"></div>
                <div className="relative z-10 flex h-full flex-col gap-6 p-6">
                  <div className="relative rounded-3xl bg-white/5 p-4 shadow-inner">
                    <ResponsiveProductImage
                      image={product.image}
                      className="aspect-square overflow-hidden rounded-2xl"
                      imgClassName="object-contain scale-100 transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {product.inStock && (
                      <div className="absolute left-6 top-6 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
                        In Stock
                      </div>
                    )}
                    <div className="absolute inset-x-8 bottom-6 h-24 rounded-full bg-white/10 blur-2xl" aria-hidden="true"></div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-200/80">
                        {product.headline}
                      </p>
                      <h3 className="text-2xl font-bold text-white">{product.name}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-amber-200">
                        {[...Array(product.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-slate-200/80">({product.reviews} artisan reviews)</span>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-200/90">
                      {product.notes.map((note) => (
                        <li key={note} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-white/60"></span>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto flex flex-col gap-4">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-semibold text-white">₹{product.price}</span>
                      <span className="text-lg text-white/60 line-through">₹{product.originalPrice}</span>
                    </div>
                    <Link
                      to={`/product/${product.id}`}
                      className="inline-flex items-center justify-center rounded-full bg-white/15 px-6 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-white/25"
                    >
                      Explore Ritual
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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

