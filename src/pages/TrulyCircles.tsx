import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Heart, Moon, Star, Sparkles, Send, X, Volume2, VolumeX, Check } from 'lucide-react';
import LoginButton from '../components/LoginButton';
import { useAuth } from '../contexts/AuthContext';
import { trulyCirclesService, TrulyCircleMessage, subscribeToCircleMessages } from '../lib/database';

interface Circle {
  id: string;
  name: string;
  description: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  ambientEffect: string;
  currentSouls: number;
}

const circles: Circle[] = [
  {
    id: 'gentle-hope',
    name: 'Gentle Hope',
    description: 'For hearts that dare to dream again, even when the world feels heavy. Share your quiet hopes and tender wishes.',
    color: 'text-green-300',
    bgGradient: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-300/30',
    icon: Sparkles,
    ambientEffect: 'hope',
    currentSouls: 8
  },
  {
    id: 'quiet-joy',
    name: 'Quiet Joy',
    description: 'Celebrate the small moments that make your heart flutter. A space for gentle happiness and peaceful contentment.',
    color: 'text-yellow-300',
    bgGradient: 'from-yellow-500/20 to-orange-500/20',
    borderColor: 'border-yellow-300/30',
    icon: Heart,
    ambientEffect: 'joy',
    currentSouls: 12
  },
  {
    id: 'soft-healing',
    name: 'Soft Healing',
    description: 'For souls in gentle recovery. Share your healing journey with others who understand the tender process of mending.',
    color: 'text-pink-300',
    bgGradient: 'from-pink-500/20 to-rose-500/20',
    borderColor: 'border-pink-300/30',
    icon: Heart,
    ambientEffect: 'healing',
    currentSouls: 15
  },
  {
    id: 'lunar-reflection',
    name: 'Lunar Reflection',
    description: 'Under the moon\'s gentle gaze, explore your deeper thoughts and midnight musings. A space for contemplation.',
    color: 'text-blue-300',
    bgGradient: 'from-blue-500/20 to-indigo-500/20',
    borderColor: 'border-blue-300/30',
    icon: Moon,
    ambientEffect: 'lunar',
    currentSouls: 6
  },
  {
    id: 'brave-becoming',
    name: 'Brave Becoming',
    description: 'For those courageously stepping into their authentic selves. Share your transformation and growth stories.',
    color: 'text-purple-300',
    bgGradient: 'from-purple-500/20 to-indigo-500/20',
    borderColor: 'border-purple-300/30',
    icon: Star,
    ambientEffect: 'becoming',
    currentSouls: 9
  }
];

const anonymousNames = [
  'Gentle Soul', 'Quiet Heart', 'Tender Spirit', 'Soft Light', 'Kind Whisper',
  'Peaceful Mind', 'Warm Glow', 'Serene Voice', 'Calm Presence', 'Sweet Echo',
  'Loving Energy', 'Pure Essence', 'Bright Spark', 'Gentle Breeze', 'Soft Moon'
];

