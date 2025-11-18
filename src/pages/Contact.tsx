import React, { useState } from 'react';
import { Phone, Mail, MapPin, Headphones, MessageCircle, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    helpType: 'Product Questions & Advice',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-20">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">CONTACT</h1>
          <p className="text-xl text-slate-200">
            Wellness you can feel, results you can see.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 bg-stone-50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Contact Information */}
            <div className="space-y-8">
              <div>
                <p className="text-sm text-slate-600 font-medium italic mb-2">Get in touch</p>
                <h2 className="text-4xl font-bold text-slate-900 mb-6">We're Here For You - Always</h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                  At Myura, your wellness journey is deeply personal—and so is our support. Whether you have 
                  questions about our products, need personalized recommendations, or want to share your 
                  experience, we're just a message away and always ready to help.
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-6">
                <div className="bg-gray-100 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Headphones className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Customer Care</h3>
                      <p className="text-slate-700">
                        Our wellness advisors are available 24/7 to answer your queries, guide your choices, 
                        or resolve any issues—big or small.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Email</h3>
                      <p className="text-slate-700">care@myurawellness.com</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Office</h3>
                      <p className="text-slate-700">Plot No. 15C, IT Park, Sector 22</p>
                      <p className="text-slate-700">Panchkula, Haryana 134109</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Phone/WhatsApp</h3>
                      <p className="text-slate-700">+91 9133 001 177</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                      Contact No.
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="helpType" className="block text-sm font-medium text-slate-700 mb-2">
                      How Can We Help?
                    </label>
                    <select
                      id="helpType"
                      name="helpType"
                      value={formData.helpType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      <option value="Product Questions & Advice">Product Questions & Advice</option>
                      <option value="Order Support">Order Support</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Feedback">Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="Tell us how we can help you..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-600 text-white py-3 px-6 rounded-lg hover:bg-slate-700 transition-colors font-semibold flex items-center justify-center"
                  >
                    Submit
                    <Send className="ml-2 h-5 w-5" />
                  </button>
                </form>
              </div>

              {/* Floating Chat Button */}
              <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
                <div className="relative">
                  <button className="w-16 h-16 bg-slate-600 text-white rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors shadow-lg">
                    <MessageCircle className="h-8 w-8" />
                  </button>
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                    1
                  </span>
                </div>
                <div className="mt-4 text-center">
                  <button className="bg-gray-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
                    Contact us
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Wellness, Our Priority Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Your Wellness, Our Priority</h2>
          <p className="text-lg text-slate-700 leading-relaxed">
            Every message is answered with care and urgency. At Myura, you're not just a customer—you're 
            part of our growing wellness family. Let's connect. Let's thrive. Let's build true wellness, 
            together. Reach out now—your best self is just a conversation away.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Contact;

