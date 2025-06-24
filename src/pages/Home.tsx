import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart, Users, Star, Moon } from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 relative overflow-hidden pt-24 flex flex-col">
      <div className="flex-1">
        {/* Floating Lanterns - Only on Home Page */}
        <div className="absolute inset-0 pointer-events-none z-5">
          {/* Lantern 1 - Medium size, left side */}
          <div className="absolute top-0 left-1/4 transform -translate-x-1/2 animate-float-gentle">
            <div className="relative">
              {/* Hanging string */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gradient-to-b from-yellow-600/40 to-transparent"></div>
              
              {/* Lantern */}
              <div className="mt-16 relative">
                <img 
                  src="/ChatGPT Image Jun 22, 2025, 11_31_06 AM.png" 
                  alt="" 
                  className="w-20 h-28 object-contain opacity-80 drop-shadow-2xl"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(255, 193, 7, 0.6)) drop-shadow(0 0 40px rgba(255, 193, 7, 0.3))'
                  }}
                />
                
                {/* Soft glow effect */}
                <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse-slow"></div>
                
                {/* Sparkle particles */}
                <div className="absolute inset-0">
                  <div className="absolute top-2 right-2 w-1 h-1 bg-yellow-300 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
                  <div className="absolute bottom-4 left-1 w-0.5 h-0.5 bg-yellow-200 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <div className="absolute top-1/2 -right-2 w-0.5 h-0.5 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Lantern 2 - Small size, right side */}
          <div className="absolute top-0 right-1/3 transform translate-x-1/2 animate-float-gentle" style={{animationDelay: '1s'}}>
            <div className="relative">
              {/* Hanging string */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-gradient-to-b from-yellow-600/40 to-transparent"></div>
              
              {/* Lantern */}
              <div className="mt-12 relative">
                <img 
                  src="/ChatGPT Image Jun 22, 2025, 11_31_06 AM.png" 
                  alt="" 
                  className="w-14 h-20 object-contain opacity-75 drop-shadow-xl"
                  style={{
                    filter: 'drop-shadow(0 0 15px rgba(255, 193, 7, 0.5)) drop-shadow(0 0 30px rgba(255, 193, 7, 0.2))'
                  }}
                />
                
                {/* Soft glow effect */}
                <div className="absolute inset-0 bg-yellow-400/15 rounded-full blur-lg animate-pulse-slow" style={{animationDelay: '0.5s'}}></div>
                
                {/* Sparkle particles */}
                <div className="absolute inset-0">
                  <div className="absolute top-1 left-2 w-0.5 h-0.5 bg-yellow-300 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute bottom-2 right-1 w-1 h-1 bg-yellow-200 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Lantern 3 - Medium size, center-right */}
          <div className="absolute top-0 right-1/6 transform translate-x-1/4 animate-float-gentle" style={{animationDelay: '2s'}}>
            <div className="relative">
              {/* Hanging string */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-20 bg-gradient-to-b from-yellow-600/40 to-transparent"></div>
              
              {/* Lantern */}
              <div className="mt-20 relative">
                <img 
                  src="/ChatGPT Image Jun 22, 2025, 11_31_06 AM.png" 
                  alt="" 
                  className="w-18 h-26 object-contain opacity-70 drop-shadow-2xl"
                  style={{
                    filter: 'drop-shadow(0 0 18px rgba(255, 193, 7, 0.4)) drop-shadow(0 0 35px rgba(255, 193, 7, 0.2))'
                  }}
                />
                
                {/* Soft glow effect */}
                <div className="absolute inset-0 bg-yellow-400/18 rounded-full blur-xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
                
                {/* Sparkle particles */}
                <div className="absolute inset-0">
                  <div className="absolute top-3 left-1 w-0.5 h-0.5 bg-yellow-300 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <div className="absolute bottom-3 right-2 w-1 h-1 bg-yellow-200 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                  <div className="absolute top-1/2 -left-1 w-0.5 h-0.5 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-800/30 via-purple-800/20 to-blue-800/30 animate-gradient-shift"></div>
          
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
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          {/* Gentle Mist */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/8 to-transparent animate-mist-1"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-transparent via-purple-300/8 to-transparent animate-mist-2"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto p-8">
          {/* Welcome Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="relative inline-block mb-8">
              <Heart size={80} className="text-pink-300/80 animate-pulse-slow" fill="currentColor" />
              <div className="absolute inset-0 rounded-full bg-pink-300/20 blur-2xl animate-pulse-gentle"></div>
              
              {/* Orbiting Sparkles */}
              <div className="absolute inset-0 animate-spin-slow">
                <Sparkles size={12} className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-pink-300/60" />
                <Star size={10} className="absolute top-1/2 -right-4 transform -translate-y-1/2 text-purple-300/60" />
                <Sparkles size={14} className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-indigo-300/60" />
                <Moon size={8} className="absolute top-1/2 -left-4 transform -translate-y-1/2 text-blue-300/60" />
              </div>
            </div>
            
            <h1 className="text-4xl font-cursive text-purple-100 mb-6 glow-text">
              Welcome to your sanctuary
            </h1>
            <p className="text-xl font-serif text-purple-200/80 leading-relaxed max-w-2xl mx-auto">
              Choose your path for today's journey of self-discovery and healing
            </p>
          </div>

          {/* Main Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Truly Space - Now with Sparkles icon and indigo theme */}
            <button 
              onClick={() => navigate('/truly-space')}
              className="group relative p-8 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-300/30 rounded-3xl hover:from-indigo-500/30 hover:to-purple-500/30 hover:border-indigo-300/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20 glow-button text-center animate-fade-in"
            >
              <div className="relative mb-6 mx-auto">
                <Sparkles size={48} className="text-indigo-300/80 group-hover:text-indigo-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 animate-pulse-gentle" />
                <div className="absolute inset-0 rounded-full bg-current opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-2xl font-serif text-indigo-200 mb-4 group-hover:glow-text transition-all duration-500 group-hover:scale-105">
                Truly Space
              </h3>
              <p className="text-indigo-300/70 font-serif leading-relaxed group-hover:text-indigo-300/90 transition-all duration-500">
                Your sanctuary for reflection, journaling, and healing rituals
              </p>
              <div className="absolute top-4 right-4">
                <div className="w-3 h-3 bg-indigo-400/60 rounded-full animate-pulse"></div>
              </div>
              
              {/* Enhanced hover effects */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"></div>
            </button>

            {/* Truly Twin - Now with Moon icon and purple theme */}
            <button 
              onClick={() => navigate('/truly-twin')}
              className="group relative p-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-300/30 rounded-3xl hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-300/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 glow-button text-center animate-fade-in"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="relative mb-6 mx-auto">
                <Moon size={48} className="text-purple-300/80 group-hover:text-purple-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 animate-pulse-gentle" />
                <div className="absolute inset-0 rounded-full bg-current opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-2xl font-serif text-purple-200 mb-4 group-hover:glow-text transition-all duration-500 group-hover:scale-105">
                Truly Twin
              </h3>
              <p className="text-purple-300/70 font-serif leading-relaxed group-hover:text-purple-300/90 transition-all duration-500">
                Your gentle AI companion for deep conversations and emotional support
              </p>
              <div className="absolute top-4 right-4">
                <div className="w-3 h-3 bg-purple-400/60 rounded-full animate-pulse"></div>
              </div>
              
              {/* Enhanced hover effects */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"></div>
            </button>

            {/* Truly Circles - With enhanced hover effects */}
            <button 
              onClick={() => navigate('/truly-circles')}
              className="group relative p-8 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 backdrop-blur-sm border border-teal-300/30 rounded-3xl hover:from-teal-500/30 hover:to-cyan-500/30 hover:border-teal-300/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/20 glow-button text-center animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="relative mb-6 mx-auto">
                <Users size={48} className="text-teal-300/80 group-hover:text-teal-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 animate-pulse-gentle" />
                <div className="absolute inset-0 rounded-full bg-current opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-2xl font-serif text-teal-200 mb-4 group-hover:glow-text transition-all duration-500 group-hover:scale-105">
                Truly Circles
              </h3>
              <p className="text-teal-300/70 font-serif leading-relaxed group-hover:text-teal-300/90 transition-all duration-500">
                Find your emotional community in safe, anonymous support circles
              </p>
              <div className="absolute top-4 right-4">
                <div className="w-3 h-3 bg-teal-400/60 rounded-full animate-pulse"></div>
              </div>
              
              {/* Enhanced hover effects */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-teal-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"></div>
            </button>

            {/* Truly Origin - With enhanced hover effects */}
            <button 
              onClick={() => navigate('/truly-origin')}
              className="group relative p-8 bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-sm border border-pink-300/30 rounded-3xl hover:from-pink-500/30 hover:to-rose-500/30 hover:border-pink-300/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 glow-button text-center animate-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="relative mb-6 mx-auto">
                <Star size={48} className="text-pink-300/80 group-hover:text-pink-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 animate-pulse-gentle" />
                <div className="absolute inset-0 rounded-full bg-current opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-2xl font-serif text-pink-200 mb-4 group-hover:glow-text transition-all duration-500 group-hover:scale-105">
                Truly Origin
              </h3>
              <p className="text-pink-300/70 font-serif leading-relaxed group-hover:text-pink-300/90 transition-all duration-500">
                Discover the heart behind TRULY and share your own story
              </p>
              <div className="absolute top-4 right-4">
                <div className="w-3 h-3 bg-pink-400/60 rounded-full animate-pulse"></div>
              </div>
              
              {/* Enhanced hover effects */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-400/10 to-rose-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-pink-500/20 to-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"></div>
            </button>
          </div>

          {/* Footer Message */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <p className="text-lg font-cursive text-purple-300/70 italic">
              "Every journey begins with a single, gentle step..."
            </p>
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

export default Home;