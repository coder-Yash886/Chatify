import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Zap,
  Users,
  Image as ImageIcon,
  MessageSquare,
  TrendingUp,
  Sparkles,
  Mail,
  MapPin,
  Phone,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - navbarHeight;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background:
          "radial-gradient(ellipse at top, #3b2f8f 0%, #2a1f5f 25%, #1a0f3f 50%, #0d0520 100%)",
        backgroundColor: "#0d0520",
      }}
    >
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-purple-500/10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(13, 5, 32, 0.95) 0%, rgba(13, 5, 32, 0.85) 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center space-x-3 group cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent py-1">
                Chatify
              </h1>
            </button>

            <div className="hidden md:flex items-center gap-10">
              <button
                onClick={() => scrollToSection("features")}
                className="relative text-base font-medium text-gray-300 hover:text-white hover:scale-105 transition-all duration-300 group"
              >
                Features
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"></span>
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="relative text-base font-medium text-gray-300 hover:text-white hover:scale-105 transition-all duration-300 group"
              >
                How it works
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"></span>
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="relative text-base font-medium text-gray-300 hover:text-white hover:scale-105 transition-all duration-300 group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"></span>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/auth")}
                className="px-7 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300"
              >
                Login
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white p-2 hover:bg-purple-600/20 rounded-lg transition-all"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-2">
              {[
                { id: "features", label: "Features" },
                { id: "how-it-works", label: "How it works" },
                { id: "contact", label: "Contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-3 rounded-xl text-gray-300 hover:bg-purple-600/20 transition-all duration-300"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* HOME SECTION */}
      <section
        id="home"
        className="pb-24 px-6 md:px-8 min-h-screen"
        style={{ paddingTop: "110px" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left - Text Content */}
            <div className="space-y-10">
              {/* HEADING */}

              <div className="space-y-3 md:space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1]">
                  Chat instantly.
                </h1>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-[1.1]">
                  No noise.
                </h1>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white leading-[1.1]">
                  Just people.
                </h1>
              </div>

              <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                Chatify helps you stay connected without distractions. Clean
                conversations, smooth experience, and privacy by default.
              </p>

              <div className="flex flex-wrap gap-5 pt-2">
                <button
                  onClick={() => navigate("/auth")}
                  className="group px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-12 py-4 rounded-xl border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 hover:scale-105 font-bold text-lg transition-all duration-300">
                  Live Demo
                </button>
              </div>

              <div className="grid grid-cols-3 gap-5 pt-6">
                {[
                  { value: "100K+", label: "Active Users" },
                  { value: "5M+", label: "Messages" },
                  { value: "99.9%", label: "Uptime" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="text-center p-5 rounded-2xl bg-purple-500/5 border border-purple-500/20 hover:scale-105 transition-all backdrop-blur-sm"
                  >
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent py-1">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm mt-2">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Chat Mockup - PERFECTLY FIXED */}
            <div className="relative">
              <div
                className="rounded-3xl shadow-2xl border border-purple-500/30 overflow-hidden backdrop-blur-xl max-w-md mx-auto"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(59, 47, 143, 0.25) 0%, rgba(42, 31, 95, 0.25) 100%)",
                }}
              >
                {/* Chat Header */}
                <div
                  className="px-6 py-4 flex items-center gap-3 border-b border-purple-500/30"
                  style={{
                    background: "rgba(13, 5, 32, 0.6)",
                  }}
                >
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-8 space-y-6">
                  {/* Message 1 */}
                  <div className="flex justify-start">
                    <div className="max-w-[280px] bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-xl">
                      <p className="text-white text-base leading-relaxed">
                        Did you try the new chat app?
                      </p>
                    </div>
                  </div>

                  {/* Message 2 */}
                  <div className="flex justify-end">
                    <div
                      className="max-w-[280px] rounded-2xl rounded-tr-sm px-5 py-3.5 shadow-xl"
                      style={{ backgroundColor: "rgba(59, 47, 143, 0.6)" }}
                    >
                      <p className="text-white text-base leading-relaxed">
                        Yeah, it's clean and super smooth.
                      </p>
                    </div>
                  </div>

                  {/* Message 3 */}
                  <div className="flex justify-start">
                    <div className="max-w-[280px] bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl rounded-tl-sm px-5 py-3.5 flex items-center gap-2 shadow-xl">
                      <p className="text-white text-base leading-relaxed">
                        Finally something simple
                      </p>
                      <span className="text-lg">😊</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 px-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Everything you need. Nothing extra.
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Powerful features designed to make your conversations smooth and
              enjoyable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Instant Messaging",
                description:
                  "Send and receive messages instantly, without waiting or refreshing.",
                gradient: "from-purple-500 to-purple-600",
              },
              {
                icon: MessageSquare,
                title: "Reply to Messages",
                description:
                  "Reply to specific messages so conversations stay clear and easy to follow.",
                gradient: "from-pink-500 to-pink-600",
              },
              {
                icon: ImageIcon,
                title: "Share Photos & Files",
                description:
                  "Send images and files effortlessly, right inside the chat.",
                gradient: "from-purple-500 to-indigo-600",
              },
              {
                icon: MessageCircle,
                title: "Clean, Organized Chats",
                description:
                  "Messages are neatly grouped by date, so nothing feels messy.",
                gradient: "from-indigo-500 to-purple-600",
              },
              {
                icon: TrendingUp,
                title: "Smooth Scrolling",
                description:
                  "Scroll naturally through older messages without sudden jumps.",
                gradient: "from-pink-500 to-purple-600",
              },
              {
                icon: Sparkles,
                title: "AI Chat Assistance",
                description:
                  "Get smart reply suggestions, improve your messages, or chat with an AI assistant anytime.",
                gradient: "from-purple-500 to-pink-600",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-purple-500/5 border border-purple-500/20 hover:border-purple-400/50 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 px-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-2 bg-purple-600/20 rounded-full text-purple-300 text-sm font-bold mb-8 border border-purple-500/30 backdrop-blur-sm">
              THREE SIMPLE STEPS
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Get started in seconds
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-16">
            {[
              {
                icon: Users,
                title: "Create your account",
                description:
                  "Sign up with email in under 30 seconds. Quick and easy registration process.",
                gradient: "from-purple-500 to-pink-500",
                step: "1",
              },
              {
                icon: MessageCircle,
                title: "Find friends and start chats",
                description:
                  "Search and connect with people instantly. Start meaningful conversations.",
                gradient: "from-pink-500 to-purple-500",
                step: "2",
              },
              {
                icon: Sparkles,
                title: "Talk freely, without noise",
                description:
                  "Clean interface, no distractions, just pure conversation with your friends.",
                gradient: "from-purple-500 to-indigo-500",
                step: "3",
              },
            ].map((step, index) => (
              <div key={index} className="text-center space-y-6 group">
                <div className="relative inline-block">
                  <div
                    className={`w-32 h-32 mx-auto bg-gradient-to-br ${step.gradient} rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}
                  >
                    <step.icon className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed px-4">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center bg-purple-500/5 border border-purple-500/20 rounded-3xl p-12 backdrop-blur-sm">
            <h3 className="text-4xl font-bold text-white mb-6">
              Ready to start chatting?
            </h3>
            <p className="text-xl text-gray-300 mb-8">
              Join Chatify and enjoy messaging without distractions.
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="group px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 inline-flex items-center gap-3"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 px-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-400">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white mb-8">
                Contact Information
              </h3>
              {[
                {
                  icon: Mail,
                  title: "Email",
                  lines: ["support@chatify.com", "hello@chatify.com"],
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  icon: Phone,
                  title: "Phone",
                  lines: ["+1 (555) 123-4567", "Mon-Fri 9am-6pm EST"],
                  gradient: "from-pink-500 to-purple-500",
                },
                {
                  icon: MapPin,
                  title: "Office",
                  lines: ["123 Tech Street", "San Francisco, CA 94105"],
                  gradient: "from-purple-500 to-indigo-500",
                },
              ].map((contact, index) => (
                <div
                  key={index}
                  className="flex items-start gap-6 p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20 hover:border-purple-400/50 hover:scale-105 transition-all duration-300 group backdrop-blur-sm"
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${contact.gradient} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-xl`}
                  >
                    <contact.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-2">
                      {contact.title}
                    </h4>
                    {contact.lines.map((line, i) => (
                      <p key={i} className="text-gray-400">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <form className="space-y-6 p-8 rounded-2xl bg-purple-500/5 border border-purple-500/20 backdrop-blur-sm">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all backdrop-blur-sm"
                    style={{ backgroundColor: "rgba(13, 5, 32, 0.5)" }}
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all backdrop-blur-sm"
                    style={{ backgroundColor: "rgba(13, 5, 32, 0.5)" }}
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all resize-none backdrop-blur-sm"
                    style={{ backgroundColor: "rgba(13, 5, 32, 0.5)" }}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Send Message
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-purple-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-white">© 2026 Chatify</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-400">
              <a href="#" className="hover:text-purple-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                Terms of Service
              </a>
              <button
                onClick={() => scrollToSection("contact")}
                className="hover:text-purple-400 transition-colors"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </footer>

      <style>{`html { scroll-behavior: smooth; }`}</style>
    </div>
  );
};

export default LandingPage;
