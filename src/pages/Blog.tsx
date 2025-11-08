import React from 'react';
import { Calendar, MessageCircle, ArrowRight } from 'lucide-react';

const Blog: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Power of Functional Foods: Nutrition That Heals",
      excerpt: "When it comes to eating healthy, there's a growing interest in foods that do more than just fill our stomachs.",
      date: "August 19, 2025",
      comments: 0,
      image: "/api/placeholder/400/300",
      category: "Nutrition"
    },
    {
      id: 2,
      title: "Understanding Ayurvedic Principles for Modern Wellness",
      excerpt: "Discover how ancient wisdom can guide your modern wellness journey with practical Ayurvedic principles.",
      date: "August 15, 2025",
      comments: 3,
      image: "/api/placeholder/400/300",
      category: "Wellness"
    },
    {
      id: 3,
      title: "Natural Detox: Supporting Your Body's Cleansing Process",
      excerpt: "Learn about gentle, natural ways to support your body's natural detoxification processes.",
      date: "August 12, 2025",
      comments: 7,
      image: "/api/placeholder/400/300",
      category: "Detox"
    },
    {
      id: 4,
      title: "The Science Behind Herbal Supplements",
      excerpt: "Understanding how modern research validates traditional herbal medicine practices.",
      date: "August 8, 2025",
      comments: 2,
      image: "/api/placeholder/400/300",
      category: "Science"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-20">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">BLOG & NEWS</h1>
          <p className="text-xl text-slate-200">
            Wellness you can feel, results you can see.
          </p>
        </div>
      </section>

      {/* Featured Blog Post */}
      <section className="py-20 bg-stone-50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Featured Post Image */}
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[6px] border-y-transparent ml-1"></div>
                    </div>
                    <p className="text-lg font-semibold">Featured Article</p>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-stone-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Featured
                </div>
              </div>

              {/* Featured Post Content */}
              <div className="p-8 lg:p-12">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                      The Power of Functional Foods: Nutrition That Heals
                    </h2>
                    <p className="text-lg text-slate-700 leading-relaxed">
                      When it comes to eating healthy, there's a growing interest in foods that do more than just fill our stomachs. 
                      Functional foods are those that provide health benefits beyond basic nutrition, offering therapeutic effects 
                      that can support your body's natural healing processes.
                    </p>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-slate-500">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>August 19, 2025</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>No Comments</span>
                    </div>
                  </div>

                  <button className="inline-flex items-center text-stone-600 font-semibold hover:text-stone-700 transition-colors">
                    READ MORE
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 bg-white">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Latest Articles</h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Stay updated with the latest insights on wellness, nutrition, and natural health solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Post Image */}
                <div className="aspect-video bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                  <div className="text-center text-stone-600">
                    <div className="w-12 h-12 bg-stone-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <div className="w-0 h-0 border-l-[6px] border-l-stone-600 border-y-[4px] border-y-transparent ml-1"></div>
                    </div>
                    <p className="text-sm font-semibold">{post.category}</p>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <span className="inline-block bg-stone-100 text-stone-600 text-xs font-semibold px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-slate-700 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments} Comments</span>
                    </div>
                  </div>

                  <button className="inline-flex items-center text-stone-600 font-semibold hover:text-stone-700 transition-colors">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-stone-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-stone-700 transition-colors">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-stone-50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Stay Updated</h2>
          <p className="text-lg text-slate-700 mb-8">
            Subscribe to our newsletter for the latest wellness tips, product updates, and exclusive offers.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex space-x-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
              />
              <button className="bg-stone-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-stone-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Explore by Category</h2>
            <p className="text-lg text-slate-700">
              Find articles that match your interests and wellness goals.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Nutrition", count: 12, color: "bg-green-100 text-green-600" },
              { name: "Wellness", count: 8, color: "bg-blue-100 text-blue-600" },
              { name: "Detox", count: 6, color: "bg-purple-100 text-purple-600" },
              { name: "Science", count: 10, color: "bg-orange-100 text-orange-600" }
            ].map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl font-bold">{category.name.charAt(0)}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{category.name}</h3>
                <p className="text-sm text-slate-500">{category.count} articles</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;

