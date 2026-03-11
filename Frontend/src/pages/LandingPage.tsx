// import React, { useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";

// type Feature = { title: string; description: string };

// const LandingPage: React.FC = () => {
//   const navigate = useNavigate();

//   const features = useMemo<Feature[]>(
//     () => [
//       {
//         title: "Instant Messaging",
//         description: "Send and receive messages instantly, without waiting or refreshing.",
//       },
//       {
//         title: "Reply to Messages",
//         description: "Reply to specific messages so conversations stay clear and easy to follow.",
//       },
//       {
//         title: "Share Photos & Files",
//         description: "Send images and files effortlessly, right inside the chat.",
//       },
//       {
//         title: "Clean, Organized Chats",
//         description: "Messages are neatly grouped by date, so nothing feels messy.",
//       },
//       {
//         title: "Smooth Scrolling",
//         description: "Scroll naturally through older messages without sudden jumps.",
//       },
//       {
//         title: "AI Chat Assistance",
//         description: "Get smart reply suggestions, improve your messages, or chat with an AI assistant anytime.",
//       },
//     ],
//     [],
//   );

//   const scrollTo = (id: string) => {
//     const element = document.getElementById(id);
//     if (!element) return;
//     element.scrollIntoView({ behavior: "smooth", block: "start" });
//   };

//   const fadeInUp: any = {
//     hidden: { opacity: 0, y: 40 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
//   };

//   const staggerContainer: any = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
//   };

//   return (
//     <div className="min-h-screen bg-[#070a10] text-white overflow-hidden">
//       {/* background glow */}
//       <div className="pointer-events-none fixed inset-0 -z-10">
//         <div className="absolute -top-56 left-1/2 h-[560px] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.26),rgba(99,102,241,0.00))]" />
//         <div className="absolute top-16 left-0 h-[560px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(168,85,247,0.20),rgba(168,85,247,0.00))]" />
//         <div className="absolute bottom-0 right-0 h-[680px] w-[680px] rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.12),rgba(56,189,248,0.00))]" />
//       </div>

//       {/* NAVBAR */}
//       <motion.nav 
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6"
//       >
//         <div className="flex w-full max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-black/55 px-7 py-4 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
//           <button
//             onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//             className="text-lg font-semibold tracking-tight"
//           >
//             ChitChat
//           </button>

//           <div className="hidden gap-10 text-sm text-white/80 md:flex">
//             <button onClick={() => scrollTo("features")} className="hover:text-white transition-colors">
//               Features
//             </button>
//             <button onClick={() => scrollTo("how")} className="hover:text-white transition-colors">
//               How it works
//             </button>
//             <button onClick={() => scrollTo("contact")} className="hover:text-white transition-colors">
//               Contact
//             </button>
//           </div>

//           <button
//             onClick={() => navigate("/auth")}
//             className="rounded-xl bg-white px-6 py-2 text-sm font-semibold text-black hover:bg-white/90 transition-colors"
//           >
//             Login
//           </button>
//         </div>
//       </motion.nav>

//       {/* HERO */}
//       <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 pt-36 pb-20 lg:grid-cols-2">
//         <motion.div 
//           initial="hidden"
//           animate="visible"
//           variants={staggerContainer}
//           className="space-y-7"
//         >
//           <motion.div variants={fadeInUp} className="hidden grid-cols-4 gap-10 pb-4 text-center text-sm text-white/55 lg:grid">
//             <div>Private by default</div>
//             <div>Fast &amp; smooth chats</div>
//             <div>No ads. Ever.</div>
//             <div>Built for real conversations.</div>
//           </motion.div>

//           <motion.h1 variants={fadeInUp} className="text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
//             Chat instantly.
//             <br />
//             <span className="text-indigo-400">No noise.</span>
//             <br />
//             Just people.
//           </motion.h1>

//           <motion.p variants={fadeInUp} className="max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
//             ChitChat helps you stay connected without distractions. Clean conversations, smooth experience, and privacy by
//             default.
//           </motion.p>

//           <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
//             <button
//               onClick={() => navigate("/auth")}
//               className="rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white hover:bg-indigo-500 transition-colors"
//             >
//               Get Started
//             </button>
//             <button className="rounded-xl border border-white/15 bg-white/0 px-7 py-3 font-semibold text-white/90 hover:bg-white/5 transition-colors">
//               Live Demo
//             </button>
//           </motion.div>
//         </motion.div>

