import React from 'react';
import { CheckCircle, Heart, Star, Shield, ArrowLeft, ArrowRight } from 'lucide-react';

const About: React.FC = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Shevya Chaturvedi",
      role: "Content Strategist",
      description: "Leads our content journey, crafting compelling narratives that connect with our community. With a background in journalism and 4+ years of experience, she ensures every word we share resonates with authenticity and purpose."
    },
    {
      id: 2,
      name: "Aditya Kumar",
      role: "Web Developer",
      description: "Passionate about creating stunning, user-friendly websites that make wellness accessible to everyone. He focuses on seamless design and functionality, ensuring our digital presence reflects our commitment to quality."
    },
    {
      id: 3,
      name: "Sombir Beniwal",
      role: "Digital Marketing Specialist",
      description: "Drives our digital presence forward with innovative strategies and authentic engagement. He helps us reach more people who are looking for natural wellness solutions, building meaningful connections across all platforms."
    }
  ];

  const features = [
    {
      icon: <Heart className="h-8 w-8 text-slate-600" />,
      title: "100% Organic",
      description: "We use only pure, certified organic ingredients — nothing artificial, nothing unnecessary, just nature at its best."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-slate-600" />,
      title: "Improve Health",
      description: "Formulated to boost energy, balance, and overall well-being, so you feel healthier from the inside out."
    },
    {
      icon: <Star className="h-8 w-8 text-slate-600" />,
      title: "12K+ Ratings",
      description: "Trusted by thousands of happy customers who have seen real results in their wellness journey."
    },
    {
      icon: <Shield className="h-8 w-8 text-slate-600" />,
      title: "Biologically Safe",
      description: "Every blend is tested for safety and quality, so it's as gentle on your body as it is effective."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">ABOUT</h1>
          <p className="text-xl text-slate-200">
            Because your health deserves more than maintenance - It deserves transformation.
          </p>
        </div>
      </section>

      {/* Our Promise Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-300 rounded-lg p-4 text-center">
                    <span className="text-white font-bold text-sm">TRANSPARENCY</span>
                  </div>
                  <div className="bg-slate-400 rounded-lg p-4 text-center">
                    <span className="text-white font-bold text-sm">CARE</span>
                  </div>
                  <div className="bg-slate-500 rounded-lg p-4 text-center">
                    <span className="text-white font-bold text-sm">INTEGRITY</span>
                  </div>
                  <div className="bg-slate-600 rounded-lg p-4 text-center">
                    <span className="text-white font-bold text-sm">QUALITY</span>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <span className="text-white font-bold text-sm">PURITY</span>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4 text-center">
                    <span className="text-white font-bold text-sm">TRUST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Text */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-slate-900">Our Promise</h2>
              <p className="text-lg text-slate-700 leading-relaxed">
                At Myura, we're not just another wellness brand. We're a movement towards authentic, 
                science-backed natural health solutions. We believe in the power of honesty, purity, 
                and craftsmanship - blending ancient Ayurvedic wisdom with modern scientific validation.
              </p>
              
              <h3 className="text-2xl font-bold text-slate-900">Why Trust a New Brand?</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">Transparency First</h4>
                  <p className="text-slate-700">
                    Full ingredient disclosure, clear benefits, and no harmful additives. 
                    We believe you have the right to know exactly what you're putting into your body.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">Science Meets Tradition</h4>
                  <p className="text-slate-700">
                    We select herbs with documented history and modern research backing. 
                    Every formula is crafted with precision and purpose.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">Quality Without Compromise</h4>
                  <p className="text-slate-700">
                    Small-batch production, rigorous quality checks, and uncompromising standards. 
                    We wouldn't sell anything we wouldn't give to our own family.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">What We Stand For</h4>
                  <div className="space-y-2">
                    <p className="text-slate-700"><strong>Purity:</strong> Clean, responsibly sourced botanicals</p>
                    <p className="text-slate-700"><strong>Integrity:</strong> Verifiable claims, readable labels, and outcomes</p>
                    <p className="text-slate-700"><strong>Care:</strong> Human support and wellness education</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We're Different Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-slate-900">How We're Different</h2>
              <p className="text-lg text-slate-700 leading-relaxed">
                We create purpose-built formulations that address everyday needs - from energy and 
                hormonal balance to gut health and joint support. Our products are designed for 
                optimal absorption and maximum benefit, with every formula evolving based on real 
                customer feedback.
              </p>
              
              <h3 className="text-2xl font-bold text-slate-900">The Myura Standard</h3>
              <p className="text-lg text-slate-700 leading-relaxed">
                For us, "new" means uncompromising. It means clean, effective, and responsibly made. 
                We launch products only after they meet our high benchmarks for cleanliness, 
                effectiveness, and responsible manufacturing. If we wouldn't give it to our family, 
                we won't sell it to you.
              </p>
            </div>

            {/* Right Column - Feature Cards */}
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-700">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Myura Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
                <div className="w-32 h-32 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">@myurawellness</h3>
                  <p className="text-slate-600">12.5K followers</p>
                </div>
                
                {/* Floating speech bubbles */}
                <div className="absolute -top-4 -left-4 bg-white rounded-lg p-3 shadow-lg">
                  <p className="text-sm font-semibold text-slate-900">Complete Honesty, Always</p>
                </div>
                <div className="absolute top-8 -right-8 bg-white rounded-lg p-3 shadow-lg">
                  <p className="text-sm font-semibold text-slate-900">Quality You Can Feel</p>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-lg p-3 shadow-lg">
                  <p className="text-sm font-semibold text-slate-900">Wellness That Fits Your Life</p>
                </div>
              </div>
            </div>

            {/* Right Column - Text */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-slate-900">Why Choose Myura?</h2>
              <p className="text-lg text-slate-700 leading-relaxed">
                We craft personal, pure care. Here's why people trust us with their wellness journey.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">Rooted in Real Tradition and Science</h4>
                  <p className="text-slate-700">
                    We blend Ayurvedic wisdom with modern science, creating products that honor ancient 
                    knowledge while meeting today's standards for safety and effectiveness.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">Complete Honesty, Always</h4>
                  <p className="text-slate-700">
                    You'll always know what's inside our products. No hidden ingredients, no confusing 
                    jargon - just clear, honest information you can trust.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">Quality You Can Feel</h4>
                  <p className="text-slate-700">
                    From carefully picked herbs to small-batch production and strict quality checks, 
                    every step is designed to deliver the best possible results.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">Here for You, Every Step of the Way</h4>
                  <p className="text-slate-700">
                    Our friendly team is here to support your wellness journey with guidance, 
                    answers, and genuine care.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">Wellness That Fits Your Life</h4>
                  <p className="text-slate-700">
                    Whether you need support for detox, energy, digestion, or joint health, 
                    we have thoughtfully crafted blends for your specific needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Team</h2>
            <p className="text-lg text-slate-700 max-w-4xl mx-auto leading-relaxed">
              We're a passionate group of wellness enthusiasts, product developers, and creatives - 
              all driven by a single mission: to make holistic health simple and accessible. Each 
              member of our team brings expertise and heart into building a brand that truly cares 
              about your well-being - from the herbs we source to the support we offer.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{member.name}</h3>
                <p className="text-slate-600 font-semibold mb-4">{member.role}</p>
                <p className="text-slate-700 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
          
          {/* Navigation arrows for team carousel */}
          <div className="flex justify-center mt-8 space-x-4">
            <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-stone-50 transition-colors">
              <ArrowLeft className="h-6 w-6 text-slate-600" />
            </button>
            <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-stone-50 transition-colors">
              <ArrowRight className="h-6 w-6 text-slate-600" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

