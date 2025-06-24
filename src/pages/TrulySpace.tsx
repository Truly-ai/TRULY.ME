import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Heart, BookOpen, Moon } from 'lucide-react';
import LoginButton from '../components/LoginButton';

function TrulySpace() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 relative overflow-hidden pt-24">
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-96px)] p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Sparkles size={64} className="mx-auto mb-6 text-indigo-300/80 animate-pulse-gentle" />
            <h2 className="text-3xl font-serif text-purple-100 mb-4">Your Sanctuary for Reflection</h2>
            <p className="text-lg text-purple-200/80 font-rounded">Choose your path to inner discovery</p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Heartprint Record */}
            <button 
              onClick={() => navigate('/heartprint-record')}
              className="group relative p-8 bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm border border-pink-300/30 rounded-3xl hover:from-pink-500/30 hover:to-purple-500/30 hover:border-pink-300/50 transition-all duration-300 hover:scale-105 glow-button text-left"
            >
              <Heart size={48} className="mb-6 text-pink-300/80 group-hover:text-pink-300 transition-colors duration-300" />
              <h3 className="text-2xl font-serif text-pink-200 mb-4">Heartprint Record</h3>
              <p className="text-pink-300/70 font-rounded leading-relaxed">
                Track your emotional journey with gentle daily reflections. Create a beautiful timeline of your inner world.
              </p>
              <div className="absolute top-4 right-4">
                <div className="w-3 h-3 bg-pink-400/60 rounded-full animate-pulse"></div>
              </div>
            </button>

            {/* Rituals & Realms */}
            <button 
              onClick={() => navigate('/rituals-realms')}
              className="group relative p-8 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-sm border border-purple-300/30 rounded-3xl hover:from-purple-500/30 hover:to-indigo-500/30 hover:border-purple-300/50 transition-all duration-300 hover:scale-105 glow-button text-left"
            >
              <Moon size={48} className="mb-6 text-purple-300/80 group-hover:text-purple-300 transition-colors duration-300" />
              <h3 className="text-2xl font-serif text-purple-200 mb-4">Rituals & Realms</h3>
              <p className="text-purple-300/70 font-rounded leading-relaxed">
                Enter enchanted spaces for healing rituals, peaceful moments, and magical self-discovery experiences.
              </p>
              <div className="absolute top-4 right-4">
                <div className="w-3 h-3 bg-purple-400/60 rounded-full animate-pulse"></div>
              </div>
            </button>

            {/* Sacred Journal */}
            <button 
              onClick={() => navigate('/sacred-journal')}
              className="group relative p-8 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 backdrop-blur-sm border border-indigo-300/30 rounded-3xl hover:from-indigo-500/30 hover:to-violet-500/30 hover:border-indigo-300/50 transition-all duration-300 hover:scale-105 glow-button text-left"
            >
              <BookOpen size={48} className="mb-6 text-indigo-300/80 group-hover:text-indigo-300 transition-colors duration-300" />
              <h3 className="text-2xl font-serif text-indigo-200 mb-4">Sacred Journal</h3>
              <p className="text-indigo-300/70 font-rounded leading-relaxed">
                A private space for deeper reflections and meaningful conversations with yourself.
              </p>
              <div className="absolute top-4 right-4">
                <div className="w-3 h-3 bg-indigo-400/60 rounded-full animate-pulse"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrulySpace;