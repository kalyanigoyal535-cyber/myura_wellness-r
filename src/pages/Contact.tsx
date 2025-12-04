import React, { useState } from 'react';
import { Phone, Mail, MapPin, Headphones, MessageCircle, Send, CheckCircle, XCircle, Sparkles, Clock } from 'lucide-react';
import { contactApi } from '../services/contact';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    helpType: 'Product Questions & Advice',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Reset status when user starts typing
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await contactApi.submitContact({
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone || undefined,
        subject: formData.helpType,
        message: formData.message,
      });
      
      setSubmitStatus('success');
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        helpType: 'Product Questions & Advice',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 lg:py-10">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-slate-700/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center mb-3">
            <Sparkles className="h-6 w-6 text-amber-400 mr-2 animate-pulse" />
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Get In Touch</span>
            <Sparkles className="h-6 w-6 text-amber-400 ml-2 animate-pulse" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">
            <span className="bg-gradient-to-r from-white via-amber-50 to-white bg-clip-text text-transparent">
              CONTACT US
            </span>
          </h1>
          <p className="text-sm lg:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Wellness you can feel, results you can see. We're here to support your journey.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 lg:py-20 relative">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column - Contact Information */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block">
                  <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest bg-amber-50 px-4 py-2 rounded-full">
                    Connect With Us
                  </span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-tight">
                  We're Here For You
                  <span className="block text-slate-600 text-xl lg:text-2xl mt-1.5">Always</span>
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
                  At Myura, your wellness journey is deeply personal—and so is our support. Whether you have 
                  questions about our products, need personalized recommendations, or want to share your 
                  experience, we're just a message away and always ready to help.
                </p>
              </div>

              {/* Premium Contact Methods */}
              <div className="space-y-4">
                <div className="group relative bg-white rounded-xl p-5 lg:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200">
                  <div className="flex items-start space-x-5">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Headphones className="h-5 w-5 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-base font-semibold text-slate-900">Customer Care</h3>
                        <Clock className="h-3.5 w-3.5 text-amber-600" />
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-2">
                        Our wellness advisors are available 24/7 to answer your queries, guide your choices, 
                        or resolve any issues—big or small.
                      </p>
                      <span className="inline-block text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                        Available 24/7
                      </span>
                    </div>
                  </div>
                </div>

                <div className="group relative bg-white rounded-xl p-5 lg:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-base font-semibold text-slate-900 mb-1.5">Email</h3>
                      <a 
                        href="mailto:care@myurawellness.com" 
                        className="text-sm text-slate-700 hover:text-blue-600 transition-colors font-medium inline-block"
                      >
                        care@myurawellness.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="group relative bg-white rounded-xl p-5 lg:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-base font-semibold text-slate-900 mb-1.5">Office</h3>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        Plot No. 15C, IT Park, Sector 22<br />
                        Panchkula, Haryana 134109
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group relative bg-white rounded-xl p-5 lg:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-base font-semibold text-slate-900 mb-1.5">Phone/WhatsApp</h3>
                      <a 
                        href="tel:+919133001177" 
                        className="text-sm text-slate-700 hover:text-green-600 transition-colors font-medium inline-block"
                      >
                        +91 9133 001 177
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Premium Contact Form */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-50 to-transparent rounded-full blur-3xl opacity-50"></div>
                
                <div className="relative z-10">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-1.5">Send us a Message</h3>
                    <p className="text-xs text-slate-600">Fill out the form below and we'll get back to you as soon as possible.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold text-slate-900 mb-2">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-slate-50 hover:bg-white hover:border-slate-300 text-slate-900 placeholder-slate-400"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-slate-900 mb-2">
                        Your Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-slate-50 hover:bg-white hover:border-slate-300 text-slate-900 placeholder-slate-400"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-xs font-semibold text-slate-900 mb-2">
                        Contact No.
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-slate-50 hover:bg-white hover:border-slate-300 text-slate-900 placeholder-slate-400"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <label htmlFor="helpType" className="block text-xs font-semibold text-slate-900 mb-2">
                        How Can We Help? <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="helpType"
                        name="helpType"
                        value={formData.helpType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-slate-50 hover:bg-white hover:border-slate-300 text-slate-900 cursor-pointer"
                      >
                        <option value="Product Questions & Advice">Product Questions & Advice</option>
                        <option value="Order Support">Order Support</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Feedback">Feedback</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-xs font-semibold text-slate-900 mb-2">
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-slate-50 hover:bg-white hover:border-slate-300 text-slate-900 placeholder-slate-400 resize-none"
                        placeholder="Tell us how we can help you..."
                        required
                      />
                    </div>

                    {submitStatus === 'success' && (
                      <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-800 rounded-xl flex items-start space-x-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold mb-0.5">Message Sent Successfully!</p>
                          <p className="text-xs">Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
                        </div>
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="p-3 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 text-red-800 rounded-xl flex items-start space-x-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                        <XCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold mb-0.5">Error Sending Message</p>
                          <p className="text-xs">{errorMessage || 'Failed to send message. Please try again.'}</p>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white py-3 px-5 rounded-xl hover:from-slate-700 hover:via-slate-600 hover:to-slate-700 transition-all duration-300 font-semibold text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Premium Floating Chat Button */}
              <div className="hidden lg:block absolute -right-6 top-1/2 transform -translate-y-1/2 z-20">
                <div className="flex flex-col items-end space-y-4">
                  <div className="relative group">
                    <button className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-900 text-white rounded-2xl flex items-center justify-center hover:from-slate-600 hover:to-slate-800 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-110">
                      <MessageCircle className="h-8 w-8" />
                    </button>
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center shadow-lg animate-pulse">
                      1
                    </span>
                  </div>
                  <button className="bg-white text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-200">
                    Quick Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
            Your Wellness, Our Priority
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl mx-auto mb-6">
            Every message is answered with care and urgency. At Myura, you're not just a customer—you're 
            part of our growing wellness family. Let's connect. Let's thrive. Let's build true wellness, 
            together. Reach out now—your best self is just a conversation away.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a 
              href="mailto:care@myurawellness.com"
              className="px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Email Us Now
            </a>
            <a 
              href="tel:+919133001177"
              className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-sm hover:bg-white hover:text-slate-900 transition-all duration-300"
            >
              Call Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

