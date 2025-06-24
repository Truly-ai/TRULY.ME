import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Star, Send } from 'lucide-react';
import LoginButton from '../components/LoginButton';

interface Lantern {
  id: string;
  text: string;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  color: string;
  animationPhase: 'rising' | 'floating';
}

function FloatingLantern() {
  const navigate = useNavigate();
  const [wishText, setWishText] = useState('');
  const [lanterns, setLanterns] = useState<Lantern[]>([]);
  const [isReleasing, setIsReleasing] = useState(false);

  const releaseLantern = () => {
    if (!wishText.trim() || isReleasing) return;

    setIsReleasing(true);

    const newLantern: Lantern = {
      id: Date.now().toString(),
      text: wishText,
      x: 45 + Math.random() * 10, // Center with slight variation
      y: 95, // Start at bottom
      opacity: 1,
      scale: 1.2, // Start larger
      color: 'from-orange-400/60 to-yellow-500/60',
      animationPhase: 'rising'
    };

    setLanterns(prev => [...prev, newLantern]);
    setWishText('');

    // Animate lantern rising
    setTimeout(() => {
      setLanterns(prev => prev.map(lantern => 
        lantern.id === newLantern.id 
          ? { 
              ...lantern, 
              y: 15 + Math.random() * 10, // Rise to top area
              scale: 0.6, // Shrink for perspective
              x: lantern.x + (Math.random() - 0.5) * 15, // Add some drift
              animationPhase: 'floating'
            }
          : lantern
      ));
    }, 100);

    // Complete the animation
    setTimeout(() => {
      setIsReleasing(false);
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-orange-950 relative overflow-hidden">
      {/* Login Button */}
      <div className="absolute top-6 right-6 z-20">
        <LoginButton />
      </div>

      {/* Animated Night Sky */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-orange-900/60 animate-gradient-shift"></div>
        
        {/* Twinkling Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(100)].map((_, i) => (
            <Star 
              key={i}
              size={Math.random() * 2 + 1} 
              className="absolute text-white/30 animate-pulse-gentle"
              style={{
                top: `${Math.random() * 70}%`, // Keep stars in upper portion
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Floating Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <Sparkles 
              key={i}
              size={Math.random() * 8 + 4} 
              className="absolute text-yellow-300/20 animate-pulse-slow"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <button 
          onClick={() => navigate('/rituals-realms')}
          className="flex items-center gap-3 text-purple-200 hover:text-purple-100 transition-colors duration-300 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-serif">Back to Rituals & Realms</span>
        </button>

        <h1 className="text-2xl font-cursive text-yellow-200 glow-text">Floating Lantern Ritual</h1>
      </div>

      {/* Floating Lanterns */}
      <div className="absolute inset-0 pointer-events-none z-5">
        {lanterns.map((lantern) => (
          <div
            key={lantern.id}
            className={`absolute transition-all ${
              lantern.animationPhase === 'rising' 
                ? 'duration-[6000ms] ease-out' 
                : 'duration-[3000ms] ease-in-out'
            }`}
            style={{
              left: `${lantern.x}%`,
              top: `${lantern.y}%`,
              opacity: lantern.opacity,
              transform: `translate(-50%, -50%) scale(${lantern.scale})`
            }}
          >
            {/* Lantern Glow Aura */}
            <div className="absolute inset-0 w-32 h-40 bg-gradient-to-b from-orange-400/40 to-yellow-500/40 rounded-2xl blur-2xl animate-pulse-slow"></div>
            
            {/* Enhanced Glow Ring */}
            <div className="absolute inset-0 w-28 h-36 bg-gradient-to-b from-yellow-300/30 to-orange-400/30 rounded-xl blur-xl animate-pulse-gentle" style={{animationDelay: '0.5s'}}></div>
            
            {/* Main Lantern Image */}
            <div className="relative">
              <img 
                src="/ChatGPT Image Jun 23, 2025, 05_59_57 PM.png" 
                alt="Floating lantern" 
                className={`w-24 h-32 object-contain ${
                  lantern.animationPhase === 'floating' ? 'animate-float-gentle' : ''
                }`}
                style={{
                  filter: 'drop-shadow(0 0 15px rgba(255, 193, 7, 0.6)) drop-shadow(0 0 30px rgba(255, 152, 0, 0.4)) brightness(1.1)',
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
              
              {/* Inner Magical Glow */}
              <div className="absolute inset-4 bg-yellow-300/20 rounded-xl animate-pulse-gentle blur-sm"></div>
              
              {/* Wish Text (visible on hover) */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap max-w-40 truncate pointer-events-auto">
                {lantern.text}
              </div>
            </div>

            {/* Floating Light Particles around Lantern */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-300/60 rounded-full animate-pulse-gentle"
                  style={{
                    top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 25}px`,
                    left: `${20 + Math.cos(i * 60 * Math.PI / 180) * 25}px`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: `${2 + Math.random() * 1}s`
                  }}
                />
              ))}
            </div>

            {/* Gentle Flicker Effect */}
            {lantern.animationPhase === 'floating' && (
              <div className="absolute inset-0 bg-yellow-200/10 rounded-xl animate-pulse opacity-50" style={{animationDuration: '4s'}}></div>
            )}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-88px)] p-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Ritual Introduction */}
          <div className="mb-12 animate-fade-in">
            <div className="relative inline-block mb-8">
              <div className="w-32 h-40 relative">
                {/* Static Display Lantern */}
                <img 
                  src="/ChatGPT Image Jun 23, 2025, 05_59_57 PM.png" 
                  alt="Lantern" 
                  className="w-full h-full object-contain animate-pulse-gentle"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(255, 193, 7, 0.5)) drop-shadow(0 0 40px rgba(255, 152, 0, 0.3))'
                  }}
                />
                
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-orange-400/30 to-yellow-500/30 rounded-2xl blur-xl animate-pulse-slow"></div>
                
                {/* Floating sparkles around the display lantern */}
                <div className="absolute inset-0">
                  {[...Array(8)].map((_, i) => (
                    <Sparkles
                      key={i}
                      size={6}
                      className="absolute text-yellow-300/60 animate-pulse-gentle"
                      style={{
                        top: `${10 + Math.random() * 80}%`,
                        left: `${-20 + Math.random() * 140}%`,
                        animationDelay: `${i * 0.3}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <h2 className="text-4xl font-cursive text-yellow-200 mb-6 glow-text">
              Release Your Wishes to the Universe
            </h2>
            <p className="text-xl font-serif text-orange-200/80 leading-relaxed mb-8">
              Write your deepest wish, worry, or intention. Watch as it transforms into a glowing lantern that carries your message to the stars.
            </p>
          </div>

          {/* Wish Input */}
          <div className="bg-white/10 backdrop-blur-sm border border-yellow-300/30 rounded-3xl p-8 mb-8 glow-message animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <label className="block text-lg font-serif text-yellow-200 mb-4">
              What do you wish to release or manifest?
            </label>
            
            <textarea
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              placeholder="Let your heart speak... What needs to be carried away by the wind?"
              className="w-full h-32 px-6 py-4 bg-white/10 backdrop-blur-sm border border-yellow-300/20 rounded-2xl text-yellow-100 placeholder-yellow-300/60 font-serif resize-none focus:outline-none focus:border-yellow-300/50 focus:bg-white/15 transition-all duration-300 glow-input"
              disabled={isReleasing}
            />

            <button
              onClick={releaseLantern}
              disabled={!wishText.trim() || isReleasing}
              className="w-full mt-6 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 backdrop-blur-sm border border-yellow-300/40 rounded-2xl text-yellow-100 font-cursive text-lg hover:from-yellow-500/40 hover:to-orange-500/40 hover:border-yellow-300/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-button"
            >
              {isReleasing ? (
                <>
                  <div className="w-5 h-5 border-2 border-yellow-300/30 border-t-yellow-300 rounded-full animate-spin"></div>
                  Releasing to the Stars...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Release Your Lantern
                </>
              )}
            </button>
          </div>

          {/* Gentle Instructions */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <p className="text-lg font-cursive text-yellow-300/70 italic">
              "Watch your lantern carry your intention into the infinite night sky..."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloatingLantern;