import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Save, Sparkles, X, Wand2, Star } from 'lucide-react';
import LoginButton from '../components/LoginButton';
import { useAuth } from '../contexts/AuthContext';
import { heartprintService, HeartprintEntry } from '../lib/database';
import { sendFutureSelfMessage } from '../services/openai';

interface MoodTag {
  name: string;
  color: string;
  bgColor: string;
}

interface ConstellationData {
  day: string;
  emotion: string;
  intensity: number;
  x: number;
  y: number;
  id: string;
  title?: string;
}

const moodTags: MoodTag[] = [
  { name: 'Joyful', color: 'text-yellow-200', bgColor: 'bg-yellow-400/30' },
  { name: 'Peaceful', color: 'text-blue-200', bgColor: 'bg-blue-400/30' },
  { name: 'Tender', color: 'text-pink-200', bgColor: 'bg-pink-400/30' },
  { name: 'Dreamy', color: 'text-purple-200', bgColor: 'bg-purple-400/30' },
  { name: 'Foggy', color: 'text-gray-200', bgColor: 'bg-gray-400/30' },
  { name: 'Lost', color: 'text-indigo-200', bgColor: 'bg-indigo-400/30' },
  { name: 'Hopeful', color: 'text-green-200', bgColor: 'bg-green-400/30' },
  { name: 'Restless', color: 'text-orange-200', bgColor: 'bg-orange-400/30' },
  { name: 'Grateful', color: 'text-rose-200', bgColor: 'bg-rose-400/30' },
  { name: 'Curious', color: 'text-teal-200', bgColor: 'bg-teal-400/30' }
];

const inspirationalQuotes = [
  "Even in the quiet, you were growing.",
  "Your heart knows the way forward.",
  "This moment is part of your beautiful becoming.",
  "You are exactly where you need to be.",
  "Your feelings are valid and worthy of honor.",
  "In stillness, wisdom whispers.",
  "Every breath is a new beginning.",
  "You are writing your own love story."
];

const poeticMessages = {
  Calm: "This night held quiet strength.",
  Joy: "Your light illuminated the darkness.",
  Sad: "Even tears water the garden of growth.",
  Anxious: "In uncertainty, courage was born.",
  Hopeful: "Stars aligned to whisper possibilities.",
  Peaceful: "Serenity found its home in you.",
  Tender: "Softness became your superpower.",
  Dreamy: "Imagination painted new worlds.",
  Foggy: "Through mist, clarity slowly emerged.",
  Lost: "Wandering led to unexpected discoveries.",
  Restless: "Energy sought its perfect expression.",
  Grateful: "Appreciation transformed everything."
};

