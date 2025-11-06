import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, Star, Heart, MessageCircle } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState<string | null>('benefits');
  const [showCart, setShowCart] = useState(false);

  const product = {
    id: 1,
    name: "DIA CARE",
    price: 799,
    originalPrice: 999,
    image: "/api/placeholder/400/400",
    rating: 5,
    reviews: 128,
    inStock: true,
    description: "MYURA Diabetes Management is an Ayurvedic wellness formula created for those looking to support healthy blood sugar levels without relying on synthetic or harsh solutions.",
    benefits: [
      "Supports balanced blood sugar levels naturally",
      "Improves energy, metabolism, and sugar control",
      "Helps curb cravings and reduces fatigue after meals",
      "Aids in pancreatic, liver, and cardiovascular health",
      "Promotes a steady, non-spiking energy flow"
    ],
    keyIngredients: "Your liver works around the clock to filter out toxins, regulate metabolism, and keep your body balanced — and it deserves the same care in return. MYURA Liver Detox Formula is a powerful Ayurvedic blend designed to gently cleanse and support liver function, aid digestion, and promote inner clarity.",
    suitableFor: "Whether you're feeling heavy, sluggish, or dealing with lifestyle stressors like processed foods or alcohol, this herbal supplement helps reset your system and restore your natural rhythm — the Ayurvedic way.",
    howToUse: "Take 2 capsules twice daily with water, preferably after meals. For best results, maintain a balanced diet and regular exercise routine.",
    faqs: "Your liver works around the clock to filter out toxins, regulate metabolism, and keep your body balanced — and it deserves the same care in return. MYURA Liver Detox Formula is a powerful Ayurvedic blend designed to gently cleanse and support liver function, aid digestion, and promote inner clarity."
  };

  const accordionSections = [
    { id: 'benefits', title: 'Benefits', content: product.benefits, isList: true },
    { id: 'description', title: 'Description', content: product.description, isList: false },
    { id: 'keyIngredients', title: 'Key Ingredients', content: product.keyIngredients, isList: false },
    { id: 'suitableFor', title: 'Suitable For', content: product.suitableFor, isList: false },
    { id: 'howToUse', title: 'How To Use', content: product.howToUse, isList: false },
    { id: 'faqs', title: 'Faqs', content: product.faqs, isList: false }
  ];

  const relatedProducts = [
    { id: 2, name: "LIVER DETOX FORMULA", price: 699, originalPrice: 999, image: "/api/placeholder/200/200" },
    { id: 3, name: "BONE & JOINT SUPPORT", price: 4543, originalPrice: 5999, image: "/api/placeholder/200/200" },
    { id: 4, name: "GUT AND DIGESTION", price: 999, originalPrice: 1299, image: "/api/placeholder/200/200" },
    { id: 5, name: "WOMEN'S HEALTH PLUS", price: 499, originalPrice: 699, image: "/api/placeholder/200/200" }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">PRODUCT</h1>
          <p className="text-xl text-slate-200">Wellness you can feel, results you can see.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="relative">
                <div className="w-64 h-64 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl mx-auto flex items-center justify-center mb-6">
                  <div className="w-48 h-48 bg-white rounded-xl shadow-lg flex items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">MYURA</span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-slate-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Sale!
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(product.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-slate-600 ml-2">({product.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-slate-900">₹{product.price}</span>
              <span className="text-xl text-slate-400 line-through">₹{product.originalPrice}</span>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => setShowCart(true)}
                className="flex-1 bg-slate-600 text-white py-3 px-6 rounded-lg hover:bg-slate-700 transition-colors font-semibold"
              >
                ADD TO CART
              </button>
            </div>

            {/* Accordion Sections */}
            <div className="space-y-4">
              {accordionSections.map((section) => (
                <div key={section.id} className="bg-white rounded-lg border border-gray-200">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-slate-900">{section.title}</span>
                    {expandedSection === section.id ? (
                      <Minus className="h-5 w-5 text-slate-500" />
                    ) : (
                      <Plus className="h-5 w-5 text-slate-500" />
                    )}
                  </button>
                  {expandedSection === section.id && (
                    <div className="px-6 pb-4">
                      {section.isList ? (
                        <ul className="space-y-2">
                          {(section.content as string[]).map((item, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-slate-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-slate-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-700 leading-relaxed">{section.content}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* A Perfect Ingredient & Combination Section */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">A Perfect Ingredient & Combination</h2>
            <p className="text-lg text-slate-700 max-w-4xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full"></div>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Nano Vitamin C</h3>
                <p className="text-sm text-slate-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="mt-20">
          <div className="bg-blue-900 rounded-2xl p-12 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">YOUR JOURNEY TO NATURAL WELLNESS START HERE</h2>
              <p className="text-xl mb-6">FUEL YOUR DAY</p>
              <button className="bg-slate-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors">
                MYURA'S HERE!
              </button>
            </div>
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-0">
              <div className="flex space-x-4">
                <div className="w-16 h-24 bg-white rounded-lg"></div>
                <div className="w-16 h-24 bg-blue-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Benefits Diagram */}
        <section className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[1, 2].map((item) => (
              <div key={item} className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"></div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full"></div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-purple-500 rounded-full"></div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">WOMEN'S HEALTH PLUS</h3>
                <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Immunity</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Hormonal Balance</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Strength</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Energy Control</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related Products */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Related products</h2>
            <p className="text-lg text-slate-700 max-w-4xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg"></div>
                  </div>
                  <p className="text-sm text-slate-500 mb-1">MYURA</p>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{product.name}</h3>
                  <div className="flex justify-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className="flex justify-center items-center space-x-2 mb-4">
                    <span className="text-xl font-bold text-slate-900">₹{product.price}</span>
                    <span className="text-lg text-slate-400 line-through">₹{product.originalPrice}</span>
                  </div>
                  <button className="w-full bg-slate-600 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors">
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Floating Cart */}
      {showCart && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">CART</h3>
              <button
                onClick={() => setShowCart(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <Minus className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded"></div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900">{product.name}</h4>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center border border-gray-300 rounded">
                    <button className="px-2 py-1 hover:bg-gray-100">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-2 py-1 text-sm">3</span>
                    <button className="px-2 py-1 hover:bg-gray-100">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="font-semibold text-slate-900">₹2,397.00</span>
                </div>
              </div>
              <button className="text-red-500 text-sm">Remove</button>
            </div>
            
            <button className="w-full bg-slate-600 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors">
              Checkout - ₹2,397.00
            </button>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <div className="flex flex-col items-end space-y-4">
          <div className="relative">
            <button className="w-12 h-12 bg-slate-600 text-white rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors">
              <MessageCircle className="h-6 w-6" />
            </button>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              1
            </span>
          </div>
          <button className="bg-gray-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
            Contact us
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

