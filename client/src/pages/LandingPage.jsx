import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, Sparkles, ArrowRight, Star, 
  Zap, Shield, Globe, ChevronRight,
  Github, Linkedin, Mail, Code, Palette, Brain 
} from 'lucide-react';

// --- Team Data (As provided by you) ---
const teamMembers = [
  {
    name: 'Hamza Khan',
    role: 'Team Leader & Backend Developer',
    image: '/team/hamza.jpg',
    fallback: 'HK',
    color: 'from-cyan-400 to-blue-600',
    skills: ['Node.js', 'Express.js', 'MongoDB', 'JWT Auth', 'Security'],
    description: 'Responsible for complete backend architecture and security implementation.',
    social: {
      github: 'https://github.com/HamzaCyberZ',
      linkedin: 'https://www.linkedin.com/in/hamza-khan-361564201/',
      email: 'hamxak981@gmail.com',
    },
    icon: Code,
  },
  {
    name: 'Muhammad Saad',
    role: 'Frontend Developer & UI/UX',
    image: '/team/saad.jpg',
    fallback: 'MS',
    color: 'from-purple-400 to-pink-600',
    skills: ['React.js', 'Tailwind CSS', 'Framer Motion', 'UI/UX'],
    description: 'Expert in aesthetic design and seamless user experience.',
    social: {
      github: 'https://github.com/saad',
      linkedin: 'https://linkedin.com/in/saad',
      email: 'saad@knowledgevault.com',
    },
    icon: Palette,
  },
  {
    name: 'Ilham Raza',
    role: 'Database & AI Engineer',
    image: '/team/ilham.jpg',
    fallback: 'IR',
    color: 'from-emerald-400 to-teal-600',
    skills: ['MongoDB', 'AI/ML', 'Recommendation Systems'],
    description: 'Specialist in Data Science and AI Recommendation Engines.',
    social: {
      github: 'https://github.com/ilham',
      linkedin: 'https://linkedin.com/in/ilham',
      email: 'ilham@knowledgevault.com',
    },
    icon: Brain,
  },
];

const LandingPage = () => {
  const features = [
    {
      icon: <Sparkles className="h-6 w-6 text-cyan-400" />,
      title: "AI-Powered",
      description: "Smart recommendations tailored to your learning style"
    },
    {
      icon: <Zap className="h-6 w-6 text-purple-400" />,
      title: "Instant Access",
      description: "Download and start reading in seconds"
    },
    {
      icon: <Shield className="h-6 w-6 text-green-400" />,
      title: "Premium Content",
      description: "Curated collection of best programming books"
    },
    {
      icon: <Globe className="h-6 w-6 text-pink-400" />,
      title: "Always Available",
      description: "24/7 access to your digital library"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="w-full bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">Knowledge Vault</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Features</a>
              <a href="#team" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Team</a>
              <Link to="/subscription" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Pricing</Link>
            </div>
            
            <Link 
              to="/register"
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full relative py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-8"
          >
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-medium text-slate-300 uppercase tracking-widest">The Future of Digital Learning</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black mb-8 leading-[1.1]"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Master Your Craft
            </span>
            <br />
            <span className="text-white">With AI Intelligence</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Access thousands of premium programming resources, AI-curated roadmaps, 
            and a community built by developers, for developers.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              to="/browse"
              className="group flex items-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-2xl font-bold text-lg hover:bg-cyan-400 transition-colors"
            >
              Explore Library <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#team"
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors"
            >
              Meet the Creators
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-slate-400">Everything you need to level up your coding game</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="p-8 bg-slate-800/40 border border-white/5 rounded-3xl hover:border-cyan-500/30 transition-all"
              >
                <div className="h-12 w-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Team Section (Integrated) --- */}
      <section id="team" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-cyan-400 font-bold tracking-widest uppercase text-xs">Architects of Vault</span>
              <h2 className="text-4xl md:text-6xl font-bold mt-4">Meet the Creators</h2>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-cyan-500/50 transition-all duration-500"
              >
                <div className="h-72 relative bg-slate-800 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                  />
                  <div className="absolute inset-0 hidden items-center justify-center bg-slate-800 text-4xl font-bold text-white/10">
                    {member.fallback}
                  </div>
                  <div className="absolute top-6 right-6 p-2 bg-slate-950/60 backdrop-blur-md rounded-xl border border-white/10">
                    <member.icon className="h-5 w-5 text-cyan-400" />
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                  <p className={`text-sm font-bold bg-gradient-to-r ${member.color} bg-clip-text text-transparent mb-4`}>
                    {member.role}
                  </p>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed line-clamp-2">
                    {member.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {member.skills.slice(0, 3).map((skill, i) => (
                      <span key={i} className="px-3 py-1 text-[10px] font-bold uppercase bg-white/5 text-slate-300 rounded-full border border-white/10">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                    <a href={member.social.github} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors"><Github size={18} /></a>
                    <a href={member.social.linkedin} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors"><Linkedin size={18} /></a>
                    <a href={`mailto:${member.social.email}`} className="text-slate-500 hover:text-white transition-colors"><Mail size={18} /></a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-br from-cyan-600 to-purple-700 rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl shadow-cyan-500/20">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to start your journey?</h2>
              <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
                Join Hamza and the team in building the world's most intelligent learning platform.
              </p>
              <Link 
                to="/register"
                className="inline-flex items-center gap-2 px-10 py-4 bg-white text-slate-950 rounded-2xl font-bold text-lg hover:scale-105 transition-transform"
              >
                Get Started Now <ArrowRight size={20} />
              </Link>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-white/5 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg">Knowledge Vault</span>
            </div>
            <p className="text-slate-500 text-sm">© 2026 Knowledge Vault. Built with ❤️ by the team.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-slate-500 hover:text-white text-sm transition-colors">Privacy</Link>
              <Link to="/terms" className="text-slate-500 hover:text-white text-sm transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;