import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Filter, Search } from 'lucide-react';

const Product: React.FC = () => {
  const products = [
    {
      id: 1,
      name: "DIA CARE",
      price: 799,
      originalPrice: 999,
      image: "/api/placeholder/200/200",
      pedestalColor: "bg-purple-500",
      rating: 5,
      reviews: 128,
      inStock: true
    },
    {
      id: 2,
      name: "LIVER DETOX FORMULA",
      price: 699,
      originalPrice: 999,
      image: "/api/placeholder/200/200",
      pedestalColor: "bg-teal-500",
      rating: 5,
      reviews: 95,
      inStock: true
    },
    {
      id: 3,
      name: "BONE & JOINT SUPPORT",
      price: 4543,
      originalPrice: 5999,
      image: "/api/placeholder/200/200",
      pedestalColor: "bg-blue-600",
      rating: 5,
      reviews: 67,
      inStock: true
    },
    {
      id: 4,
      name: "GUT AND DIGESTION",
      price: 999,
      originalPrice: 1299,
      image: "/api/placeholder/200/200",
      pedestalColor: "bg-amber-600",
      rating: 5,
      reviews: 89,
      inStock: true
    },
    {
      id: 5,
      name: "WOMEN'S HEALTH PLUS",
      price: 499,
      originalPrice: 699,
      image: "/api/placeholder/200/200",
      pedestalColor: "bg-pink-500",
      rating: 5,
      reviews: 156,
      inStock: true
    },
    {
      id: 6,
      name: "MEN'S VITALITY BOOSTER",
      price: 899,
      originalPrice: 1199,
      image: "/api/placeholder/200/200",
      pedestalColor: "bg-blue-800",
      rating: 5,
      reviews: 73,
      inStock: true
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">PRODUCT</h1>
          <p className="text-xl text-slate-200">
            Wellness you can feel, results you can see.
          </p>
        </div>
      </section>

      {/* Product Collection Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Column - Image */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex justify-center items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-full"></div>
                  </div>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-pink-500 rounded-full"></div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 font-display">MYURA</h3>
                  <p className="text-slate-600 font-minimal">Product Collection</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative mb-6">
                  <div className={`w-24 h-24 ${product.pedestalColor} rounded-full mx-auto flex items-center justify-center mb-4`}>
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                    </div>
                  </div>
                  {product.inStock && (
                    <div className="absolute top-2 right-2 bg-slate-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      In Stock
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-slate-500 mb-1">MYURA</p>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{product.name}</h3>
                  
                  <div className="flex justify-center items-center space-x-1 mb-3">
                    {[...Array(product.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-sm text-slate-600 ml-2">({product.reviews})</span>
                  </div>
                  
                  <div className="flex justify-center items-center space-x-2 mb-4">
                    <span className="text-2xl font-bold text-slate-900">₹{product.price}</span>
                    <span className="text-lg text-slate-400 line-through">₹{product.originalPrice}</span>
                  </div>
                  
                  <Link
                    to={`/product/${product.id}`}
                    className="w-full bg-slate-900 text-white font-sharp py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors inline-block text-center"
                  >
                    Add to cart
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-slate-900 text-white font-sharp px-8 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors">
              Load More Products
            </button>
          </div>
        </div>
      </section>

      {/* Discover Benefits Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 font-display">MYURA</h3>
                  <p className="text-slate-600 font-minimal">DIA CARE</p>
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

