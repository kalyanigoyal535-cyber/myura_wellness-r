import React, { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Plus, Minus, Star, Heart } from 'lucide-react';
import ResponsiveProductImage from '../components/ResponsiveProductImage';
import { getProductById, getRelatedProducts } from '../data/products';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState<string | null>('benefits');

  const relatedProducts = useMemo(
    () => (product ? getRelatedProducts(product.id) : []),
    [product]
  );

  if (!product) {
    return <Navigate to="/product" replace />;
  }

  const heroImage = product.gallery[0] ?? product.image;
  const supportingGallery = product.gallery.slice(1, 4);

  const accordionSections = [
    { id: 'benefits', title: 'Benefits', content: product.benefits, isList: true },
    { id: 'keyIngredients', title: 'Key Ingredients', content: product.keyIngredients, isList: false },
    { id: 'suitableFor', title: 'Suitable For', content: product.suitableFor, isList: false },
    { id: 'howToUse', title: 'How To Use', content: product.howToUse, isList: false },
    { id: 'faqs', title: 'FAQs', content: product.faqs, isList: false },
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSection((current) => (current === sectionId ? null : sectionId));
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-20">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-300">
            Myura Apothecary
          </p>
          <h1 className="text-5xl font-bold text-white mt-4">{product.name}</h1>
          <p className="text-xl text-slate-200 mt-6">{product.heroTagline}</p>
        </div>
      </section>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl bg-white/90 p-6 shadow-2xl backdrop-blur">
              <div className="pointer-events-none absolute -left-12 top-16 h-40 w-40 rounded-full bg-gradient-to-br from-purple-200 via-white to-slate-100 opacity-60 blur-3xl" />
              <div className="pointer-events-none absolute right-0 bottom-0 h-48 w-48 rounded-full bg-gradient-to-br from-emerald-200 via-white to-slate-100 opacity-50 blur-3xl" />
              <div className="relative overflow-hidden rounded-2xl bg-slate-900/5">
                <ResponsiveProductImage
                  image={heroImage}
                  className="aspect-[4/5]"
                  imgClassName="object-contain p-6"
                />
              </div>
            </div>
            {supportingGallery.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {supportingGallery.map((galleryImage) => (
                  <div
                    key={`${galleryImage.fallback}-${galleryImage.alt}`}
                    className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-3 shadow-lg"
                  >
                    <ResponsiveProductImage
                      image={galleryImage}
                      className="aspect-square overflow-hidden rounded-xl bg-slate-900/5"
                      imgClassName="object-contain p-4"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <Link
                to="/product"
                className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 transition-colors hover:text-slate-700"
              >
                ← Product Collection
              </Link>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
                {product.headline}
              </p>
              <h2 className="text-4xl font-bold text-slate-900">{product.name}</h2>
              <p className="text-lg leading-relaxed text-slate-700">{product.summary}</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: product.rating }).map((_, index) => (
                    <Star key={index} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-slate-500">({product.reviews} artisan reviews)</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-slate-900">₹{product.price}</span>
                <span className="text-lg text-slate-400 line-through">₹{product.originalPrice}</span>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                {product.inStock ? 'In Stock' : 'Back Soon'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-full border border-slate-200 bg-white/70">
                <button
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="px-4 py-3 transition-colors hover:bg-slate-100"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4 text-slate-700" />
                </button>
                <span className="px-6 py-3 text-base font-semibold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((value) => value + 1)}
                  className="px-4 py-3 transition-colors hover:bg-slate-100"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4 text-slate-700" />
                </button>
              </div>
              <button className="inline-flex grow basis-48 items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:bg-slate-700">
                Add to cart
              </button>
              <button
                className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                aria-label="Save to wishlist"
              >
                <Heart className="h-5 w-5" />
              </button>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Highlights</p>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {product.notes.map((note) => (
                  <li
                    key={note}
                    className="flex gap-3 rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-700 shadow-sm"
                  >
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-slate-900" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <h3 className="text-3xl font-bold text-slate-900">Inside the ritual</h3>
            <p className="text-lg leading-relaxed text-slate-700">{product.description}</p>
          </div>
          <div className="space-y-4 lg:col-span-3">
            {accordionSections.map((section) => (
              <div key={section.id} className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-slate-50"
                >
                  <span className="text-base font-semibold text-slate-900">{section.title}</span>
                  {expandedSection === section.id ? (
                    <Minus className="h-5 w-5 text-slate-500" />
                  ) : (
                    <Plus className="h-5 w-5 text-slate-500" />
                  )}
                </button>
                {expandedSection === section.id && (
                  <div className="px-6 pb-6">
                    {section.isList ? (
                      <ul className="space-y-3">
                        {(section.content as string[]).map((item) => (
                          <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                            <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-slate-900" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm leading-relaxed text-slate-700">{section.content}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl bg-slate-900 text-white">
          <div className="relative px-6 py-14 sm:px-10 lg:px-16">
            <div className="pointer-events-none absolute -left-24 top-12 h-56 w-56 rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-slate-900 opacity-60 blur-3xl" />
            <div className="pointer-events-none absolute right-0 bottom-0 h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-500 to-slate-900 opacity-50 blur-3xl" />
            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4 max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200">
                  Daily devotion
                </p>
                <h3 className="text-3xl font-bold leading-tight lg:text-4xl">
                  {product.heroTagline}
                </h3>
                <p className="text-lg text-slate-200">
                  Build a mindful ritual and experience how consistent nourishment transforms the way you
                  move, feel, and glow.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full bg-white/10 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:bg-white/20"
              >
                Talk to a specialist
              </Link>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-3xl font-bold text-slate-900">You may also love</h3>
              <Link
                to="/product"
                className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 transition-colors hover:text-slate-700"
              >
                View all products
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  to={`/product/${related.id}`}
                  className="group flex flex-col gap-5 overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="overflow-hidden rounded-2xl bg-slate-900/5 p-4">
                    <ResponsiveProductImage
                      image={related.image}
                      className="aspect-square overflow-hidden rounded-xl"
                      imgClassName="object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      {related.headline}
                    </p>
                    <h4 className="text-xl font-semibold text-slate-900">{related.name}</h4>
                    <div className="flex items-baseline gap-3 text-slate-900">
                      <span className="text-lg font-semibold">₹{related.price}</span>
                      <span className="text-sm text-slate-400 line-through">₹{related.originalPrice}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

