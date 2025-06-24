import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Star, Crown, Check, X } from 'lucide-react';
import LoginButton from '../components/LoginButton';

function Premium() {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);

  const features = [
    {
      name: 'Truly Twin (AI therapist)',
      free: '1 msg/day',
      premium: 'Unlimited',
      isPremiumBool: false
    },
    {
      name: 'Personalized Lullabies',
      free: false,
      premium: true,
      isPremiumBool: true
    },
    {
      name: 'AI Mind Map',
      free: false,
      premium: true,
      isPremiumBool: true
    },
    {
      name: 'Story Garden',
      free: '1 plant/month',
      premium: 'Unlimited',
      isPremiumBool: false
    },
    {
      name: 'Secret Garden Access',
      free: false,
      premium: true,
      isPremiumBool: true
    },
    {
      name: 'Rituals & Realms',
      free: 'Limited',
      premium: 'Full Access',
      isPremiumBool: false
    },
    {
      name: 'Emotional Analytics',
      free: false,
      premium: true,
      isPremiumBool: true
    },
    {
      name: 'Truly Circles (Support Groups)',
      free: 'Read Only',
      premium: 'Chat & Share',
      isPremiumBool: false
    },
    {
      name: 'Premium Badge',
      free: false,
      premium: true,
      isPremiumBool: true
    },
    {
      name: 'Custom Profile Themes',
      free: false,
      premium: true,
      isPremiumBool: true
    }
  ];

  const monthlyPrice = 9;
  const yearlyPrice = 79;
  const yearlySavings = Math.round(((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-950 relative overflow-hidden flex flex-col">
      {/* Login Button */}
      <div className="absolute top-6 right-6 z-20">
        <LoginButton />
      </div>

      {/* Twilight Enchanted Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-purple-900/50 to-violet-900/60 animate-gradient-shift"></div>
        
        {/* Magical Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(40)].map((_, i) => (
            <Sparkles 
              key={i}
              size={Math.random() * 6 + 3} 
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

        {/* Glowing Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <Star 
              key={i}
              size={Math.random() * 4 + 2} 
              className="absolute text-yellow-300/25 animate-pulse-slow"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Twilight Mist */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-purple-400/15 to-transparent animate-mist-1"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-transparent via-indigo-400/10 to-transparent animate-mist-2"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-violet-400/8 to-transparent animate-mist-3"></div>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-purple-200 hover:text-purple-100 transition-colors duration-300 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-serif">Back</span>
        </button>

        <h1 className="text-2xl font-cursive text-purple-100 glow-text">✨ Premium</h1>
      </div>

      {/* Main Content */}
      <div className="relative z-10 overflow-y-auto flex-1">
        <div className="max-w-6xl mx-auto p-8 pb-16">
          
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="relative inline-block mb-8">
              <Crown size={80} className="text-yellow-300/80 animate-pulse-slow" />
              <div className="absolute inset-0 rounded-full bg-yellow-300/20 blur-2xl animate-pulse-gentle"></div>
              
              {/* Orbiting Sparkles */}
              <div className="absolute inset-0 animate-spin-slow">
                <Sparkles size={16} className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-yellow-300/60" />
                <Sparkles size={12} className="absolute top-1/2 -right-6 transform -translate-y-1/2 text-pink-300/60" />
                <Sparkles size={14} className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-purple-300/60" />
                <Sparkles size={10} className="absolute top-1/2 -left-6 transform -translate-y-1/2 text-blue-300/60" />
              </div>
            </div>
            
            <h2 className="text-5xl font-serif text-purple-100 mb-6 glow-text">
              ✨ Unlock Your TRULY Experience
            </h2>
            <p className="text-xl font-serif text-purple-200/80 leading-relaxed max-w-3xl mx-auto">
              Step into the full magic of emotional healing and self-discovery
            </p>
          </div>

          {/* Pricing Toggle */}
          <div className="flex justify-center mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-2 glow-message">
              <div className="flex items-center">
                <button
                  onClick={() => setIsYearly(false)}
                  className={`px-6 py-3 rounded-full font-serif transition-all duration-300 ${
                    !isYearly 
                      ? 'bg-gradient-to-r from-purple-500/40 to-pink-500/40 text-purple-100 glow-button' 
                      : 'text-purple-300/70 hover:text-purple-200'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsYearly(true)}
                  className={`px-6 py-3 rounded-full font-serif transition-all duration-300 relative ${
                    isYearly 
                      ? 'bg-gradient-to-r from-purple-500/40 to-pink-500/40 text-purple-100 glow-button' 
                      : 'text-purple-300/70 hover:text-purple-200'
                  }`}
                >
                  Yearly
                  {isYearly && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                      Save {yearlySavings}%
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
            
            {/* Free Plan */}
            <div className="relative p-8 bg-gradient-to-br from-gray-500/20 to-slate-500/20 backdrop-blur-sm border border-gray-300/30 rounded-3xl glow-message">
              {/* Subtle sparkles for free plan */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                {[...Array(8)].map((_, i) => (
                  <Sparkles 
                    key={i}
                    size={Math.random() * 3 + 2} 
                    className="absolute text-white/10 animate-pulse-gentle"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${2 + Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-serif text-gray-200 mb-2">Free</h3>
                <div className="mb-6">
                  <span className="text-4xl font-serif text-gray-100">$0</span>
                  <span className="text-gray-300/70 font-serif">/forever</span>
                </div>
                <p className="text-gray-300/80 font-serif mb-6">Perfect for exploring your inner world</p>
                <button className="w-full py-3 bg-white/10 backdrop-blur-sm border border-gray-300/30 rounded-2xl text-gray-200 font-serif hover:bg-white/15 hover:border-gray-300/50 transition-all duration-300">
                  Current Plan
                </button>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="relative p-8 bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-sm border-2 border-yellow-300/50 rounded-3xl glow-button">
              {/* Premium Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-white text-sm font-cursive flex items-center gap-1">
                <Crown size={14} />
                Most Popular
              </div>

              {/* Enhanced sparkles for premium */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                {[...Array(15)].map((_, i) => (
                  <Sparkles 
                    key={i}
                    size={Math.random() * 4 + 3} 
                    className="absolute text-yellow-300/30 animate-pulse-gentle"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${2 + Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>

              {/* Glowing border effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400/20 to-pink-400/20 blur-lg animate-pulse-slow"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Crown size={24} className="text-yellow-300" />
                  <h3 className="text-2xl font-serif text-purple-100">Premium</h3>
                </div>
                <div className="mb-2">
                  <span className="text-4xl font-serif text-purple-100">
                    ${isYearly ? yearlyPrice : monthlyPrice}
                  </span>
                  <span className="text-purple-300/70 font-serif">
                    /{isYearly ? 'year' : 'month'}
                  </span>
                </div>
                {isYearly && (
                  <p className="text-sm text-green-400 font-cursive mb-4">
                    Save ${monthlyPrice * 12 - yearlyPrice} per year!
                  </p>
                )}
                <p className="text-purple-300/80 font-serif mb-6">Unlock the full magical experience</p>
                <button className="w-full py-3 bg-gradient-to-r from-yellow-500/40 to-orange-500/40 backdrop-blur-sm border border-yellow-300/40 rounded-2xl text-yellow-100 font-serif hover:from-yellow-500/50 hover:to-orange-500/50 hover:border-yellow-300/60 transition-all duration-300 hover:scale-105 glow-button">
                  ✨ Upgrade Now
                </button>
              </div>
            </div>
          </div>

          {/* Feature Comparison Table */}
          <div className="animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <h3 className="text-3xl font-serif text-purple-100 text-center mb-8 glow-text">
              What's Included
            </h3>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden glow-message">
              {/* Table Header */}
              <div className="grid grid-cols-3 gap-4 p-6 bg-white/5 border-b border-white/10">
                <div className="font-serif text-purple-200 text-lg">Feature</div>
                <div className="text-center font-serif text-gray-300 text-lg">Free</div>
                <div className="text-center font-serif text-yellow-200 text-lg flex items-center justify-center gap-2">
                  <Crown size={18} />
                  Premium
                </div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-white/10">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="grid grid-cols-3 gap-4 p-4 hover:bg-white/5 transition-colors duration-300 animate-fade-in"
                    style={{ animationDelay: `${1 + index * 0.1}s` }}
                  >
                    <div className="font-serif text-purple-100 flex items-center">
                      {feature.name}
                    </div>
                    
                    {/* Free Column */}
                    <div className="text-center flex items-center justify-center">
                      {feature.isPremiumBool ? (
                        typeof feature.free === 'boolean' ? (
                          feature.free ? (
                            <Check size={18} className="text-green-400" />
                          ) : (
                            <X size={18} className="text-red-400" />
                          )
                        ) : (
                          <span className="text-gray-300 font-serif text-sm">{feature.free}</span>
                        )
                      ) : (
                        <span className="text-gray-300 font-serif text-sm">{feature.free}</span>
                      )}
                    </div>
                    
                    {/* Premium Column */}
                    <div className="text-center flex items-center justify-center">
                      {feature.isPremiumBool ? (
                        typeof feature.premium === 'boolean' ? (
                          feature.premium ? (
                            <div className="flex items-center gap-1">
                              <Check size={18} className="text-yellow-400" />
                              <Sparkles size={12} className="text-yellow-300/60 animate-pulse" />
                            </div>
                          ) : (
                            <X size={18} className="text-red-400" />
                          )
                        ) : (
                          <span className="text-yellow-200 font-serif text-sm">{feature.premium}</span>
                        )
                      ) : (
                        <span className="text-yellow-200 font-serif text-sm">{feature.premium}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '1.5s' }}>
            <button className="group relative px-12 py-6 bg-gradient-to-r from-purple-500/40 to-pink-500/40 backdrop-blur-sm border border-purple-300/40 rounded-full text-purple-100 font-serif text-xl hover:from-purple-500/50 hover:to-pink-500/50 hover:border-purple-300/60 transition-all duration-300 hover:scale-105 glow-button mb-6">
              <span className="relative z-10 flex items-center gap-3">
                <Crown size={24} />
                Upgrade to Premium
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-gentle"></div>
            </button>
            
            <p className="text-purple-300/70 font-serif italic">
              Cancel Anytime. No Strings Attached.
            </p>
          </div>

          {/* Footer Message */}
          <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '1.8s' }}>
            <p className="text-lg font-cursive text-purple-300/70 italic">
              "Your journey deserves the most beautiful spaces to unfold..."
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

export default Premium;