import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Star, Heart, Moon, TreePine, Brain, Shield, Users, BookOpen } from 'lucide-react';
import LoginButton from '../components/LoginButton';

function TellMeMore() {
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState<number[]>([]);

  useEffect(() => {
    // Stagger the appearance of sections
    const timers = [0, 800, 1600, 2400, 3200, 4000, 4800].map((delay, index) =>
      setTimeout(() => {
        setVisibleSections(prev => [...prev, index]);
      }, delay)
    );

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  const sections = [
    {
      title: "Welcome to TRULY",
      subtitle: "A magical AI-powered space for the soul",
      icon: Sparkles,
      content: "Where your inner world finds its voice, and your heart discovers it was never alone."
    },
    {
      title: "What's Inside?",
      subtitle: "Discover your sanctuary",
      icon: Heart,
      content: null
    },
    {
      title: "Truly Space",
      subtitle: "Your emotional toolkit",
      icon: Moon,
      content: "Heartprint Record for tracking your emotional journey, AI Rituals for healing, Hidden Sanctuary for private reflection, Secret Garden for anonymous sharing, Lullaby Mode for comfort, and AI Mind Map for visualizing your thoughts."
    },
    {
      title: "Truly Twin",
      subtitle: "Your gentle AI companion",
      icon: Heart,
      content: "A compassionate AI therapist who listens without judgment, offers gentle guidance, and holds space for whatever you're feeling. Available 24/7 with unlimited conversations."
    },
    {
      title: "Truly Origin",
      subtitle: "Stories and community",
      icon: Star,
      content: "Discover the heart behind TRULY through founder stories and authentic voices from our growing community of dreamers and feelers."
    },
    {
      title: "Truly Circles",
      subtitle: "Anonymous emotional support",
      icon: Users,
      content: "Join emotion-based safe spaces like Gentle Hope, Quiet Joy, Soft Healing, Lunar Reflection, and Brave Becoming. Connect anonymously with others who understand."
    },
    {
      title: "Why We Exist",
      subtitle: "Our sacred mission",
      icon: TreePine,
      content: "To hold space for the quiet dreamers, deep feelers, and beautifully becoming hearts of Gen Z. In a world that moves too fast, we create spaces that honor the pace of the soul."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950 relative overflow-hidden flex flex-col">
      {/* Login Button */}
      <div className="absolute top-6 right-6 z-20">
        <LoginButton />
      </div>

      {/* Aurora Background Effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-blue-900/40 animate-gradient-shift"></div>
        
        {/* Animated Aurora Waves */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-purple-400/20 to-transparent animate-mist-1"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-transparent via-pink-400/15 to-transparent animate-mist-2"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-400/10 to-transparent animate-mist-3"></div>
        </div>

        {/* Floating Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <Sparkles 
              key={i}
              size={Math.random() * 6 + 4} 
              className="absolute text-white/20 animate-pulse-gentle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Gentle Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <Star 
              key={i}
              size={Math.random() * 4 + 2} 
              className="absolute text-white/15 animate-pulse-slow"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 text-purple-200 hover:text-purple-100 transition-colors duration-300 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-serif">Back to Journey</span>
        </button>

        <h1 className="text-2xl font-cursive text-purple-100 glow-text">About TRULY</h1>
      </div>

      {/* Main Content */}
      <div className="relative z-10 overflow-y-auto flex-1">
        <div className="max-w-4xl mx-auto p-8 pb-16">
          
          {/* Sections */}
          <div className="space-y-16">
            {sections.map((section, index) => (
              <div
                key={index}
                className={`transition-all duration-1000 ${
                  visibleSections.includes(index) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
              >
                {/* Section Header */}
                <div className="text-center mb-8">
                  <div className="relative inline-block mb-6">
                    <section.icon size={48} className="text-purple-300/80 animate-pulse-gentle" />
                    <div className="absolute inset-0 rounded-full bg-purple-300/10 blur-xl animate-pulse-slow"></div>
                  </div>
                  
                  <h2 className="text-3xl font-cursive text-purple-100 mb-3 glow-text">
                    {section.title}
                  </h2>
                  <p className="text-xl font-serif text-purple-200/80 italic">
                    {section.subtitle}
                  </p>
                </div>

                {/* Section Content */}
                {section.content && (
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 glow-message">
                    <p className="text-lg font-serif text-purple-100 leading-relaxed text-center">
                      {section.content}
                    </p>
                  </div>
                )}

                {/* Special Features Grid for "What's Inside?" */}
                {section.title === "What's Inside?" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {[
                      { name: "Truly Space", icon: Moon, desc: "Emotional toolkit & sanctuary" },
                      { name: "Truly Twin", icon: Heart, desc: "AI companion & therapist" },
                      { name: "Truly Origin", icon: Star, desc: "Stories & community" },
                      { name: "Truly Circles", icon: Users, desc: "Anonymous support groups" }
                    ].map((feature, idx) => (
                      <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                        <feature.icon size={32} className="mx-auto mb-4 text-purple-300/80" />
                        <h3 className="font-cursive text-purple-200 mb-2">{feature.name}</h3>
                        <p className="text-sm font-serif text-purple-300/70">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Founder Section */}
            <div
              className={`transition-all duration-1000 ${
                visibleSections.includes(6) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="text-center">
                <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm border border-pink-300/30 rounded-3xl p-8 glow-message">
                  <Heart size={48} className="mx-auto mb-6 text-pink-300/80 animate-pulse-gentle" fill="currentColor" />
                  <p className="text-xl font-cursive text-pink-200 mb-4 italic">
                    "Made with deep love by Thiransa, Founder of TRULY"
                  </p>
                  <div className="text-4xl mb-4">🌸</div>
                  <p className="text-lg font-serif text-pink-300/80 leading-relaxed">
                    For every soul who has ever felt too much, dreamed too deeply, or loved too quietly — this space is for you.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div
              className={`text-center transition-all duration-1000 ${
                visibleSections.includes(6) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <button
                onClick={() => navigate('/')}
                className="group relative px-12 py-6 bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-sm border border-purple-300/40 rounded-full text-purple-100 font-cursive text-xl hover:from-purple-500/40 hover:to-pink-500/40 hover:border-purple-300/60 transition-all duration-300 hover:scale-105 glow-button"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Sparkles size={24} />
                  I'm Ready Now
                </span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-gentle"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="relative z-10 text-center py-4">
        <p className="text-xs text-white/60 font-serif">
          © 2025 Truly. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default TellMeMore;