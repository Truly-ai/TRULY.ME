import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Heart, Send, Sparkles } from 'lucide-react';
import LoginButton from '../components/LoginButton';
import { useAuth } from '../contexts/AuthContext';
import { trulyOriginService, TrulyOriginFeedback, subscribeToFeedback } from '../lib/database';

function TrulyOrigin() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [userMessage, setUserMessage] = useState('');
  const [submissions, setSubmissions] = useState<TrulyOriginFeedback[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load submissions from Supabase
  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const data = await trulyOriginService.getFeedback();
        setSubmissions(data);
      } catch (error) {
        console.error('Error loading feedback:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubmissions();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = subscribeToFeedback((newFeedback) => {
      setSubmissions(prev => [newFeedback, ...prev]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async () => {
    if (!userMessage.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await trulyOriginService.createFeedback({
        user_id: isAuthenticated && user ? user.id : undefined,
        message: userMessage.trim()
      });

      setUserMessage('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-950 via-purple-950 to-pink-950 relative overflow-hidden pt-24">
      {/* Login Button */}
      <div className="absolute top-6 right-6 z-20">
        <LoginButton />
      </div>

      {/* Warm Magical Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/40 via-purple-900/30 to-pink-900/40 animate-gradient-shift"></div>
        
        {/* Heart-shaped Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <Heart 
              key={i}
              size={Math.random() * 6 + 4} 
              className="absolute text-pink-300/20 animate-pulse-gentle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Swirling Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <Star 
              key={i}
              size={Math.random() * 8 + 6} 
              className="absolute text-yellow-300/25 animate-pulse-slow"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Gentle Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <Sparkles 
              key={i}
              size={Math.random() * 4 + 3} 
              className="absolute text-white/15 animate-pulse-gentle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${3 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Soft Mist */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-pink-400/15 to-transparent animate-mist-1"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-transparent via-purple-400/10 to-transparent animate-mist-2"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto p-8 pb-20">
        
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="relative inline-block mb-8">
            <Star size={80} className="text-pink-300/80 animate-pulse-slow" />
            <div className="absolute inset-0 rounded-full bg-pink-300/20 blur-2xl animate-pulse-gentle"></div>
            
            {/* Orbiting Hearts */}
            <div className="absolute inset-0 animate-spin-slow">
              <Heart size={16} className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-pink-300/60" />
              <Heart size={12} className="absolute top-1/2 -right-6 transform -translate-y-1/2 text-rose-300/60" />
              <Heart size={14} className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-purple-300/60" />
              <Heart size={10} className="absolute top-1/2 -left-6 transform -translate-y-1/2 text-pink-400/60" />
            </div>
          </div>
          
          <h1 className="text-5xl font-cursive text-pink-100 mb-8 glow-text">
            Every beginning has a story
          </h1>
          
          {/* Founder's Story */}
          <div className="bg-gradient-to-br from-rose-500/20 to-pink-500/20 backdrop-blur-sm border border-rose-300/30 rounded-3xl p-8 mb-12 glow-message">
            <div className="flex items-center justify-center mb-6">
              <Heart size={32} className="text-rose-300/80 animate-pulse-gentle" fill="currentColor" />
            </div>
            
            <h2 className="text-2xl font-cursive text-rose-200 mb-6">From Thiransa's Heart</h2>
            
            <div className="space-y-4 text-lg font-serif text-rose-100 leading-relaxed">
              <p>
                TRULY was born from my own journey through the depths of feeling too much in a world that often asks us to feel less. As someone who has navigated anxiety, depression, and the beautiful complexity of being human, I knew there had to be a gentler way.
              </p>
              <p>
                I dreamed of a space where vulnerability is honored, where your emotions are met with compassion rather than solutions, and where technology serves the soul rather than rushing it. TRULY is my love letter to every person who has ever felt alone in their feelings.
              </p>
              <p className="italic text-rose-200/90">
                "In a world that moves too fast, we create spaces that honor the pace of the soul."
              </p>
            </div>
          </div>
        </div>

        {/* Community Section */}
        <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-cursive text-purple-100 mb-4 glow-text">
              What TRULY means to you?
            </h2>
            <p className="text-lg font-serif text-purple-200/80 leading-relaxed">
              Share your heart anonymously — how has TRULY touched your journey?
            </p>
          </div>

          {/* Submission Form */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 mb-12 glow-message">
            <textarea
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="TRULY has meant... / I feel... / This space has helped me... / My heart wants to say..."
              className="w-full h-32 px-6 py-4 bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-2xl text-purple-100 placeholder-purple-300/60 font-serif resize-none focus:outline-none focus:border-purple-300/60 focus:bg-white/15 transition-all duration-300 glow-input"
              disabled={isSubmitting}
            />

            <button
              onClick={handleSubmit}
              disabled={!userMessage.trim() || isSubmitting}
              className="w-full mt-6 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500/30 to-purple-500/30 backdrop-blur-sm border border-pink-300/40 rounded-2xl text-pink-100 font-cursive text-lg hover:from-pink-500/40 hover:to-purple-500/40 hover:border-pink-300/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-button"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-pink-300/30 border-t-pink-300 rounded-full animate-spin"></div>
                  Sharing from the heart...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Share Anonymously
                </>
              )}
            </button>
          </div>

          {/* Submissions Display */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-purple-300/30 border-t-purple-300 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-purple-200 font-serif">Loading community voices...</p>
            </div>
          ) : submissions.length > 0 ? (
            <div>
              <h3 className="text-2xl font-cursive text-purple-100 text-center mb-8 glow-text">
                Voices from our community
              </h3>
              
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {submissions.map((submission, index) => (
                  <div
                    key={submission.id}
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 glow-message animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Heart size={16} className="text-pink-300/60" />
                        <span className="text-sm font-cursive text-purple-300/70">Anonymous Soul</span>
                      </div>
                      <span className="text-xs text-purple-400/60 font-rounded">
                        {getTimeAgo(submission.created_at)}
                      </span>
                    </div>
                    
                    <p className="text-purple-100 font-serif leading-relaxed">
                      {submission.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Star size={48} className="mx-auto mb-4 text-purple-300/40 animate-pulse-gentle" />
              <p className="text-lg font-cursive text-purple-300/70 italic">
                Be the first to share what TRULY means to you...
              </p>
            </div>
          )}
        </div>

        {/* Footer Message */}
        <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '1s' }}>
          <p className="text-lg font-cursive text-pink-300/70 italic">
            "Every story shared here becomes part of our collective healing..."
          </p>
        </div>
      </div>
    </div>
  );
}

export default TrulyOrigin;