function TrulyCircles() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [showCircleModal, setShowCircleModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [messages, setMessages] = useState<TrulyCircleMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userDisplayName] = useState(() => 
    anonymousNames[Math.floor(Math.random() * anonymousNames.length)]
  );
  const [joinedCircles, setJoinedCircles] = useState<string[]>([]);
  const [isJoining, setIsJoining] = useState(false);

  // Load user's joined circles on component mount
  useEffect(() => {
    const loadJoinedCircles = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const memberships = await trulyCirclesService.getUserMemberships(user.id);
        setJoinedCircles(memberships);
      } catch (error) {
        console.error('Error loading joined circles:', error);
      }
    };

    loadJoinedCircles();
  }, [isAuthenticated, user]);

  // Load messages when a circle is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedCircle || !showChatModal) return;

      setIsLoading(true);
      try {
        const data = await trulyCirclesService.getMessages(selectedCircle.id);
        setMessages(data);
      } catch (error) {
        console.error('Error loading circle messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [selectedCircle, showChatModal]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!selectedCircle || !showChatModal) return;

    const subscription = subscribeToCircleMessages(selectedCircle.id, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedCircle, showChatModal]);

  const handleCircleClick = async (circle: Circle) => {
    if (!user) return;

    setSelectedCircle(circle);
    
    // Check if user has already joined this circle
    const isJoined = joinedCircles.includes(circle.id);
    
    if (isJoined) {
      // User has already joined, go directly to chat
      setShowChatModal(true);
      
      if (!isMuted) {
        console.log('🔔 Soft chime sound effect');
      }
    } else {
      // User hasn't joined, show the join modal
      setShowCircleModal(true);
    }
  };

  const joinCircle = async () => {
    if (!selectedCircle || !user || isJoining) return;

    setIsJoining(true);
    
    try {
      await trulyCirclesService.joinCircle(user.id, selectedCircle.id);
      
      // Update local state
      setJoinedCircles(prev => [...prev, selectedCircle.id]);
      
      // Close join modal and open chat
      setShowCircleModal(false);
      setShowChatModal(true);
      
      if (!isMuted) {
        console.log('🔔 Soft chime sound effect');
      }
    } catch (error) {
      console.error('Error joining circle:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedCircle || !user) return;

    try {
      await trulyCirclesService.createMessage({
        user_id: user.id,
        circle_id: selectedCircle.id,
        message: newMessage,
        display_name: userDisplayName,
        reactions: [],
        replies: []
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const sendReply = async (messageId: string) => {
    if (!replyText.trim()) return;

    try {
      await trulyCirclesService.addReply(messageId, {
        text: replyText,
        display_name: userDisplayName
      });

      // Update local state
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          const newReply = {
            id: crypto.randomUUID(),
            text: replyText,
            timestamp: new Date().toISOString(),
            display_name: userDisplayName
          };
          return { ...msg, replies: [...msg.replies, newReply] };
        }
        return msg;
      }));

      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const addReaction = async (messageId: string, emoji: string) => {
    try {
      await trulyCirclesService.addReaction(messageId, emoji);

      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, reactions: [...msg.reactions, emoji] }
          : msg
      ));
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const getAmbientEffect = (effect: string) => {
    switch (effect) {
      case 'hope':
        return (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <Sparkles
                key={i}
                size={6}
                className="absolute text-green-300/30 animate-pulse-gentle"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.5}s`
                }}
              />
            ))}
          </div>
        );
      case 'joy':
        return (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <Heart
                key={i}
                size={8}
                className="absolute text-yellow-300/20 animate-pulse-slow"
                style={{
                  top: `${30 + Math.random() * 40}%`,
                  left: `${30 + Math.random() * 40}%`,
                  animationDelay: `${i * 0.8}s`
                }}
              />
            ))}
          </div>
        );
      case 'healing':
        return (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-pink-300/30 rounded-full animate-pulse-gentle"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.3}s`
                }}
              />
            ))}
          </div>
        );
      case 'lunar':
        return (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <Star
                key={i}
                size={4}
                className="absolute text-blue-300/25 animate-pulse-gentle"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.4}s`
                }}
              />
            ))}
          </div>
        );
      case 'becoming':
        return (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-purple-300/20 rounded-full animate-pulse-slow"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.6}s`
                }}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const closeModals = () => {
    setShowCircleModal(false);
    setShowChatModal(false);
    setSelectedCircle(null);
    setReplyingTo(null);
    setReplyText('');
    setNewMessage('');
    setMessages([]);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <Users size={64} className="mx-auto mb-6 text-teal-300/60 animate-pulse-gentle" />
          <h2 className="text-3xl font-serif text-teal-100 mb-4">Join the Circles</h2>
          <p className="text-lg text-teal-200/80 font-rounded mb-8">Please log in to connect with your emotional community</p>
          <LoginButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-violet-950 relative overflow-hidden pt-24">
      {/* Soft Dark Purple Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-indigo-900/40 to-violet-900/50 animate-gradient-shift"></div>
        
        {/* Gentle Floating Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <Sparkles 
              key={i}
              size={Math.random() * 4 + 3} 
              className="absolute text-white/15 animate-pulse-gentle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Soft Mist */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/8 to-transparent animate-mist-1"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-transparent via-purple-300/8 to-transparent animate-mist-2"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto p-8 pb-20">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="relative inline-block mb-8">
            <Users size={80} className="text-teal-300/60 animate-pulse-slow" />
            <div className="absolute inset-0 rounded-full bg-teal-300/10 blur-2xl animate-pulse-gentle"></div>
            
            {/* Orbiting Sparkles */}
            <div className="absolute inset-0 animate-spin-slow">
              <Sparkles size={12} className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-pink-300/60" />
              <Heart size={10} className="absolute top-1/2 -right-4 transform -translate-y-1/2 text-yellow-300/60" />
              <Star size={14} className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-blue-300/60" />
              <Moon size={8} className="absolute top-1/2 -left-4 transform -translate-y-1/2 text-purple-300/60" />
            </div>
          </div>
          
          <h1 className="text-4xl font-cursive text-teal-100 mb-6 glow-text">
            Welcome to Truly Circles
          </h1>
          <p className="text-xl font-serif text-teal-200/80 leading-relaxed max-w-3xl mx-auto">
            Emotion-based safe spaces to feel seen — without pressure.
          </p>
        </div>

        {/* Circle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {circles.map((circle, index) => {
            const isJoined = joinedCircles.includes(circle.id);
            
            return (
              <button
                key={circle.id}
                onClick={() => handleCircleClick(circle)}
                className={`group relative p-8 bg-gradient-to-br ${circle.bgGradient} backdrop-blur-sm border ${circle.borderColor} rounded-3xl hover:scale-105 transition-all duration-500 glow-button text-left animate-fade-in overflow-hidden`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Ambient Effect */}
                {getAmbientEffect(circle.ambientEffect)}
                
                {/* Joined Badge */}
                {isJoined && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-xs font-cursive text-white/90 z-10">
                    <Check size={12} />
                    <span>Joined</span>
                  </div>
                )}
                
                {/* Floating Icon */}
                <div className="relative mb-6 z-10">
                  <circle.icon size={48} className={`${circle.color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 animate-pulse-gentle`} />
                  
                  {/* Icon Glow */}
                  <div className="absolute inset-0 rounded-full bg-current opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
                </div>

                {/* Circle Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-2xl font-cursive ${circle.color} group-hover:glow-text transition-all duration-300`}>
                      {circle.name}
                    </h3>
                    <div className="text-xs font-rounded text-white/60 bg-white/10 px-2 py-1 rounded-full">
                      {circle.currentSouls} souls here
                    </div>
                  </div>
                  <p className="text-white/70 font-serif leading-relaxed text-sm group-hover:text-white/80 transition-all duration-300">
                    {circle.description}
                  </p>
                </div>

                {/* Gentle Pulse Animation */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-gentle"></div>
              </button>
            );
          })}
        </div>

        {/* Footer Message */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <p className="text-lg font-cursive text-purple-300/70 italic">
            "In circles of understanding, hearts find their home..."
          </p>
        </div>
      </div>

      {/* Circle Join Modal */}
      {showCircleModal && selectedCircle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModals}
          ></div>
          
          {/* Modal */}
          <div className="relative w-full max-w-2xl bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-lg border border-purple-300/30 rounded-3xl p-8 shadow-2xl animate-fade-in">
            {/* Ambient Effect */}
            {getAmbientEffect(selectedCircle.ambientEffect)}
            
            {/* Close Button */}
            <button
              onClick={closeModals}
              className="absolute top-4 right-4 p-2 text-purple-300/70 hover:text-purple-200 hover:bg-white/10 rounded-full transition-all duration-300 z-10"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-8 relative z-10">
              <selectedCircle.icon size={64} className={`mx-auto mb-4 ${selectedCircle.color} animate-pulse-gentle`} />
              <h2 className={`text-3xl font-cursive ${selectedCircle.color} mb-4 glow-text`}>
                {selectedCircle.name}
              </h2>
              <p className="text-lg font-serif text-purple-200/80 leading-relaxed mb-6">
                {selectedCircle.description}
              </p>
              
              <div className="flex items-center justify-center gap-4 text-sm text-purple-300/70">
                <span>{selectedCircle.currentSouls} souls currently here</span>
                <span>•</span>
                <span>Anonymous & Safe</span>
              </div>
            </div>

            {/* Safety Reminder */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8 relative z-10">
              <h3 className="font-cursive text-purple-200 mb-3 flex items-center gap-2">
                <Heart size={18} className="text-pink-300" />
                Gentle Reminder
              </h3>
              <p className="text-purple-200/80 font-serif leading-relaxed">
                This is an anonymous circle. Be kind. Be gentle. Share from your heart, and hold space for others with compassion.
              </p>
            </div>

            {/* Join Button */}
            <button
              onClick={joinCircle}
              disabled={isJoining}
              className={`w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r ${selectedCircle.bgGradient} backdrop-blur-sm border ${selectedCircle.borderColor} rounded-2xl ${selectedCircle.color} font-cursive text-lg hover:scale-105 transition-all duration-300 glow-button relative z-10 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isJoining ? (
                <>
                  <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin"></div>
                  Joining Circle...
                </>
              ) : (
                <>
                  <selectedCircle.icon size={20} />
                  Join This Circle
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && selectedCircle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeModals}
          ></div>
          
          {/* Chat Modal */}
          <div className="relative w-full max-w-4xl h-[80vh] bg-gradient-to-br from-purple-950/95 via-indigo-950/95 to-violet-950/95 backdrop-blur-lg border border-purple-300/30 rounded-3xl shadow-2xl animate-fade-in flex flex-col overflow-hidden">
            {/* Ambient Effect */}
            {getAmbientEffect(selectedCircle.ambientEffect)}
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 relative z-10">
              <div className="flex items-center gap-4">
                <selectedCircle.icon size={32} className={selectedCircle.color} />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className={`text-2xl font-cursive ${selectedCircle.color} glow-text`}>
                      {selectedCircle.name}
                    </h2>
                    <div className="flex items-center gap-1 px-2 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs font-cursive text-white/80">
                      <Check size={10} />
                      <span>Joined</span>
                    </div>
                  </div>
                  <p className="text-sm text-purple-300/70">
                    {selectedCircle.currentSouls} souls here • You are {userDisplayName}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
                >
                  {isMuted ? <VolumeX size={18} className="text-purple-200" /> : <Volume2 size={18} className="text-purple-200" />}
                </button>
                <button
                  onClick={closeModals}
                  className="p-2 text-purple-300/70 hover:text-purple-200 hover:bg-white/10 rounded-full transition-all duration-300"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="w-8 h-8 border-2 border-purple-300/30 border-t-purple-300 rounded-full animate-spin"></div>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="animate-fade-in">
                    {/* Main Message */}
                    <div className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl p-4 glow-message">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-cursive text-purple-300/80">{message.display_name}</span>
                        <span className="text-xs text-purple-400/60">
                          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <p className="text-purple-100 font-serif leading-relaxed mb-3">
                        {message.message}
                      </p>
                      
                      {/* Reactions */}
                      <div className="flex items-center gap-2 mb-2">
                        {message.reactions.map((reaction, index) => (
                          <span key={index} className="text-sm">{reaction}</span>
                        ))}
                        <button
                          onClick={() => addReaction(message.id, '💚')}
                          className="text-xs hover:scale-110 transition-transform duration-200 opacity-60 hover:opacity-100"
                        >
                          💚
                        </button>
                        <button
                          onClick={() => addReaction(message.id, '✨')}
                          className="text-xs hover:scale-110 transition-transform duration-200 opacity-60 hover:opacity-100"
                        >
                          ✨
                        </button>
                        <button
                          onClick={() => addReaction(message.id, '🫂')}
                          className="text-xs hover:scale-110 transition-transform duration-200 opacity-60 hover:opacity-100"
                        >
                          🫂
                        </button>
                      </div>
                      
                      {/* Reply Button */}
                      <button
                        onClick={() => setReplyingTo(replyingTo === message.id ? null : message.id)}
                        className="text-xs text-purple-300/70 hover:text-purple-200 font-cursive transition-colors duration-300"
                      >
                        Reply gently
                      </button>
                    </div>

                    {/* Replies */}
                    {message.replies.length > 0 && (
                      <div className="ml-8 mt-3 space-y-2">
                        {message.replies.map((reply) => (
                          <div key={reply.id} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3">
                            <div className="flex items-start justify-between mb-1">
                              <span className="text-xs font-cursive text-purple-300/70">{reply.display_name}</span>
                              <span className="text-xs text-purple-400/50">
                                {new Date(reply.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm text-purple-200/90 font-serif leading-relaxed">
                              {reply.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input */}
                    {replyingTo === message.id && (
                      <div className="ml-8 mt-3 animate-fade-in">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Send a gentle reply..."
                            className="flex-1 px-4 py-2 bg-white/15 backdrop-blur-sm border border-purple-300/30 rounded-xl text-purple-100 placeholder-purple-300/60 font-serif text-sm focus:outline-none focus:border-purple-300/60 focus:bg-white/20 transition-all duration-300"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                sendReply(message.id);
                              }
                            }}
                          />
                          <button
                            onClick={() => sendReply(message.id)}
                            disabled={!replyText.trim()}
                            className="px-4 py-2 bg-gradient-to-r from-purple-500/40 to-pink-500/40 backdrop-blur-sm border border-purple-300/40 rounded-xl text-purple-100 hover:from-purple-500/50 hover:to-pink-500/50 hover:border-purple-300/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Send size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-white/10 relative z-10">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Share from your heart..."
                  className="flex-1 px-6 py-4 bg-white/15 backdrop-blur-sm border border-purple-300/30 rounded-2xl text-purple-100 placeholder-purple-300/60 font-serif focus:outline-none focus:border-purple-300/60 focus:bg-white/20 transition-all duration-300 glow-input"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage();
                    }
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className={`px-6 py-4 bg-gradient-to-r ${selectedCircle.bgGradient} backdrop-blur-sm border ${selectedCircle.borderColor} rounded-2xl ${selectedCircle.color} hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-button`}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrulyCircles;