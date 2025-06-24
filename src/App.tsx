import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Moon, Star, Carrot as Mirror, Feather, Zap, Users, X, GraduationCap } from 'lucide-react';
import LoginButton from './components/LoginButton';
import NotificationBell from './components/NotificationBell';
import { useAuth } from './contexts/AuthContext';

type Scene = 'poetry' | 'discovery' | 'loading' | 'badge' | 'signup' | 'home';

interface Badge {
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
}

const badges: Record<string, Badge> = {
  dreamer: {
    name: "The Dreamer",
    description: "You see possibilities where others see obstacles. Your imagination is your superpower.",
    icon: "🌙",
    color: "text-blue-300",
    gradient: "from-blue-500/30 to-purple-500/30"
  },
  healer: {
    name: "The Healer",
    description: "You carry deep empathy and help others find peace. Your presence is medicine.",
    icon: "🌸",
    color: "text-pink-300",
    gradient: "from-pink-500/30 to-rose-500/30"
  },
  warrior: {
    name: "The Warrior",
    description: "You face challenges with courage and inspire others to be brave. Your strength is quiet but powerful.",
    icon: "⚡",
    color: "text-yellow-300",
    gradient: "from-yellow-500/30 to-orange-500/30"
  },
  muse: {
    name: "The Muse",
    description: "You inspire creativity and beauty in the world. Your soul speaks in colors and melodies.",
    icon: "✨",
    color: "text-purple-300",
    gradient: "from-purple-500/30 to-indigo-500/30"
  },
  sage: {
    name: "The Sage",
    description: "You seek wisdom and understanding. Your questions lead to profound discoveries.",
    icon: "🔮",
    color: "text-indigo-300",
    gradient: "from-indigo-500/30 to-violet-500/30"
  },
  guardian: {
    name: "The Guardian",
    description: "You protect and nurture what matters most. Your love creates safe spaces for growth.",
    icon: "🛡️",
    color: "text-green-300",
    gradient: "from-green-500/30 to-emerald-500/30"
  }
};

