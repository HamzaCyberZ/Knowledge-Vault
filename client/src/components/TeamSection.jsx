import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Code, Palette, Brain } from 'lucide-react';

const teamMembers = [
  {
    name: 'Hamza Khan',
    role: 'Team Leader & Backend Developer',
    image: '/team/hamza.jpg',
    fallback: 'HK',
    color: 'from-cyan-400 to-blue-600',
    skills: ['Node.js', 'Express.js', 'MongoDB', 'JWT Auth', 'REST API', 'Security'],
    description: '5+ years of experience. Responsible for complete backend architecture and security implementation.',
    social: {
      github: 'https://github.com/HamzaCyberZ',
      linkedin: 'https://www.linkedin.com/in/hamza-khan-361564201/',
      twitter: 'https://twitter.com/hamzakhan',
      email: 'hamxak981@gmail.com',
    },
    icon: Code,
  },
  {
    name: 'Muhammad Saad',
    role: 'Frontend Developer & UI/UX Designer',
    image: '/team/saad.jpg',
    fallback: 'MS',
    color: 'from-purple-400 to-pink-600',
    skills: ['React.js', 'Tailwind CSS', 'Framer Motion', 'Responsive Design', 'API Integration'],
    description: 'Expert in aesthetic design and seamless user experience.',
    social: {
      github: 'https://github.com/saad',
      linkedin: 'https://linkedin.com/in/saad',
      twitter: 'https://twitter.com/saad',
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
    skills: ['MongoDB', 'AI/ML', 'Data Architecture', 'Recommendation Systems', 'Optimization'],
    description: 'Specialist in Data Science and AI Recommendation Engines.',
    social: {
      github: 'https://github.com/ilham',
      linkedin: 'https://linkedin.com/in/ilham',
      twitter: 'https://twitter.com/ilham',
      email: 'ilham@knowledgevault.com',
    },
    icon: Brain,
  },
];

const TeamSection = () => {
  return (
    <section id="team" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-cyan-400 font-semibold tracking-wider uppercase text-sm">
              Our Team
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Meet the Creators
              </span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative"
            >
              <div className="relative bg-slate-900 border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300">
                
                {/* Image Section - CLEANED UP */}
                <div className="h-80 relative overflow-hidden bg-slate-800">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    style={{ mixBlendMode: 'normal', filter: 'none' }} // Isse picture original nazar ayegi
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  
                  {/* Fallback */}
                  <div className="absolute inset-0 hidden items-center justify-center text-6xl font-bold text-white/10">
                    {member.fallback}
                  </div>
                  
                  {/* Icon Badge */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-slate-900/60 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10">
                    <member.icon className="h-5 w-5 text-cyan-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className={`text-sm font-medium bg-gradient-to-r ${member.color} bg-clip-text text-transparent mb-4`}>
                    {member.role}
                  </p>
                  
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                    {member.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {member.skills.slice(0, 3).map((skill, i) => (
                      <span key={i} className="px-2 py-1 text-[10px] uppercase tracking-wider bg-white/5 text-gray-400 rounded-md border border-white/5">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Socials */}
                  <div className="flex items-center space-x-3 border-t border-white/5 pt-6">
                    <a href={member.social.github} className="text-gray-500 hover:text-white transition-colors"><Github size={18} /></a>
                    <a href={member.social.linkedin} className="text-gray-500 hover:text-white transition-colors"><Linkedin size={18} /></a>
                    <a href={`mailto:${member.social.email}`} className="text-gray-500 hover:text-white transition-colors"><Mail size={18} /></a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;