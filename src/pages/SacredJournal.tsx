import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Save, Volume2, VolumeX, Sparkles, Star, Heart, RotateCcw } from 'lucide-react';
import LoginButton from '../components/LoginButton';
import { useAuth } from '../contexts/AuthContext';
import { sacredJournalService, SacredJournalEntry } from '../lib/database';

const emotionTags = [
  { value: 'peaceful', label: 'Peaceful', icon: '🌿', color: 'text-green-300', bgColor: 'bg-green-500/20' },
  { value: 'stormy', label: 'Stormy', icon: '🌧', color: 'text-blue-300', bgColor: 'bg-blue-500/20' },
  { value: 'passionate', label: 'Passionate', icon: '🔥', color: 'text-red-300', bgColor: 'bg-red-500/20' },
  { value: 'lost', label: 'Lost', icon: '💫', color: 'text-purple-300', bgColor: 'bg-purple-500/20' },
  { value: 'healing', label: 'Healing', icon: '🌸', color: 'text-pink-300', bgColor: 'bg-pink-500/20' }
];

function SacredJournal() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [entries, setEntries] = useState<SacredJournalEntry[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load entries from Supabase
  useEffect(() => {
    const loadEntries = async () => {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await sacredJournalService.getEntries(user.id);
        setEntries(data);
      } catch (error) {
        console.error('Error loading journal entries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, [isAuthenticated, user]);

  const handleSaveEntry = async () => {
    if (!content.trim() || !user) return;

    setIsSaving(true);

    try {
      const selectedEmotionData = emotionTags.find(tag => tag.value === selectedEmotion) || emotionTags[0];

      const newEntry = await sacredJournalService.createEntry({
        user_id: user.id,
        title: title.trim() || 'Untitled Reflection',
        content: content.trim(),
        emotion: selectedEmotionData.label,
        emotion_icon: selectedEmotionData.icon
      });

      setEntries(prev => [newEntry, ...prev]);
      setTitle('');
      setContent('');
      setSelectedEmotion('');
    } catch (error) {
      console.error('Error saving journal entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleMusic = () => {
    setIsPlayingMusic(!isPlayingMusic);
    console.log(isPlayingMusic ? '🔇 Stopping piano music' : '🎵 Playing soft piano music');
  };

  const clearJournal = async () => {
    if (!window.confirm('Are you sure you want to clear all journal entries? This cannot be undone.')) {
      return;
    }

    try {
      // Delete all entries for the current user
      for (const entry of entries) {
        await sacredJournalService.deleteEntry(entry.id);
      }
      setEntries([]);
    } catch (error) {
      console.error('Error clearing journal:', error);
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-950 flex items-center justify-center">
        <div className="text-center">
          <BookOpen size={64} className="mx-auto mb-6 text-violet-300/60 animate-pulse-gentle" />
          <h2 className="text-3xl font-serif text-violet-100 mb-4">Your Sacred Journal Awaits</h2>
          <p className="text-lg text-violet-200/80 font-rounded mb-8">Please log in to access your private sanctuary</p>
          <LoginButton />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-violet-300/30 border-t-violet-300 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-violet-200 font-serif">Loading your sacred pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-950 relative overflow-hidden">
      {/* Login Button */}
      <div className="absolute top-6 right-6 z-20">
        <LoginButton />
      </div>

      {/* Music Toggle */}
      <div className="absolute top-6 left-20 z-20">
        <button
          onClick={toggleMusic}
          className="p-3 bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-full text-purple-200 hover:bg-white/20 hover:border-purple-300/50 transition-all duration-300 glow-button"
          title={isPlayingMusic ? 'Mute Piano' : 'Play Piano'}
        >
          {isPlayingMusic ? <Volume2 size={18} className="animate-pulse" /> : <VolumeX size={18} />}
        </button>
      </div>

      {/* Dreamy Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-purple-900/40 to-violet-900/50 animate-gradient-shift"></div>
        
        {/* Gentle Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse-gentle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Soft Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <Sparkles 
              key={i}
              size={Math.random() * 4 + 3} 
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

        {/* Gentle Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <Star 
              key={i}
              size={Math.random() * 3 + 2} 
              className="absolute text-violet-300/20 animate-pulse-gentle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${3 + Math.random() * 3}s`
              }}
            />
          ))}
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

        <h1 className="text-2xl font-cursive text-violet-200 glow-text">Sacred Journal</h1>
      </div>

      {/* Main Content */}
      <div className="relative z-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8 pb-16">
          
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="relative inline-block mb-8">
              <BookOpen size={80} className="text-violet-300/60 animate-pulse-slow" />
              <div className="absolute inset-0 rounded-full bg-violet-300/10 blur-2xl animate-pulse-gentle"></div>
              
              {/* Orbiting Elements */}
              <div className="absolute inset-0 animate-spin-slow">
                <Heart size={12} className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-pink-300/60" />
                <Sparkles size={10} className="absolute top-1/2 -right-4 transform -translate-y-1/2 text-violet-300/60" />
                <Star size={14} className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-purple-300/60" />
                <BookOpen size={8} className="absolute top-1/2 -left-4 transform -translate-y-1/2 text-indigo-300/60" />
              </div>
            </div>
            
            <h2 className="text-4xl font-cursive text-violet-100 mb-6 glow-text">
              Your Sacred Journal
            </h2>
            <p className="text-xl font-serif text-violet-200/80 leading-relaxed max-w-2xl mx-auto">
              A private sanctuary where your soul can speak freely and be witnessed with love
            </p>
          </div>

          {/* Journal Entry Form */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 mb-12 glow-message animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {/* Title Input */}
            <div className="mb-6">
              <label className="block text-lg font-serif text-violet-200 mb-3">
                Title this reflection (optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Dreams from today..."
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-violet-300/30 rounded-2xl text-violet-100 placeholder-violet-300/60 font-serif focus:outline-none focus:border-violet-300/60 focus:bg-white/15 transition-all duration-300 glow-input"
                disabled={isSaving}
              />
            </div>

            {/* Main Content Textarea */}
            <div className="mb-6">
              <label className="block text-lg font-serif text-violet-200 mb-3">
                What does your soul need to say?
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write what your soul needs to say..."
                className="w-full h-48 px-6 py-4 bg-white/10 backdrop-blur-sm border border-violet-300/30 rounded-2xl text-violet-100 placeholder-violet-300/60 font-serif resize-none focus:outline-none focus:border-violet-300/60 focus:bg-white/15 transition-all duration-300 glow-input"
                disabled={isSaving}
              />
            </div>

            {/* Emotion Tags */}
            <div className="mb-8">
              <label className="block text-lg font-serif text-violet-200 mb-4">
                How does your heart feel right now?
              </label>
              <div className="flex flex-wrap gap-3">
                {emotionTags.map((emotion) => (
                  <button
                    key={emotion.value}
                    onClick={() => setSelectedEmotion(emotion.value)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-full border transition-all duration-300 font-serif ${
                      selectedEmotion === emotion.value
                        ? `${emotion.bgColor} ${emotion.color} border-current glow-button`
                        : 'bg-white/5 text-violet-200/70 border-white/20 hover:bg-white/10 hover:text-violet-100'
                    }`}
                    disabled={isSaving}
                  >
                    <span className="text-lg">{emotion.icon}</span>
                    <span>{emotion.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveEntry}
              disabled={!content.trim() || isSaving}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-500/30 to-purple-500/30 backdrop-blur-sm border border-violet-300/40 rounded-2xl text-violet-100 font-cursive text-lg hover:from-violet-500/40 hover:to-purple-500/40 hover:border-violet-300/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-button"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-violet-300/30 border-t-violet-300 rounded-full animate-spin"></div>
                  Saving this reflection...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save this reflection
                </>
              )}
            </button>
          </div>

          {/* Past Entries */}
          {entries.length > 0 && (
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-cursive text-violet-100 glow-text">
                  My Past Reflections
                </h3>
                <button
                  onClick={clearJournal}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-violet-300/70 hover:text-violet-200 transition-all duration-300"
                >
                  <RotateCcw size={16} />
                  <span className="text-sm font-cursive">Clear All</span>
                </button>
              </div>
              
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {entries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 glow-message animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{entry.emotion_icon}</span>
                        <div>
                          <h4 className="font-cursive text-lg text-violet-200">{entry.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-violet-300/70">
                            <span>{entry.emotion}</span>
                            <span>•</span>
                            <span>{getTimeAgo(entry.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {expandedEntry === entry.id ? (
                      <div>
                        <p className="text-violet-100 font-serif leading-relaxed mb-4">
                          {entry.content}
                        </p>
                        <button
                          onClick={() => setExpandedEntry(null)}
                          className="text-sm text-violet-300/80 hover:text-violet-200 font-cursive transition-colors duration-300"
                        >
                          Show less
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-violet-100 font-serif leading-relaxed mb-4">
                          {entry.content.length > 150 
                            ? entry.content.substring(0, 150) + '...' 
                            : entry.content
                          }
                        </p>
                        {entry.content.length > 150 && (
                          <button
                            onClick={() => setExpandedEntry(entry.id)}
                            className="text-sm text-violet-300/80 hover:text-violet-200 font-cursive transition-colors duration-300"
                          >
                            Read more
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {entries.length === 0 && (
            <div className="text-center py-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <BookOpen size={48} className="mx-auto mb-4 text-violet-300/40 animate-pulse-gentle" />
              <p className="text-lg font-cursive text-violet-300/70 italic">
                Your reflections will appear here as you write them...
              </p>
            </div>
          )}

          {/* Footer Message */}
          <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <p className="text-lg font-cursive text-violet-300/70 italic">
              "Every word you write here is held in sacred trust..."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SacredJournal;