import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Star, Moon, TreePine, Brain } from 'lucide-react';
import LoginButton from '../components/LoginButton';

function RitualsRealms() {
  const navigate = useNavigate();

  const ritualCards = [
    {
      id: 'floating-lantern',
      title: 'Floating Lantern Ritual',
      description: 'Release your worries and wishes into the night sky with glowing lanterns',
      icon: Sparkles,
      gradient: 'from-yellow-500/20 to-orange-500/20',
      borderColor: 'border-yellow-300/30',
      hoverGradient: 'hover:from-yellow-500/30 hover:to-orange-500/30',
      hoverBorder: 'hover:border-yellow-300/50',
      iconColor: 'text-yellow-300/80',
      textColor: 'text-yellow-200',
      descColor: 'text-yellow-300/70',
      route: '/floating-lantern'
    },
    {
      id: 'lullaby-mode',
      title: 'Lullaby Mode',
      description: 'Gentle sounds and soothing visuals to calm your mind and soul',
      icon: Moon,
      gradient: 'from-blue-500/20 to-indigo-500/20',
      borderColor: 'border-blue-300/30',
      hoverGradient: 'hover:from-blue-500/30 hover:to-indigo-500/30',
      hoverBorder: 'hover:border-blue-300/50',
      iconColor: 'text-blue-300/80',
      textColor: 'text-blue-200',
      descColor: 'text-blue-300/70',
      route: '/lullaby-mode'
    },
    {
      id: 'secret-garden',
      title: 'Secret Garden',
      description: 'Tend to your inner garden where thoughts bloom into wisdom',
      icon: TreePine,
      gradient: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-300/30',
      hoverGradient: 'hover:from-green-500/30 hover:to-emerald-500/30',
      hoverBorder: 'hover:border-green-300/50',
      iconColor: 'text-green-300/80',
      textColor: 'text-green-200',
      descColor: 'text-green-300/70',
      route: '/secret-garden'
    },
    {
      id: 'ai-mind-map',
      title: 'AI Mind Map',
      description: 'Visualize your thoughts and emotions in beautiful, interconnected patterns',
      icon: Brain,
      gradient: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-300/30',
      hoverGradient: 'hover:from-purple-500/30 hover:to-pink-500/30',
      hoverBorder: 'hover:border-purple-300/50',
      iconColor: 'text-purple-300/80',
      textColor: 'text-purple-200',
      descColor: 'text-purple-300/70',
      route: '/ai-mind-map'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950 relative overflow-hidden">
      {/* Login Button */}
      <div className="absolute top-6 right-6 z-20">
        <LoginButton />
      </div>

      {/* Animated Starscape Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-blue-900/40 animate-gradient-shift"></div>
        
        {/* Glimmering Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <Star 
              key={i}
              size={Math.random() * 3 + 1} 
              className="absolute text-white/20 animate-pulse-gentle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Floating Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <Sparkles 
              key={i}
              size={Math.random() * 6 + 4} 
              className="absolute text-white/10 animate-pulse-slow"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Dreamy Mist Overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-mist-1"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-transparent via-purple-300/5 to-transparent animate-mist-2"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-pink-300/3 to-transparent animate-mist-3"></div>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <button 
          onClick={() => navigate('/truly-space')}
          className="flex items-center gap-3 text-purple-200 hover:text-purple-100 transition-colors duration-300 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-serif">Back to Truly Space</span>
        </button>

        <h1 className="text-2xl font-cursive text-purple-100 glow-text animate-pulse-gentle">Rituals & Realms</h1>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-[calc(100vh-88px)] p-8">
        <div className="max-w-6xl mx-auto">
          {/* Enchanted Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="relative inline-block mb-8">
              <Moon size={80} className="text-purple-300/60 animate-pulse-slow" />
              <div className="absolute inset-0 rounded-full bg-purple-300/10 blur-2xl animate-pulse-gentle"></div>
              
              {/* Orbiting Sparkles */}
              <div className="absolute inset-0 animate-spin-slow">
                <Sparkles size={16} className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-pink-300/60" />
                <Sparkles size={12} className="absolute top-1/2 -right-4 transform -translate-y-1/2 text-yellow-300/60" />
                <Sparkles size={14} className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-blue-300/60" />
                <Sparkles size={10} className="absolute top-1/2 -left-4 transform -translate-y-1/2 text-green-300/60" />
              </div>
            </div>
            
            <h2 className="text-4xl font-cursive text-purple-100 mb-6 glow-text">
              Enter Your Enchanted Inner World
            </h2>
            <p className="text-xl font-serif text-purple-200/80 leading-relaxed max-w-2xl mx-auto">
              Sacred spaces where healing happens through ritual, beauty, and gentle magic
            </p>
          </div>

          {/* Ritual Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
            {ritualCards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => navigate(card.route)}
                className={`group relative p-8 bg-gradient-to-br ${card.gradient} backdrop-blur-sm border ${card.borderColor} rounded-3xl ${card.hoverGradient} ${card.hoverBorder} transition-all duration-500 hover:scale-105 glow-button text-left animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Magical Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Floating Icon */}
                <div className="relative mb-6">
                  <card.icon size={56} className={`${card.iconColor} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`} />
                  
                  {/* Icon Glow */}
                  <div className="absolute inset-0 rounded-full bg-current opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
                </div>

                {/* Card Content */}
                <h3 className={`text-2xl font-cursive ${card.textColor} mb-4 group-hover:glow-text transition-all duration-300`}>
                  {card.title}
                </h3>
                <p className={`${card.descColor} font-serif leading-relaxed group-hover:text-opacity-90 transition-all duration-300`}>
                  {card.description}
                </p>

                {/* Magical Particles on Hover */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {[...Array(6)].map((_, i) => (
                    <Sparkles
                      key={i}
                      size={8}
                      className="absolute text-white/30 animate-pulse-gentle"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  ))}
                </div>

                {/* Status Indicator */}
                <div className="absolute top-4 right-4">
                  <div className={`w-3 h-3 ${card.iconColor.replace('text-', 'bg-').replace('/80', '/60')} rounded-full animate-pulse`}></div>
                </div>
              </button>
            ))}
          </div>

          {/* Mystical Footer Message */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <p className="text-lg font-cursive text-purple-300/70 italic">
              "In these sacred spaces, your soul remembers how to breathe..."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RitualsRealms;