//         {/* CHAT MOCKUP */}
//         <motion.div 
//           initial={{ opacity: 0, x: 40 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//           className="rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_40px_120px_rgba(0,0,0,0.55)]"
//         >
//           <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-6 py-4">
//             <div className="h-3 w-3 rounded-full bg-red-500/90" />
//             <div className="h-3 w-3 rounded-full bg-yellow-500/90" />
//             <div className="h-3 w-3 rounded-full bg-green-500/90" />
//           </div>

//           <div className="space-y-4 p-7 sm:p-8">
//             <div className="flex">
//               <div className="max-w-[85%] rounded-2xl bg-indigo-500/30 px-5 py-3 text-sm text-white ring-1 ring-white/10">
//                 Did you try the new chat app?
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <div className="max-w-[85%] rounded-2xl bg-white/10 px-5 py-3 text-sm text-white ring-1 ring-white/10">
//                 Yeah, it&apos;s clean and super smooth.
//               </div>
//             </div>

//             <div className="flex">
//               <div className="max-w-[85%] rounded-2xl bg-indigo-500/30 px-5 py-3 text-sm text-white ring-1 ring-white/10">
//                 Finally something simple 😌
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </section>

//       {/* FEATURES */}
//       <section id="features" className="scroll-mt-40 px-6 py-24">
//         <div className="mx-auto max-w-6xl">
//           <motion.h2 
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-100px" }}
//             variants={fadeInUp}
//             className="text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
//           >
//             Everything you need. Nothing extra.
//           </motion.h2>

//           <motion.div 
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-100px" }}
//             variants={staggerContainer}
//             className="mt-14 grid gap-6 md:grid-cols-3"
//           >
//             {features.map((f) => (
//               <motion.div
//                 key={f.title}
//                 variants={fadeInUp}
//                 className="rounded-2xl border border-white/10 bg-white/5 p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
//               >
//                 <h3 className="text-base font-semibold text-white">{f.title}</h3>
//                 <p className="mt-2 text-sm leading-relaxed text-white/65">{f.description}</p>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* HOW IT WORKS */}
//       <section id="how" className="scroll-mt-40 px-6 py-24">
//         <div className="mx-auto max-w-6xl">
//           <motion.div 
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-100px" }}
//             variants={staggerContainer}
//             className="grid gap-6 md:grid-cols-3"
//           >
//             <motion.div variants={fadeInUp} className="rounded-2xl border border-white/10 bg-white/5 p-8">
//               <h3 className="text-lg font-semibold text-white">Create your account</h3>
//               <p className="mt-2 text-sm text-white/65">Sign up and you&apos;re ready to go in seconds.</p>
//             </motion.div>
//             <motion.div variants={fadeInUp} className="rounded-2xl border border-white/10 bg-white/5 p-8">
//               <h3 className="text-lg font-semibold text-white">Find friends and start chats</h3>
//               <p className="mt-2 text-sm text-white/65">Search, connect, and keep conversations organized.</p>
//             </motion.div>
//             <motion.div variants={fadeInUp} className="rounded-2xl border border-white/10 bg-white/5 p-8">
//               <h3 className="text-lg font-semibold text-white">Talk freely, without noise</h3>
//               <p className="mt-2 text-sm text-white/65">A clean UI that keeps you focused on people.</p>
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section id="contact" className="scroll-mt-40 px-6 py-24 text-center">
//         <motion.div 
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, margin: "-100px" }}
//           variants={fadeInUp}
//           className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/5 px-8 py-16 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] sm:px-14"
//         >
//           <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Ready to start chatting?</h2>
//           <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
//             Join ChitChat and enjoy messaging without distractions.
//           </p>
//           <button
//             onClick={() => navigate("/auth")}
//             className="mt-10 rounded-xl bg-indigo-600 px-10 py-4 font-semibold text-white hover:bg-indigo-500 transition-colors"
//           >
//             Create Free Account
//           </button>
//         </motion.div>
//       </section>

//       <footer className="border-t border-white/10 py-10 text-center text-sm text-white/55">© 2026 ChitChat</footer>
//     </div>
//   );
// };

// export default LandingPage;