function HeartprintRecord() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [entries, setEntries] = useState<HeartprintEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [energyLevel, setEnergyLevel] = useState(3);
  const [title, setTitle] = useState('');
  const [reflection, setReflection] = useState('');
  const [showQuote, setShowQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  const [isHeartPulsing, setIsHeartPulsing] = useState(true);
  const [hoveredStar, setHoveredStar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Future Self Modal State
  const [showFutureSelfModal, setShowFutureSelfModal] = useState(false);
  const [futureSelfInput, setFutureSelfInput] = useState('');
  const [futureSelfMessage, setFutureSelfMessage] = useState('');
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Load entries from Supabase
  useEffect(() => {
    const loadEntries = async () => {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await heartprintService.getEntries(user.id);
        setEntries(data);
      } catch (error) {
        console.error('Error loading heartprint entries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, [isAuthenticated, user]);

  const handleSaveEntry = async () => {
    if (!selectedMood || !title.trim() || !reflection.trim() || !user) return;

    setIsSaving(true);

    try {
      const newEntry = await heartprintService.createEntry({
        user_id: user.id,
        title: title.trim(),
        mood: selectedMood,
        energy_level: energyLevel,
        reflection: reflection.trim()
      });

      setEntries(prev => [newEntry, ...prev]);
      
      // Reset form
      setSelectedMood('');
      setEnergyLevel(3);
      setTitle('');
      setReflection('');

      // Show inspirational quote
      const randomQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
      setCurrentQuote(randomQuote);
      setShowQuote(true);
      
      // Play soft chime sound (simulated with visual feedback)
      setIsHeartPulsing(false);
      setTimeout(() => setIsHeartPulsing(true), 100);

      // Hide quote after 4 seconds
      setTimeout(() => setShowQuote(false), 4000);
    } catch (error) {
      console.error('Error saving heartprint entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFutureSelfChannel = async () => {
    if (!futureSelfInput.trim() || isGeneratingMessage) return;

    setIsGeneratingMessage(true);
    setFutureSelfMessage('');

    try {
      const message = await sendFutureSelfMessage(futureSelfInput);
      setFutureSelfMessage(message);
    } catch (error) {
      console.error('Error generating future self message:', error);
      setFutureSelfMessage("Your future self whispers: 'I am always with you, even when the path seems unclear. Trust in your journey, for every step is leading you home to yourself.'");
    } finally {
      setIsGeneratingMessage(false);
    }
  };

  const closeFutureSelfModal = () => {
    setShowFutureSelfModal(false);
    setFutureSelfInput('');
    setFutureSelfMessage('');
  };

  const getMoodColor = (moodName: string) => {
    const mood = moodTags.find(tag => tag.name === moodName);
    return mood ? mood.color : 'text-purple-200';
  };

  const getEnergyColor = (level: number) => {
    if (level <= 2) return 'from-blue-400 to-indigo-500';
    if (level <= 3) return 'from-purple-400 to-pink-500';
    return 'from-pink-400 to-rose-500';
  };

  // Mock constellation data for visualization
  const mockConstellationData: ConstellationData[] = entries.slice(0, 6).map((entry, index) => ({
    day: new Date(entry.created_at).toLocaleDateString('en-US', { weekday: 'short' }),
    emotion: entry.mood || 'Calm',
    intensity: entry.energy_level,
    x: 15 + (index * 15),
    y: 30 + (Math.sin(index) * 20) + 20,
    id: entry.id,
    title: entry.title
  }));

  const getStarColor = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'calm':
      case 'peaceful':
        return '#93c5fd'; // soft blue
      case 'joy':
      case 'joyful':
      case 'hopeful':
        return '#fbbf24'; // gold
      case 'sad':
      case 'lost':
        return '#c4b5fd'; // lilac
      case 'anxious':
      case 'restless':
        return '#f3f4f6'; // flickering white
      case 'tender':
      case 'grateful':
        return '#f9a8d4'; // pink
      case 'dreamy':
        return '#a78bfa'; // purple
      default:
        return '#e5e7eb'; // default light gray
    }
  };

  const getStarSize = (intensity: number) => {
    return Math.max(8, intensity * 3);
  };

  const generateConstellationLines = (data: ConstellationData[]) => {
    const lines: Array<{ x1: number; y1: number; x2: number; y2: number; opacity: number }> = [];
    
    for (let i = 0; i < data.length - 1; i++) {
      for (let j = i + 1; j < data.length; j++) {
        const star1 = data[i];
        const star2 = data[j];
        
        const distance = Math.sqrt(Math.pow(star2.x - star1.x, 2) + Math.pow(star2.y - star1.y, 2));
        const emotionMatch = star1.emotion === star2.emotion;
        
        if (distance < 40 || emotionMatch) {
          lines.push({
            x1: star1.x,
            y1: star1.y,
            x2: star2.x,
            y2: star2.y,
            opacity: emotionMatch ? 0.4 : Math.max(0.1, 0.5 - distance / 100)
          });
        }
      }
    }
    
    return lines;
  };

  const constellationLines = generateConstellationLines(mockConstellationData);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <Heart size={64} className="mx-auto mb-6 text-purple-300/60 animate-pulse-gentle" />
          <h2 className="text-3xl font-serif text-purple-100 mb-4">Your Heartprint Awaits</h2>
          <p className="text-lg text-purple-200/80 font-rounded mb-8">Please log in to access your emotional journey</p>
          <LoginButton />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-300/30 border-t-purple-300 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-200 font-serif">Loading your heartprints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900/60 via-pink-900/50 to-purple-900/60 relative overflow-hidden pt-24">
      {/* Login Button */}
      <div className="absolute top-6 right-6 z-20">
        <LoginButton />
      </div>

      {/* Colorful Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-800/40 via-pink-800/30 to-purple-800/40 animate-gradient-shift"></div>
        
        {/* Warm Mist Overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-pink-300/15 to-transparent animate-mist-1"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-transparent via-rose-300/12 to-transparent animate-mist-2"></div>
        </div>

        {/* Floating Hearts and Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <Heart 
              key={i}
              size={Math.random() * 8 + 4} 
              className="absolute text-pink-300/25 animate-pulse-gentle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
          {[...Array(15)].map((_, i) => (
            <Sparkles 
              key={i}
              size={Math.random() * 6 + 4} 
              className="absolute text-yellow-300/20 animate-pulse-slow"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`
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

        <h1 className="text-2xl font-cursive text-pink-200 glow-text">Heartprint Record</h1>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto p-8 pb-20">
        {/* Glowing Heart Crystal Centerpiece */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <Heart 
              size={80} 
              className={`text-pink-300/80 ${isHeartPulsing ? 'animate-pulse-gentle' : ''} glow-text`}
              fill="currentColor"
            />
            <div className="absolute inset-0 rounded-full bg-pink-300/20 blur-xl animate-pulse-slow"></div>
          </div>
        </div>

        {/* Emotional Timeline Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-pink-100 mb-2 glow-text">Your Emotional Timeline</h2>
          <p className="text-lg font-cursive text-pink-200/80">{today}</p>
        </div>

        {/* Entry Form */}
        <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-pink-300/30 rounded-3xl p-8 mb-8 glow-message">
          {/* Mood Selection */}
          <div className="mb-6">
            <label className="block text-lg font-serif text-pink-100 mb-4">
              How are you feeling right now, truly?
            </label>
            <div className="flex flex-wrap gap-3">
              {moodTags.map((mood) => (
                <button
                  key={mood.name}
                  onClick={() => setSelectedMood(mood.name)}
                  className={`px-4 py-2 rounded-full border transition-all duration-300 font-bold text-sm ${
                    selectedMood === mood.name
                      ? `${mood.bgColor} ${mood.color} border-current glow-button`
                      : 'bg-white/5 text-purple-200/70 border-white/20 hover:bg-white/10 hover:text-purple-100'
                  }`}
                  disabled={isSaving}
                >
                  {mood.name}
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level Slider */}
          <div className="mb-6">
            <label className="block text-lg font-serif text-pink-100 mb-4">
              Energy Level
            </label>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="5"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, rgb(168 85 247 / 0.5) 0%, rgb(168 85 247 / 0.5) ${(energyLevel - 1) * 25}%, rgb(255 255 255 / 0.2) ${(energyLevel - 1) * 25}%, rgb(255 255 255 / 0.2) 100%)`
                }}
                disabled={isSaving}
              />
              <div className="flex justify-between text-sm text-pink-300/60 mt-2">
                <span>Low</span>
                <span>Moderate</span>
                <span>High</span>
              </div>
            </div>
          </div>

          {/* Title Input */}
          <div className="mb-6">
            <label className="block text-lg font-serif text-pink-100 mb-4">
              Name today's chapter…
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A gentle title for this moment..."
              className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-pink-300/20 rounded-2xl text-pink-100 placeholder-pink-300/60 font-serif focus:outline-none focus:border-pink-300/50 focus:bg-white/15 transition-all duration-300 glow-input"
              disabled={isSaving}
            />
          </div>

          {/* Reflection Textarea */}
          <div className="mb-6">
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Let your heart speak... What wants to be witnessed today?"
              className="w-full h-32 px-6 py-4 bg-white/10 backdrop-blur-sm border border-pink-300/20 rounded-2xl text-pink-100 placeholder-pink-300/60 font-serif resize-none focus:outline-none focus:border-pink-300/50 focus:bg-white/15 transition-all duration-300 glow-input"
              disabled={isSaving}
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveEntry}
            disabled={!selectedMood || !title.trim() || !reflection.trim() || isSaving}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500/40 to-rose-500/40 backdrop-blur-sm border border-pink-300/40 rounded-2xl text-pink-100 font-serif text-lg hover:from-pink-500/50 hover:to-rose-500/50 hover:border-pink-300/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-button"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-pink-300/30 border-t-pink-300 rounded-full animate-spin"></div>
                Saving this Heartprint...
              </>
            ) : (
              <>
                <Save size={20} />
                Save this Heartprint
              </>
            )}
          </button>
        </div>

        {/* Inspirational Quote */}
        {showQuote && (
          <div className="text-center mb-8 animate-fade-in">
            <p className="text-xl font-cursive text-pink-300/90 glow-text">
              "{currentQuote}"
            </p>
          </div>
        )}

        {/* Heartprint Pulse: Star Constellation Chart */}
        {mockConstellationData.length > 0 && (
          <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-blue-900/40 backdrop-blur-sm border border-white/10 rounded-3xl p-8 mb-8 relative overflow-hidden">
            {/* Animated Title */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-cursive text-purple-100 mb-2 animate-pulse glow-text">
                Heartprint Pulse: Your Emotional Constellation
              </h3>
              <p className="text-purple-200/70 font-serif">Each star represents a moment in your journey</p>
            </div>

            {/* Constellation Chart */}
            <div className="relative h-80 bg-gradient-to-br from-indigo-950/50 to-purple-950/50 rounded-2xl border border-white/5 overflow-hidden">
              {/* Starscape Background */}
              <div className="absolute inset-0">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse-gentle"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${2 + Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>

              {/* SVG for constellation lines and stars */}
              <svg className="absolute inset-0 w-full h-full">
                {/* Constellation Lines */}
                {constellationLines.map((line, index) => (
                  <line
                    key={index}
                    x1={`${line.x1}%`}
                    y1={`${line.y1}%`}
                    x2={`${line.x2}%`}
                    y2={`${line.y2}%`}
                    stroke="rgba(168, 85, 247, 0.3)"
                    strokeWidth="1"
                    opacity={line.opacity}
                    className="animate-pulse-gentle"
                  />
                ))}

                {/* Emotional Stars */}
                {mockConstellationData.map((star) => (
                  <g key={star.id}>
                    {/* Star Glow */}
                    <circle
                      cx={`${star.x}%`}
                      cy={`${star.y}%`}
                      r={getStarSize(star.intensity) + 4}
                      fill={getStarColor(star.emotion)}
                      opacity="0.2"
                      className="animate-pulse-slow"
                    />
                    
                    {/* Main Star */}
                    <circle
                      cx={`${star.x}%`}
                      cy={`${star.y}%`}
                      r={getStarSize(star.intensity)}
                      fill={getStarColor(star.emotion)}
                      opacity={hoveredStar === star.id ? "1" : "0.8"}
                      className={`cursor-pointer transition-all duration-300 ${
                        star.emotion.toLowerCase() === 'anxious' ? 'animate-pulse' : 'animate-pulse-gentle'
                      }`}
                      onMouseEnter={() => setHoveredStar(star.id)}
                      onMouseLeave={() => setHoveredStar(null)}
                    />
                  </g>
                ))}
              </svg>

              {/* Tooltips */}
              {hoveredStar && (
                <div className="absolute pointer-events-none z-10">
                  {mockConstellationData.map((star) => 
                    star.id === hoveredStar ? (
                      <div
                        key={star.id}
                        className="absolute bg-black/80 backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-white/20 animate-fade-in"
                        style={{
                          left: `${star.x}%`,
                          top: `${star.y - 15}%`,
                          transform: 'translate(-50%, -100%)'
                        }}
                      >
                        <div className="text-center">
                          <div className="font-cursive text-sm" style={{ color: getStarColor(star.emotion) }}>
                            {star.emotion}
                          </div>
                          <div className="text-xs opacity-75 mb-1">{star.day}</div>
                          {star.title && (
                            <div className="text-xs font-serif italic">{star.title}</div>
                          )}
                          <div className="text-xs font-serif italic mt-2 text-purple-200">
                            {poeticMessages[star.emotion as keyof typeof poeticMessages] || "A moment of being."}
                          </div>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              )}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <div className="text-xs text-white/80 font-serif mb-2">Emotional Intensity</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-xs text-white/60">Calm</span>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 ml-2"></div>
                  <span className="text-xs text-white/60">Joy</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-400 ml-2"></div>
                  <span className="text-xs text-white/60">Tender</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Emotional Timeline */}
        {entries.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 mb-8">
            <h3 className="text-2xl font-serif text-purple-100 mb-6 text-center">Your Journey</h3>
            
            {/* Timeline Visualization */}
            <div className="relative mb-8">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-indigo-400/30"></div>
              <div className="flex justify-between items-center relative">
                {entries.slice(0, 10).map((entry, index) => (
                  <div
                    key={entry.id}
                    className="group relative cursor-pointer"
                    title={`${new Date(entry.created_at).toLocaleDateString()} - ${entry.mood}`}
                  >
                    <div className={`w-4 h-4 rounded-full ${getMoodColor(entry.mood || '')} bg-current opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 glow-button`}></div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      <div className="font-cursive">{entry.mood}</div>
                      <div className="text-xs opacity-75">{new Date(entry.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Entries */}
            <div className="space-y-4">
              {entries.slice(0, 3).map((entry) => (
                <div key={entry.id} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-cursive text-lg text-purple-100">{entry.title}</h4>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getMoodColor(entry.mood || '')} bg-current/20`}>
                        {entry.mood}
                      </span>
                      <span className="text-sm text-purple-300/60">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-purple-200/80 font-serif leading-relaxed">
                    {entry.reflection.length > 150 
                      ? entry.reflection.substring(0, 150) + '...' 
                      : entry.reflection
                    }
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Whispers from Future Self Button */}
        <button
          onClick={() => setShowFutureSelfModal(true)}
          className="fixed bottom-8 right-8 z-30 flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-pink-500/30 to-purple-500/30 backdrop-blur-sm border border-pink-300/40 rounded-full text-pink-200 font-cursive text-lg hover:from-pink-500/40 hover:to-purple-500/40 hover:border-pink-300/60 transition-all duration-300 hover:scale-105 glow-button group"
        >
          <Wand2 size={20} className="group-hover:rotate-12 transition-transform duration-300" />
          Whispers from Future Self
        </button>

        {/* Future Self Modal */}
        {showFutureSelfModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeFutureSelfModal}
            ></div>
            
            {/* Modal */}
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-lg border border-purple-300/30 rounded-3xl p-8 shadow-2xl animate-fade-in">
              {/* Sparkle Particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                {[...Array(20)].map((_, i) => (
                  <Sparkles 
                    key={i}
                    size={Math.random() * 4 + 2} 
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

              {/* Close Button */}
              <button
                onClick={closeFutureSelfModal}
                className="absolute top-4 right-4 p-2 text-purple-300/70 hover:text-purple-200 hover:bg-white/10 rounded-full transition-all duration-300"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="mb-4">
                  <Wand2 size={48} className="mx-auto text-pink-300/80 animate-pulse-gentle" />
                </div>
                <h2 className="text-2xl font-cursive text-purple-100 mb-4 glow-text">
                  Whispers from Future Self
                </h2>
                <p className="text-lg font-serif text-purple-200/80 leading-relaxed">
                  What does your future self want you to know today?
                </p>
              </div>

              {/* Input Section */}
              <div className="space-y-6">
                <div>
                  <textarea
                    value={futureSelfInput}
                    onChange={(e) => setFutureSelfInput(e.target.value)}
                    placeholder="Share what's weighing on your heart, your dreams, your fears... Let your future self know what you need to hear..."
                    className="w-full h-32 px-6 py-4 bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-2xl text-purple-100 placeholder-purple-300/60 font-serif resize-none focus:outline-none focus:border-purple-300/60 focus:bg-white/15 transition-all duration-300 glow-input"
                  />
                </div>

                <button
                  onClick={handleFutureSelfChannel}
                  disabled={!futureSelfInput.trim() || isGeneratingMessage}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500/40 to-pink-500/40 backdrop-blur-sm border border-purple-300/40 rounded-2xl text-purple-100 font-cursive text-lg hover:from-purple-500/50 hover:to-pink-500/50 hover:border-purple-300/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-button"
                >
                  {isGeneratingMessage ? (
                    <>
                      <div className="w-5 h-5 border-2 border-purple-300/30 border-t-purple-300 rounded-full animate-spin"></div>
                      Channeling wisdom...
                    </>
                  ) : (
                    <>
                      <Wand2 size={20} />
                      Let Truly Channel It
                    </>
                  )}
                </button>
              </div>

              {/* AI Response */}
              {futureSelfMessage && (
                <div className="mt-8 animate-fade-in">
                  <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm border border-pink-300/30 rounded-2xl p-6 glow-message">
                    <div className="flex items-center gap-3 mb-4">
                      <Heart size={20} className="text-pink-300/80" fill="currentColor" />
                      <span className="font-cursive text-pink-200">Your Future Self whispers:</span>
                    </div>
                    <p className="text-purple-100 font-serif leading-relaxed text-lg italic">
                      "{futureSelfMessage}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HeartprintRecord;