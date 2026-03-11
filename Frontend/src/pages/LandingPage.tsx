import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Zap, Users, Image, MessageSquare, TrendingUp, Sparkles, Mail, MapPin, Phone } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Refs for smooth scrolling
  const featuresRef = useRef<HTMLElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900 bg-opacity-95 backdrop-blur-xl border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <h1 className="text-2xl font-bold text-white">
                Chatify
              </h1>
            </button>
            
            <div className="hidden md:flex items-center gap-12">
              <button
                onClick={() => scrollToSection(featuresRef)}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer font-medium text-base"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection(howItWorksRef)}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer font-medium text-base"
              >
                How it works
              </button>
              <button
                onClick={() => scrollToSection(contactRef)}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer font-medium text-base"
              >
                Contact
              </button>
            </div>

            <button
              onClick={() => navigate('/auth')}
              className="px-8 py-2.5 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            {/* Left Content */}
            <div className="space-y-10">
              <div className="space-y-8">
                <h2 className="text-7xl lg:text-8xl font-extrabold leading-tight text-white">
                  Chat instantly.
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    No noise.
                  </span>
                  <br />
                  Just people.
                </h2>
                <p className="text-xl text-gray-300 max-w-xl leading-relaxed">
                  Chatify helps you stay connected without distractions. Clean conversations, 
                  smooth experience, and privacy by default.
                </p>
              </div>

              <div className="flex flex-wrap gap-5 pt-6">
                <button
                  onClick={() => navigate('/auth')}
                  className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-xl shadow-purple-500/50 hover:scale-105 cursor-pointer"
                >
                  Get Started
                </button>
                <button className="px-12 py-4 rounded-xl border-2 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600 font-bold text-lg transition-all cursor-pointer">
                  Live Demo
                </button>
              </div>
            </div>

            {/* Right Content - Chat Mockup */}
            <div className="relative">
              <div className="bg-slate-900 bg-opacity-90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700 overflow-hidden">
                <div className="bg-slate-800 px-6 py-4 flex items-center gap-2 border-b border-slate-700">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="p-10 space-y-5">
                  <div className="flex justify-start animate-fade-in">
                    <div className="max-w-xs bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl rounded-tl-sm px-6 py-4 shadow-lg">
                      <p className="text-white text-base">Did you try the new chat app?</p>
                    </div>
                  </div>
                  <div className="flex justify-end animate-fade-in-delayed">
                    <div className="max-w-xs bg-slate-700 rounded-2xl rounded-tr-sm px-6 py-4 shadow-lg">
                      <p className="text-white text-base">Yeah, it's clean and super smooth.</p>
                    </div>
                  </div>
                  <div className="flex justify-start animate-fade-in-more-delayed">
                    <div className="max-w-xs bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl rounded-tl-sm px-6 py-4 flex items-center gap-2 shadow-lg">
                      <p className="text-white text-base">Finally something simple</p>
                      <span className="text-xl">😊</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section ref={howItWorksRef} className="py-32 px-8 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <div className="inline-block px-6 py-2 bg-purple-600 bg-opacity-20 rounded-full text-purple-300 text-sm font-bold mb-8 border border-purple-500 border-opacity-30">
              THREE SIMPLE STEPS
            </div>
            <h2 className="text-5xl font-bold text-white mb-6">Get started in seconds</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-16 mb-24">
            <div className="text-center space-y-8 group">
              <div className="w-28 h-28 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/50 group-hover:scale-110 transition-all">
                <Users className="w-14 h-14 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white px-4">Create your account</h3>
              <p className="text-gray-400 leading-relaxed px-8">Sign up with email in under 30 seconds. Quick and easy registration process.</p>
            </div>

            <div className="text-center space-y-8 group">
              <div className="w-28 h-28 mx-auto bg-gradient-to-br from-pink-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-pink-500/50 group-hover:scale-110 transition-all">
                <MessageCircle className="w-14 h-14 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white px-4">Find friends and start chats</h3>
              <p className="text-gray-400 leading-relaxed px-8">Search and connect with people instantly. Start meaningful conversations.</p>
            </div>

            <div className="text-center space-y-8 group">
              <div className="w-28 h-28 mx-auto bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/50 group-hover:scale-110 transition-all">
                <Sparkles className="w-14 h-14 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white px-4">Talk freely, without noise</h3>
              <p className="text-gray-400 leading-relaxed px-8">Clean interface, no distractions, just pure conversation with your friends.</p>
            </div>
          </div>

          {/* Stats Cards - NOW AFTER STEPS */}
          <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-10 text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                100K+
              </div>
              <div className="text-gray-400 text-sm mt-2">Active Users</div>
            </div>
            <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-10 text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                5M+
              </div>
              <div className="text-gray-400 text-sm mt-2">Messages</div>
            </div>
            <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-10 text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                99.9%
              </div>
              <div className="text-gray-400 text-sm mt-2">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-10">Ready to start chatting?</h2>
          <p className="text-xl text-gray-300 mb-14">
            Join Chatify and enjoy messaging without distractions.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="px-14 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-2xl shadow-purple-500/50 hover:scale-105 cursor-pointer"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-32 px-8 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-bold text-white mb-8">Everything you need. Nothing extra.</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to make your conversations smooth and enjoyable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: Zap,
                title: 'Instant Messaging',
                description: 'Send and receive messages instantly, without waiting or refreshing.',
                gradient: 'from-purple-500 to-purple-600'
              },
              {
                icon: MessageSquare,
                title: 'Reply to Messages',
                description: 'Reply to specific messages so conversations stay clear and easy to follow.',
                gradient: 'from-pink-500 to-pink-600'
              },
              {
                icon: Image,
                title: 'Share Photos & Files',
                description: 'Send images and files effortlessly, right inside the chat.',
                gradient: 'from-purple-500 to-indigo-600'
              },
              {
                icon: MessageCircle,
                title: 'Clean, Organized Chats',
                description: 'Messages are neatly grouped by date, so nothing feels messy.',
                gradient: 'from-indigo-500 to-purple-600'
              },
              {
                icon: TrendingUp,
                title: 'Smooth Scrolling',
                description: 'Scroll naturally through older messages without sudden jumps.',
                gradient: 'from-pink-500 to-purple-600'
              },
              {
                icon: Sparkles,
                title: 'AI Chat Assistance',
                description: 'Get smart reply suggestions, improve your messages, or chat with an AI assistant anytime.',
                gradient: 'from-purple-500 to-pink-600'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-5 backdrop-blur-lg p-8 rounded-2xl border border-white border-opacity-10 hover:bg-opacity-10 hover:scale-105 transition-all group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-32 px-8 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-bold text-white mb-8">Get in Touch</h2>
            <p className="text-xl text-gray-400">Have questions? We'd love to hear from you.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-20">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Email</h4>
                      <p className="text-gray-400">support@chatify.com</p>
                      <p className="text-gray-400">hello@chatify.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Phone</h4>
                      <p className="text-gray-400">+1 (555) 123-4567</p>
                      <p className="text-gray-400">Mon-Fri 9am-6pm EST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Office</h4>
                      <p className="text-gray-400">123 Tech Street</p>
                      <p className="text-gray-400">San Francisco, CA 94105</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-10">
              <form className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-slate-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 bg-slate-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Message</label>
                  <textarea
                    rows={5}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 bg-slate-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/50 hover:scale-105 cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white border-opacity-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-white">© 2026 Chatify</span>
            </div>
            
            <div className="flex gap-8 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <button
                onClick={() => scrollToSection(contactRef)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease forwards;
        }

        .animate-fade-in-delayed {
          animation: fade-in 0.6s ease 0.3s forwards;
          opacity: 0;
        }

        .animate-fade-in-more-delayed {
          animation: fade-in 0.6s ease 0.6s forwards;
          opacity: 0;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