function App() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading, login } = useAuth();
  const [fadeIn, setFadeIn] = useState(false);
  const [currentScene, setCurrentScene] = useState<Scene>('poetry');
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(['', '', '']);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showTransition, setShowTransition] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userBadge, setUserBadge] = useState<Badge | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isJudgeFlow, setIsJudgeFlow] = useState(false);
  const [isJudgeLoading, setIsJudgeLoading] = useState(false);

  const poetryLines = [
    "You are not late.",
    "You are not lost.",
    "You are becoming.",
    "",
    "Welcome to TRULY —",
    "the place where your soul has room to speak."
  ];

  const questions = [
    "What emotion has been quietly living inside you lately?",
    "What dream or vision have you been secretly holding onto — even if it feels impossible?",
    "If your future self whispered one thing to you right now… what do you hope she'd say?"
  ];

  const questionIcons = [Mirror, Feather, Zap];

  // Initial fade in
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeIn(true);
    }, 100);

    return () => clearTimeout(fadeTimer);
  }, []);

  // Handle poetry scene progression and user flow
  useEffect(() => {
    if (!fadeIn) return;

    // Start text animation after fade in
    const startTextTimer = setTimeout(() => {
      setCurrentLineIndex(0);
    }, 1000);

    return () => clearTimeout(startTextTimer);
  }, [fadeIn]);

  useEffect(() => {
    if (currentScene !== 'poetry' || currentLineIndex < 0 || currentLineIndex >= poetryLines.length) return;

    const nextLineTimer = setTimeout(() => {
      if (currentLineIndex < poetryLines.length - 1) {
        setCurrentLineIndex(currentLineIndex + 1);
      } else {
        // All lines shown, determine next step based on auth status
        setTimeout(() => {
          if (isLoading) {
            // Wait for auth to load
            return;
          }
          
          if (isAuthenticated) {
            // Existing user - go directly to home with sanctuary message
            setCurrentScene('home');
            setTimeout(() => {
              navigate('/home');
            }, 1500);
          } else {
            // Not authenticated - show login prompt
            setShowLoginPrompt(true);
          }
        }, 2000);
      }
    }, poetryLines[currentLineIndex] === "" ? 800 : 2500);

    return () => clearTimeout(nextLineTimer);
  }, [currentLineIndex, poetryLines, currentScene, isAuthenticated, isLoading, navigate]);

  // Handle authentication changes
  useEffect(() => {
    if (isAuthenticated && (showLoginPrompt || isJudgeFlow)) {
      // User just logged in
      if (isJudgeFlow) {
        // Judge flow - always go through discovery
        setShowLoginPrompt(false);
        setCurrentScene('discovery');
        setIsTyping(true);
      } else {
        // Regular user flow - check if they completed onboarding
        const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${user?.id}`);
        
        if (hasCompletedOnboarding) {
          // Returning user - go directly to home with sanctuary message
          setShowLoginPrompt(false);
          setCurrentScene('home');
          setTimeout(() => {
            navigate('/home');
          }, 1500);
        } else {
          // New user - start discovery flow
          setShowLoginPrompt(false);
          setCurrentScene('discovery');
          setIsTyping(true);
        }
      }
    }
  }, [isAuthenticated, user, showLoginPrompt, isJudgeFlow, navigate]);

  // Typewriter effect for questions
  useEffect(() => {
    if (currentScene !== 'discovery' || !isTyping) return;

    const question = questions[currentQuestion];
    let index = 0;
    setTypewriterText('');

    const typeInterval = setInterval(() => {
      if (index < question.length) {
        setTypewriterText(question.substring(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [currentQuestion, currentScene, isTyping]);

  const startDiscoveryFlow = () => {
    setShowLoginPrompt(false);
    setCurrentScene('discovery');
    setIsTyping(true);
    setIsJudgeFlow(false);
  };

  const startJudgeFlow = async () => {
    setIsJudgeLoading(true);
    
    try {
      // Log in as judge
      await login('judgeexample@gmail.com', 'Judge@23');
      setIsJudgeFlow(true);
      // The useEffect will handle the rest of the flow
    } catch (error) {
      console.error('Judge login failed:', error);
      setIsJudgeLoading(false);
    }
  };

  const generateBadge = (answers: string[]): Badge => {
    const combinedText = answers.join(' ').toLowerCase();
    
    // Simple keyword-based badge assignment
    if (combinedText.includes('dream') || combinedText.includes('hope') || combinedText.includes('imagine')) {
      return badges.dreamer;
    } else if (combinedText.includes('heal') || combinedText.includes('peace') || combinedText.includes('calm')) {
      return badges.healer;
    } else if (combinedText.includes('strong') || combinedText.includes('brave') || combinedText.includes('fight')) {
      return badges.warrior;
    } else if (combinedText.includes('create') || combinedText.includes('art') || combinedText.includes('beauty')) {
      return badges.muse;
    } else if (combinedText.includes('learn') || combinedText.includes('understand') || combinedText.includes('wisdom')) {
      return badges.sage;
    } else {
      return badges.guardian;
    }
  };

  const handleAnswerSubmit = () => {
    if (!currentAnswer.trim()) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = currentAnswer;
    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (currentQuestion < questions.length - 1) {
      // Show transition animation
      setShowTransition(true);
      
      setTimeout(() => {
        setShowTransition(false);
        setCurrentQuestion(currentQuestion + 1);
        setIsTyping(true);
      }, 2000);
    } else {
      // Final question answered - show loading then badge
      setShowTransition(true);
      
      setTimeout(() => {
        setShowTransition(false);
        setCurrentScene('loading');
        
        // Generate badge after loading
        setTimeout(() => {
          const badge = generateBadge(newAnswers);
          setUserBadge(badge);
          setCurrentScene('badge');
        }, 3000);
      }, 3000);
    }
  };

  const handleBadgeComplete = () => {
    if (user) {
      // Save completion status and badge
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
      localStorage.setItem(`user_badge_${user.id}`, JSON.stringify(userBadge));
    }
    
    // Go to home with sanctuary message
    setCurrentScene('home');
    setTimeout(() => {
      navigate('/home');
    }, 1500);
  };

  const renderLine = (line: string, index: number) => {
    const isVisible = index <= currentLineIndex;
    
    if (line === "") {
      return <div key={index} className="h-6"></div>;
    }

    if (line.includes("TRULY")) {
      return (
        <div 
          key={index} 
          className={`text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="text-2xl md:text-3xl text-purple-200">Welcome to </span>
          <span className="text-3xl md:text-4xl font-serif text-pink-300 glow-text">TRULY</span>
          <span className="text-2xl md:text-3xl text-purple-200"> —</span>
        </div>
      );
    }

    if (line.includes("becoming")) {
      return (
        <div 
          key={index} 
          className={`text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="text-xl md:text-2xl text-purple-200">You are </span>
          <span className="text-2xl md:text-3xl font-cursive text-pink-300 glow-text">becoming</span>
          <span className="text-xl md:text-2xl text-purple-200">.</span>
        </div>
      );
    }

    return (
      <div 
        key={index} 
        className={`text-center text-xl md:text-2xl text-purple-100 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {line}
      </div>
    );
  };

  // DEBUG: Force badge to show on all pages with full opacity
  const showBoltBadge = true;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        {/* Top Navigation - Only show on specific scenes */}
        {(currentScene === 'discovery' || currentScene === 'loading' || currentScene === 'badge') && (
          <div className="absolute top-6 right-6 z-20 flex items-center gap-4">
            <NotificationBell />
            <LoginButton />
          </div>
        )}

        {/* Bolt Badge - DEBUG: Now shows on all pages with full opacity */}
        {showBoltBadge && (currentScene === 'poetry' || showLoginPrompt) && (
          <button
            onClick={() => window.open('https://bolt.new', '_blank')}
            className="fixed bottom-6 right-6 z-30 opacity-100 hover:opacity-100 transition-opacity duration-300 hover:scale-105 transform transition-transform duration-300"
            title="Powered by Bolt.new"
          >
            <img 
              src="/bolt-badge.png.png" 
              alt="Powered by Bolt.new" 
              className="w-[90px] h-auto"
            />
          </button>
        )}

        {/* Dynamic Background */}
        <div className={`absolute inset-0 transition-all duration-2000 ${
          currentScene === 'discovery' 
            ? 'bg-gradient-to-br from-purple-800/40 via-blue-800/30 to-indigo-900/40' 
            : 'bg-gradient-to-br from-purple-800/30 via-indigo-800/30 to-blue-900/30'
        } animate-gradient-shift`}></div>
        
        {/* Mist Overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-mist-1"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-transparent via-purple-300/5 to-transparent animate-mist-2"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-pink-300/3 to-transparent animate-mist-3"></div>
        </div>

        {/* Floating Stars for Discovery Mode */}
        {currentScene === 'discovery' && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <Star 
                key={i}
                size={Math.random() * 8 + 8} 
                className="absolute text-purple-300/20 animate-pulse-gentle"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className={`relative z-10 flex flex-col items-center px-8 transition-all duration-2000 ${
          fadeIn ? 'opacity-100' : 'opacity-0'
        } ${
          currentScene === 'discovery' 
            ? 'justify-center py-16' 
            : ''
        }`}>
          
          {/* Poetry Scene */}
          {currentScene === 'poetry' && (
            <div className="w-full flex flex-col items-center justify-center">
              {/* Scattered Celestial Icons */}
              <div className="absolute inset-0 pointer-events-none">
                <Sparkles size={20} className="absolute top-1/4 left-1/4 text-pink-300/30 animate-pulse-gentle" style={{animationDelay: '0s'}} />
                <Star size={16} className="absolute top-1/3 right-1/4 text-purple-300/40 animate-pulse-slow" style={{animationDelay: '1s'}} />
                <Moon size={18} className="absolute top-1/2 left-1/6 text-indigo-300/35 animate-pulse-gentle" style={{animationDelay: '2s'}} />
                <Sparkles size={14} className="absolute bottom-1/3 right-1/6 text-pink-300/25 animate-pulse-slow" style={{animationDelay: '0.5s'}} />
                <Star size={22} className="absolute top-1/6 right-1/3 text-purple-300/30 animate-pulse-gentle" style={{animationDelay: '1.5s'}} />
                <Sparkles size={18} className="absolute bottom-1/4 left-1/3 text-indigo-300/40 animate-pulse-slow" style={{animationDelay: '2.5s'}} />
                <Moon size={16} className="absolute top-2/3 right-1/5 text-pink-300/35 animate-pulse-gentle" style={{animationDelay: '3s'}} />
                <Star size={20} className="absolute bottom-1/6 right-2/5 text-purple-300/25 animate-pulse-slow" style={{animationDelay: '0.8s'}} />
              </div>

              {/* Poetry Text */}
              <div className="max-w-2xl mx-auto space-y-4 mb-16 font-serif">
                {poetryLines.map((line, index) => renderLine(line, index))}
              </div>
            </div>
          )}

          {/* Login Prompt Modal */}
          {showLoginPrompt && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
              
              {/* Modal */}
              <div className="relative w-full max-w-md bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-lg border border-purple-300/30 rounded-3xl p-8 shadow-2xl animate-fade-in">
                {/* Header */}
                <div className="text-center mb-8">
                  <Sparkles size={48} className="mx-auto mb-4 text-purple-300/80 animate-pulse-gentle" />
                  <h2 className="text-2xl font-serif text-purple-100 mb-4 glow-text">
                    Ready to begin?
                  </h2>
                  <p className="text-lg font-serif text-purple-200/80 leading-relaxed">
                    Choose your path into TRULY
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={startDiscoveryFlow}
                    className="w-full py-4 bg-gradient-to-r from-purple-500/40 to-pink-500/40 backdrop-blur-sm border border-purple-300/40 rounded-2xl text-purple-100 font-cursive text-lg hover:from-purple-500/50 hover:to-pink-500/50 hover:border-purple-300/60 transition-all duration-300 glow-button"
                  >
                    I'm new here, let's discover ✨
                  </button>
                  
                  <LoginButton />
                  
                  <button
                    onClick={startJudgeFlow}
                    disabled={isJudgeLoading}
                    className="w-full flex items-center justify-center gap-3 py-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm border border-blue-300/30 rounded-2xl text-blue-200 font-serif text-sm hover:from-blue-500/30 hover:to-indigo-500/30 hover:border-blue-300/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isJudgeLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-blue-300/30 border-t-blue-300 rounded-full animate-spin"></div>
                        Accessing...
                      </>
                    ) : (
                      <>
                        <GraduationCap size={16} />
                        Judge Guest Access 🎓
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => navigate('/tell-me-more')}
                    className="w-full text-purple-300/80 font-serif text-sm hover:text-purple-200 transition-colors duration-300 underline decoration-purple-400/50 hover:decoration-purple-300/80 underline-offset-4"
                  >
                    Tell me more first
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Discovery Scene */}
          {currentScene === 'discovery' && (
            <div className="w-full flex flex-col items-center">
              
              {/* Transition Animation */}
              {showTransition && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {currentQuestion < questions.length - 1 ? (
                      // Sparkles floating upward
                      <div className="flex space-x-4">
                        {[...Array(8)].map((_, i) => (
                          <Sparkles 
                            key={i}
                            size={16 + Math.random() * 8} 
                            className="text-pink-300/60 animate-float-up"
                            style={{
                              animationDelay: `${i * 0.2}s`,
                              animationDuration: '2s'
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      // Final swirl animation
                      <div className="relative w-32 h-32">
                        <div className="absolute inset-0 rounded-full border-2 border-pink-300/30 animate-spin-slow"></div>
                        <div className="absolute inset-2 rounded-full border-2 border-purple-300/40 animate-spin-reverse"></div>
                        <div className="absolute inset-4 rounded-full border-2 border-indigo-300/50 animate-spin-slow"></div>
                        <Sparkles size={24} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-300/80 animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Question Content */}
              {!showTransition && (
                <div className="max-w-2xl mx-auto text-center space-y-8 w-full">
                  {/* Question Icon */}
                  <div className="flex justify-center mb-8">
                    {React.createElement(questionIcons[currentQuestion], {
                      size: 48,
                      className: "text-purple-300/80 animate-pulse-gentle"
                    })}
                  </div>

                  {/* Question Number */}
                  <div className="text-purple-300/60 font-cursive text-lg mb-4">
                    Question {currentQuestion + 1}
                  </div>

                  {/* Question Text with Typewriter Effect */}
                  <div className="min-h-[120px] flex items-center justify-center">
                    <h2 className="text-2xl md:text-3xl text-purple-100 font-serif leading-relaxed">
                      {typewriterText}
                      {isTyping && <span className="animate-pulse">|</span>}
                    </h2>
                  </div>

                  {/* Input Box */}
                  {!isTyping && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="relative">
                        <textarea
                          value={currentAnswer}
                          onChange={(e) => setCurrentAnswer(e.target.value)}
                          placeholder="Let your heart speak..."
                          className="w-full h-32 px-6 py-4 bg-white/5 backdrop-blur-sm border border-purple-300/30 rounded-2xl text-purple-100 placeholder-purple-300/50 font-serif text-lg resize-none focus:outline-none focus:border-purple-300/60 focus:bg-white/10 transition-all duration-300 glow-input"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) {
                              handleAnswerSubmit();
                            }
                          }}
                        />
                        <div className="absolute -inset-1 bg-gradient-to-r from-pink-300/10 to-purple-300/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10"></div>
                      </div>

                      <button
                        onClick={handleAnswerSubmit}
                        disabled={!currentAnswer.trim()}
                        className="px-8 py-3 bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-sm border border-purple-300/40 rounded-full text-purple-100 font-serif hover:from-purple-500/40 hover:to-pink-500/40 hover:border-purple-300/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-button"
                      >
                        {currentQuestion < questions.length - 1 ? 'Continue' : 'Complete Discovery'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Loading Scene */}
          {currentScene === 'loading' && (
            <div className="w-full flex flex-col items-center justify-center animate-fade-in">
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 border-4 border-purple-300/30 border-t-purple-300 rounded-full animate-spin mx-auto"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={32} className="text-pink-300/80 animate-pulse" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-cursive text-purple-100 mb-4 glow-text">
                  Discovering your essence...
                </h2>
                <p className="text-lg font-serif text-purple-200/80">
                  The universe is weaving your personal badge
                </p>
              </div>
            </div>
          )}

          {/* Badge Scene */}
          {currentScene === 'badge' && userBadge && (
            <div className="w-full flex flex-col items-center justify-center animate-fade-in">
              <div className="max-w-2xl mx-auto text-center">
                {/* Badge Display */}
                <div className={`relative p-8 bg-gradient-to-br ${userBadge.gradient} backdrop-blur-sm border border-white/30 rounded-3xl mb-8 glow-message`}>
                  {/* Floating Sparkles */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                    {[...Array(12)].map((_, i) => (
                      <Sparkles 
                        key={i}
                        size={Math.random() * 6 + 4} 
                        className="absolute text-white/30 animate-pulse-gentle"
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
                    <div className="text-6xl mb-6 animate-pulse-gentle">{userBadge.icon}</div>
                    <h2 className={`text-3xl font-cursive ${userBadge.color} mb-4 glow-text`}>
                      {userBadge.name}
                    </h2>
                    <p className="text-lg font-serif text-white/90 leading-relaxed">
                      {userBadge.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleBadgeComplete}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-sm border border-purple-300/40 rounded-full text-purple-100 font-cursive text-lg hover:from-purple-500/40 hover:to-pink-500/40 hover:border-purple-300/60 transition-all duration-300 hover:scale-105 glow-button"
                >
                  Enter Your Sanctuary
                </button>
              </div>
            </div>
          )}

          {/* Home Transition Scene */}
          {currentScene === 'home' && (
            <div className="w-full flex flex-col items-center justify-center animate-fade-in">
              <div className="text-center">
                <Sparkles size={64} className="mx-auto mb-6 text-purple-300/80 animate-pulse-gentle" />
                <h2 className="text-3xl font-cursive text-purple-100 mb-4 glow-text">
                  Taking you to your sanctuary...
                </h2>
                <p className="text-lg font-serif text-purple-200/80">
                  Welcome home
                </p>
              </div>
            </div>
          )}
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

export default App;