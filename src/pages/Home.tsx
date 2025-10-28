import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Truck, Shield, Headphones, CheckCircle, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const products = [
    {
      id: 1,
      name: "DIA CARE",
      price: 799,
      originalPrice: 999,
      image: "/api/placeholder/200/200",
      pedestalColor: "bg-purple-500",
      rating: 5
    },
    {
      id: 2,
      name: "LIVER DETOX FORMULA",
      price: 699,
      originalPrice: 999,
      image: "/api/placeholder/200/200",
      pedestalColor: "bg-teal-500",
      rating: 5
    },
    {
      id: 3,
      name: "BONE & JOINT SUPPORT",
      price: 4543,
      originalPrice: 5999,
      image: "/api/placeholder/200/200",
      pedestalColor: "bg-blue-600",
      rating: 5
    },
    {
      id: 4,
      name: "GUT AND DIGESTION",
      price: 999,
      originalPrice: 1299,
      image: "/api/placeholder/200/200",
      pedestalColor: "bg-amber-600",
      rating: 5
    },
    {
      id: 5,
      name: "WOMEN'S HEALTH PLUS",
      price: 499,
      originalPrice: 699,
      image: "/api/placeholder/200/200",
      pedestalColor: "bg-pink-500",
      rating: 5
    },
    {
      id: 6,
      name: "MEN'S VITALITY BOOSTER",
      price: 899,
      originalPrice: 1199,
      image: "/api/placeholder/200/200",
      pedestalColor: "bg-blue-800",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-myura-green-100 to-myura-green-200 py-20">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-myura-green-300 rounded-full opacity-20"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-myura-green-400 rounded-full opacity-30"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Wellness That Radiates From Within
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                Because your wellness deserves better - thoughtfully made Ayurvedic solutions that energize, restore, and support you through every stage of life.
              </p>
              <Link
                to="/product"
                className="inline-flex items-center px-8 py-4 bg-myura-green-600 text-white font-semibold rounded-lg hover:bg-myura-green-700 transition-colors"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
                <div className="flex justify-center items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-full"></div>
                  </div>
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-teal-500 rounded-full"></div>
                  </div>
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-pink-500 rounded-full"></div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">MYURA</h3>
                  <p className="text-gray-600">Wellness Collection</p>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-myura-green-400 rounded-full opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-myura-green-300 rounded-full opacity-40"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Text Strip */}
      <section className="py-8 bg-gradient-to-r from-myura-green-50 to-myura-green-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-gray-700">
            Ayurvedic wellness made simple. Myura offers honest, natural supplements for daily vitality, balance, and better living—no shortcuts, just nature.
          </p>
        </div>
      </section>

      {/* At Myura Wellness Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">MYURA</h3>
                  <p className="text-gray-600">Women's Health Plus</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">At Myura Wellness</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                We believe in the power of nature to heal, restore, and energize. Our carefully crafted supplements blend ancient Ayurvedic wisdom with modern science to bring you the best of both worlds.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-myura-green-600" />
                  <span className="text-gray-700">Clean Ingredients</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-myura-green-600" />
                  <span className="text-gray-700">Traditionally Trusted Herbs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-myura-green-600" />
                  <span className="text-gray-700">No Harmful Additives</span>
                </div>
              </div>
              <Link
                to="/product"
                className="inline-flex items-center px-6 py-3 bg-myura-green-600 text-white font-semibold rounded-lg hover:bg-myura-green-700 transition-colors"
              >
                Explore Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Products Section */}
      <section className="py-20 bg-myura-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">EXPLORE PRODUCTS</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Pure, effective, and made for you - explore the MYURA collection for everyday health and vitality.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative mb-6">
                  <div className={`w-24 h-24 ${product.pedestalColor} rounded-full mx-auto flex items-center justify-center mb-4`}>
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">MYURA</p>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                    <div className="flex justify-center space-x-1 mb-3">
                      {[...Array(product.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="flex justify-center items-center space-x-2 mb-4">
                      <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                      <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                    </div>
                    <button className="w-full bg-myura-green-600 text-white py-2 px-4 rounded-lg hover:bg-myura-green-700 transition-colors">
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Guarantees */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-myura-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-myura-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">FREE SHIPPING</h3>
              <p className="text-sm text-gray-600">On all orders above ₹699, No hidden charges</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-myura-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-myura-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">SECURE PAYMENT</h3>
              <p className="text-sm text-gray-600">Safe & encrypted</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-myura-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-myura-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">GUARANTEE</h3>
              <p className="text-sm text-gray-600">Easy replacements</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-myura-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-myura-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 SERVICE</h3>
              <p className="text-sm text-gray-600">Need help? Our team is always here to assist you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Your best health is waiting section */}
      <section className="py-20 bg-myura-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">MYURA</h3>
                  <p className="text-gray-600">DIA CARE</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <p className="text-sm text-myura-green-600 font-medium">Discover now Magical benefits of nature.</p>
              <h2 className="text-4xl font-bold text-gray-900">Your best health is waiting - are you?</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Experience the power of carefully selected herbs and botanicals that have been used for centuries in Ayurvedic medicine. Our products are designed to work with your body's natural processes, providing gentle yet effective support for your wellness journey.
              </p>
              <Link
                to="/product"
                className="inline-flex items-center px-6 py-3 bg-myura-green-600 text-white font-semibold rounded-lg hover:bg-myura-green-700 transition-colors"
              >
                Explore Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Awaken Your Energy Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">Awaken Your Energy</h2>
              <p className="text-xl text-myura-green-600 font-medium">Nature's Pure Power In Every Bite</p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our microgreens are harvested at peak freshness to deliver maximum nutritional value. Packed with enzymes, antioxidants, and live nutrients that your body thrives on.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-myura-green-600" />
                  <span className="text-gray-700">Harvested at peak freshness for maximum potency</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-myura-green-600" />
                  <span className="text-gray-700">Packed with enzymes, antioxidants & live nutrients your body thrives on</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-myura-green-600" />
                  <span className="text-gray-700">Zero chemicals, 100% purity - inspired by ancient nourishment rituals</span>
                </div>
              </div>
              <Link
                to="/product"
                className="inline-flex items-center px-6 py-3 bg-myura-green-600 text-white font-semibold rounded-lg hover:bg-myura-green-700 transition-colors"
              >
                Explore Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Microgreens</h3>
                  <p className="text-gray-600">Nature's Superfood</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-myura-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="aspect-video bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
                </div>
                <p className="text-lg font-semibold">Watch Our Story</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

