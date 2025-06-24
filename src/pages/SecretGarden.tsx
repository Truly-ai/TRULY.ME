import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TreePine, Sparkles, Star, Plus, RotateCcw, Send, X, Flower2 } from 'lucide-react';
import LoginButton from '../components/LoginButton';

interface PlantedThought {
  id: string;
  message: string;
  timestamp: Date;
  softNotes: SoftNote[];
  bloomLevel: number; // 0-3, increases with soft notes
}

interface SoftNote {
  id: string;
  message: string;
  timestamp: Date;
}

interface GlowingFlower {
  id: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  glowColor: string;
  message: string;
  timestamp: Date;
}

function SecretGarden() {
  const navigate = useNavigate();
  const [plantedThoughts, setPlantedThoughts] = useState<PlantedThought[]>([]);
  const [glowingFlowers, setGlowingFlowers] = useState<GlowingFlower[]>([]);
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [newThought, setNewThought] = useState('');
  const [newSoftNote, setNewSoftNote] = useState('');
  const [selectedThought, setSelectedThought] = useState<PlantedThought | null>(null);
  const [expandedFlower, setExpandedFlower] = useState<string | null>(null);
  const [nightMode, setNightMode] = useState(false);
  const [hoveredSparkle, setHoveredSparkle] = useState<string | null>(null);
  const [hoveredFlower, setHoveredFlower] = useState<string | null>(null);
  const [clickedFlower, setClickedFlower] = useState<string | null>(null);

  const flowerGlowColors = [
    'rgba(255, 182, 193, 0.8)', // Light pink
    'rgba(255, 218, 185, 0.8)', // Peach
    'rgba(221, 160, 221, 0.8)', // Plum
    'rgba(255, 192, 203, 0.8)', // Pink
    'rgba(255, 160, 122, 0.8)', // Light salmon
    'rgba(238, 130, 238, 0.8)', // Violet
  ];

  const poeticMessages = [
    "A soul bloomed here...",
    "Love whispered through petals...",
    "Dreams took root in this moment...",
    "Hope blossomed from the heart...",
    "Gentle courage flowered here...",
    "A tender story found its voice...",
    "Beauty emerged from vulnerability...",
    "Light grew from shadow...",
    "Peace bloomed in this space...",
    "Wonder took its first breath..."
  ];

  // Load thoughts and flowers from localStorage on component mount
  useEffect(() => {
    const savedThoughts = localStorage.getItem('secret_garden_thoughts');
    const savedFlowers = localStorage.getItem('secret_garden_flowers');
    
    if (savedThoughts) {
      try {
        const parsed = JSON.parse(savedThoughts);
        setPlantedThoughts(parsed.map((thought: any) => ({
          ...thought,
          timestamp: new Date(thought.timestamp),
          softNotes: thought.softNotes.map((note: any) => ({
            ...note,
            timestamp: new Date(note.timestamp)
          }))
        })));
      } catch (error) {
        console.error('Error loading thoughts:', error);
      }
    }

    if (savedFlowers) {
      try {
        const parsed = JSON.parse(savedFlowers);
        setGlowingFlowers(parsed.map((flower: any) => ({
          ...flower,
          timestamp: new Date(flower.timestamp)
        })));
      } catch (error) {
        console.error('Error loading flowers:', error);
      }
    }
  }, []);

  // Save thoughts to localStorage whenever thoughts change
  useEffect(() => {
    if (plantedThoughts.length > 0) {
      localStorage.setItem('secret_garden_thoughts', JSON.stringify(plantedThoughts));
    }
  }, [plantedThoughts]);

  // Save flowers to localStorage whenever flowers change
  useEffect(() => {
    if (glowingFlowers.length > 0) {
      localStorage.setItem('secret_garden_flowers', JSON.stringify(glowingFlowers));
    }
  }, [glowingFlowers]);

  const generateFlowerPosition = (existingFlowers: GlowingFlower[]) => {
    const maxAttempts = 50;
    const minDistance = 60; // Minimum distance between flowers
    
    // Define the grassy area bounds (central lawn area of the cherry blossom garden)
    const grassyArea = {
      minX: 25, // Left edge of grass area
      maxX: 75, // Right edge of grass area
      minY: 45, // Top of grass area (below trees)
      maxY: 85  // Bottom of grass area (before foreground)
    };
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const x = grassyArea.minX + Math.random() * (grassyArea.maxX - grassyArea.minX);
      const y = grassyArea.minY + Math.random() * (grassyArea.maxY - grassyArea.minY);
      
      // Check if this position conflicts with existing flowers
      const tooClose = existingFlowers.some(flower => {
        const distance = Math.sqrt(Math.pow(flower.x - x, 2) + Math.pow(flower.y - y, 2));
        return distance < minDistance;
      });
      
      if (!tooClose) {
        return { x, y };
      }
    }
    
    // Fallback: return a random position in grassy area if we can't find a good spot
    return {
      x: grassyArea.minX + Math.random() * (grassyArea.maxX - grassyArea.minX),
      y: grassyArea.minY + Math.random() * (grassyArea.maxY - grassyArea.minY)
    };
  };

  const addGlowingFlower = (message: string) => {
    const position = generateFlowerPosition(glowingFlowers);
    
    const newFlower: GlowingFlower = {
      id: Date.now().toString(),
      x: position.x,
      y: position.y,
      scale: 0.4 + Math.random() * 0.3, // Smaller size for realistic garden scale
      rotation: Math.random() * 10 - 5, // Very small rotation for natural look
      glowColor: flowerGlowColors[Math.floor(Math.random() * flowerGlowColors.length)],
      message: message,
      timestamp: new Date()
    };

    setGlowingFlowers(prev => {
      const updated = [...prev, newFlower];
      // Keep only the latest 30 flowers
      if (updated.length > 30) {
        return updated.slice(-30);
      }
      return updated;
    });
  };

  const handlePlantThought = () => {
    if (!newThought.trim()) return;

    const newPlantedThought: PlantedThought = {
      id: Date.now().toString(),
      message: newThought.trim(),
      timestamp: new Date(),
      softNotes: [],
      bloomLevel: 0
    };

    setPlantedThoughts(prev => [...prev, newPlantedThought]);
    
    // Add a glowing flower for this new thought
    addGlowingFlower(newThought.trim());
    
    setNewThought('');
    setShowPlantModal(false);
  };

  const handleWaterSoul = () => {
    if (plantedThoughts.length === 0) return;
    
    // Get a random thought that isn't fully bloomed (bloomLevel < 3)
    const waterableThoughts = plantedThoughts.filter(thought => thought.bloomLevel < 3);
    if (waterableThoughts.length === 0) {
      // If all are fully bloomed, pick any random one
      const randomThought = plantedThoughts[Math.floor(Math.random() * plantedThoughts.length)];
      setSelectedThought(randomThought);
    } else {
      const randomThought = waterableThoughts[Math.floor(Math.random() * waterableThoughts.length)];
      setSelectedThought(randomThought);
    }
    
    setShowWaterModal(true);
  };

  const handleSendSoftNote = () => {
    if (!newSoftNote.trim() || !selectedThought) return;

    const softNote: SoftNote = {
      id: Date.now().toString(),
      message: newSoftNote.trim(),
      timestamp: new Date()
    };

    setPlantedThoughts(prev => prev.map(thought => 
      thought.id === selectedThought.id 
        ? { 
            ...thought, 
            softNotes: [...thought.softNotes, softNote],
            bloomLevel: Math.min(3, thought.bloomLevel + 1)
          }
        : thought
    ));

    setNewSoftNote('');
    setShowWaterModal(false);
    setSelectedThought(null);
  };

  const handleFlowerClick = (flower: GlowingFlower) => {
    setClickedFlower(flower.id);
    setTimeout(() => setClickedFlower(null), 3000); // Hide message after 3 seconds
  };

  const closeModals = () => {
    setShowPlantModal(false);
    setShowWaterModal(false);
    setSelectedThought(null);
    setNewThought('');
    setNewSoftNote('');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Login Button */}
      <div className="absolute top-6 right-6 z-20">
        <LoginButton />
      </div>

      {/* Cherry Blossom Garden Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/ChatGPT Image Jun 24, 2025, 10_10_03 AM.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
        }}
      >
        {/* Subtle overlay to enhance readability without hiding the beauty */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <button 
          onClick={() => navigate('/rituals-realms')}
          className="flex items-center gap-3 text-white hover:text-pink-200 transition-colors duration-300 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-serif">Back to Rituals & Realms</span>
        </button>

        <h1 className="text-2xl font-cursive text-white glow-text">Secret Garden</h1>

        {/* Night Mode Toggle */}
        <button
          onClick={() => setNightMode(!nightMode)}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-white/30 hover:border-white/50 transition-all duration-300"
        >
          <Star size={16} />
          <span className="font-cursive text-sm">{nightMode ? 'Day' : 'Night'}</span>
        </button>
      </div>

      {/* Main Content - Now Scrollable */}
      <div className="relative z-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8 pb-16">
          {/* Enchanted Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="relative inline-block mb-8">
              <TreePine size={80} className="text-pink-200/80 animate-pulse-slow" />
              <div className="absolute inset-0 rounded-full bg-pink-300/20 blur-2xl animate-pulse-gentle"></div>
              
              {/* Orbiting Sparkles */}
              <div className="absolute inset-0 animate-spin-slow">
                <Sparkles size={12} className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-pink-300/60" />
                <Sparkles size={10} className="absolute top-1/2 -right-4 transform -translate-y-1/2 text-white/60" />
                <Sparkles size={14} className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-pink-400/60" />
                <Sparkles size={8} className="absolute top-1/2 -left-4 transform -translate-y-1/2 text-rose-300/60" />
              </div>
            </div>
            
            <h2 className="text-4xl font-serif text-white mb-6 glow-text drop-shadow-lg">
              Where unspoken feelings <span className="font-cursive text-pink-200">bloom</span> into healing
            </h2>
            <p className="text-xl font-serif text-white/90 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
              Plant your thoughts anonymously and tend to others' souls with gentle kindness
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => setShowPlantModal(true)}
              className="group relative px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-serif text-lg hover:bg-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 glow-button"
            >
              <span className="relative z-10 flex items-center gap-3">
                <TreePine size={20} />
                Plant a Thought
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/20 to-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-gentle"></div>
            </button>
            
            <button
              onClick={handleWaterSoul}
              disabled={plantedThoughts.length === 0}
              className="group relative px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-serif text-lg hover:bg-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 glow-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Sparkles size={20} />
                Water Another Soul
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-gentle"></div>
            </button>
          </div>

          {/* Garden Display */}
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {plantedThoughts.length === 0 && glowingFlowers.length === 0 ? (
              <div className="text-center py-16">
                <Flower2 size={64} className="mx-auto mb-6 text-white/60 animate-pulse-gentle" />
                <p className="text-xl font-cursive text-white/80 italic drop-shadow-md">
                  Your garden awaits the first <span className="font-cursive text-pink-200">bloom</span>...
                </p>
              </div>
            ) : (
              <div className="relative min-h-[500px] rounded-3xl overflow-hidden">
                {/* Glowing Flowers positioned in the grassy area */}
                {glowingFlowers.map((flower, index) => (
                  <div
                    key={flower.id}
                    className={`absolute cursor-pointer transition-all duration-300 ${
                      hoveredFlower === flower.id ? 'scale-110' : ''
                    } ${
                      clickedFlower === flower.id ? 'animate-bounce-gentle' : ''
                    }`}
                    style={{
                      left: `${flower.x}%`,
                      top: `${flower.y}%`,
                      transform: `translate(-50%, -50%) scale(${flower.scale}) rotate(${flower.rotation}deg)`,
                      animationDelay: `${index * 0.2}s`
                    }}
                    onMouseEnter={() => setHoveredFlower(flower.id)}
                    onMouseLeave={() => setHoveredFlower(null)}
                    onClick={() => handleFlowerClick(flower)}
                  >
                    {/* Enhanced Flower Glow Effect */}
                    <div 
                      className="absolute inset-0 rounded-full blur-lg animate-pulse-slow"
                      style={{
                        background: `radial-gradient(circle, ${flower.glowColor} 0%, ${flower.glowColor.replace('0.8', '0.4')} 50%, transparent 70%)`,
                        width: '80px',
                        height: '80px',
                        transform: 'translate(-50%, -50%)',
                        left: '50%',
                        top: '50%'
                      }}
                    ></div>
                    
                    {/* Secondary Glow Ring */}
                    <div 
                      className="absolute inset-0 rounded-full blur-xl animate-pulse-gentle"
                      style={{
                        background: `radial-gradient(circle, ${flower.glowColor.replace('0.8', '0.3')} 0%, transparent 60%)`,
                        width: '120px',
                        height: '120px',
                        transform: 'translate(-50%, -50%)',
                        left: '50%',
                        top: '50%',
                        animationDelay: '0.5s'
                      }}
                    ></div>
                    
                    {/* Flower Image - Smaller scale for realistic garden */}
                    <img 
                      src="/flower.png" 
                      alt="Magical flower" 
                      className={`w-16 h-16 object-contain animate-bloom transition-all duration-300 ${
                        hoveredFlower === flower.id ? 'animate-wiggle' : ''
                      } animate-float-gentle`}
                      style={{
                        filter: `drop-shadow(0 0 10px ${flower.glowColor}) drop-shadow(0 0 20px ${flower.glowColor.replace('0.8', '0.4')}) brightness(1.1) saturate(1.1)`,
                        animationDelay: `${index * 0.1}s`
                      }}
                    />

                    {/* Poetic Message on Click */}
                    {clickedFlower === flower.id && (
                      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl border border-pink-300/30 whitespace-nowrap z-30 animate-fade-in">
                        <p className="text-sm font-cursive text-pink-200 italic">
                          {poeticMessages[Math.floor(Math.random() * poeticMessages.length)]}
                        </p>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
                      </div>
                    )}

                    {/* Enhanced shimmer particles around flower */}
                    {hoveredFlower === flower.id && (
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-white/70 rounded-full animate-pulse-gentle"
                            style={{
                              top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 25}px`,
                              left: `${20 + Math.cos(i * 60 * Math.PI / 180) * 25}px`,
                              animationDelay: `${i * 0.1}s`,
                              boxShadow: `0 0 6px ${flower.glowColor}`
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Plant Thought Modal */}
      {showPlantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModals}
          ></div>
          
          {/* Modal */}
          <div className="relative w-full max-w-2xl bg-gradient-to-br from-pink-900/95 via-rose-900/95 to-red-900/95 backdrop-blur-lg border border-pink-300/30 rounded-3xl p-8 shadow-2xl animate-fade-in">
            {/* Floating Sparkles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              {[...Array(15)].map((_, i) => (
                <Sparkles 
                  key={i}
                  size={Math.random() * 4 + 2} 
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

            {/* Close Button */}
            <button
              onClick={closeModals}
              className="absolute top-4 right-4 p-2 text-pink-300/70 hover:text-pink-200 hover:bg-white/10 rounded-full transition-all duration-300"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <TreePine size={48} className="mx-auto mb-4 text-pink-300/80 animate-pulse-gentle" />
              <h2 className="text-2xl font-serif text-pink-100 mb-4 glow-text">
                Plant a Thought
              </h2>
              <p className="text-lg font-serif text-pink-200/80 leading-relaxed">
                Share what's growing in your heart, anonymously and safely
              </p>
            </div>

            {/* Input */}
            <div className="space-y-6">
              <textarea
                value={newThought}
                onChange={(e) => setNewThought(e.target.value)}
                placeholder="What feeling, worry, hope, or dream wants to be planted in this sacred garden?"
                className="w-full h-40 px-6 py-4 bg-white/10 backdrop-blur-sm border border-pink-300/30 rounded-2xl text-pink-100 placeholder-pink-300/60 font-serif resize-none focus:outline-none focus:border-pink-300/60 focus:bg-white/15 transition-all duration-300 glow-input"
              />

              <button
                onClick={handlePlantThought}
                disabled={!newThought.trim()}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500/40 to-rose-500/40 backdrop-blur-sm border border-pink-300/40 rounded-2xl text-pink-100 font-serif text-lg hover:from-pink-500/50 hover:to-rose-500/50 hover:border-pink-300/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-button"
              >
                <TreePine size={20} />
                <span className="font-cursive">Plant</span> in the Garden
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Water Soul Modal */}
      {showWaterModal && selectedThought && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModals}
          ></div>
          
          {/* Modal */}
          <div className="relative w-full max-w-2xl bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-lg border border-blue-300/30 rounded-3xl p-8 shadow-2xl animate-fade-in">
            {/* Floating Sparkles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              {[...Array(15)].map((_, i) => (
                <Sparkles 
                  key={i}
                  size={Math.random() * 4 + 2} 
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

            {/* Close Button */}
            <button
              onClick={closeModals}
              className="absolute top-4 right-4 p-2 text-blue-300/70 hover:text-blue-200 hover:bg-white/10 rounded-full transition-all duration-300"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <Sparkles size={48} className="mx-auto mb-4 text-blue-300/80 animate-pulse-gentle" />
              <h2 className="text-2xl font-serif text-blue-100 mb-4 glow-text">
                Water Another Soul
              </h2>
              <p className="text-lg font-serif text-blue-200/80 leading-relaxed">
                Offer gentle kindness to help this thought <span className="font-cursive text-pink-300">bloom</span>
              </p>
            </div>

            {/* Original Thought */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6">
              <h3 className="font-cursive text-blue-200 mb-3">Someone shared:</h3>
              <p className="text-blue-100 font-serif leading-relaxed">
                {selectedThought.message}
              </p>
            </div>

            {/* Soft Note Input */}
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-serif text-blue-200 mb-4">
                  Send a <span className="font-cursive text-pink-300">soft</span> note:
                </label>
                <textarea
                  value={newSoftNote}
                  onChange={(e) => setNewSoftNote(e.target.value)}
                  placeholder="Share a gentle word of encouragement, understanding, or hope..."
                  className="w-full h-32 px-6 py-4 bg-white/10 backdrop-blur-sm border border-blue-300/30 rounded-2xl text-blue-100 placeholder-blue-300/60 font-serif resize-none focus:outline-none focus:border-blue-300/60 focus:bg-white/15 transition-all duration-300 glow-input"
                />
              </div>

              <button
                onClick={handleSendSoftNote}
                disabled={!newSoftNote.trim()}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500/40 to-purple-500/40 backdrop-blur-sm border border-blue-300/40 rounded-2xl text-blue-100 font-serif text-lg hover:from-blue-500/50 hover:to-purple-500/50 hover:border-blue-300/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-button"
              >
                <Send size={20} />
                Send <span className="font-cursive">Soft</span> Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close expanded flower */}
      {expandedFlower && (
        <div 
          className="fixed inset-0 z-20"
          onClick={() => setExpandedFlower(null)}
        ></div>
      )}
    </div>
  );
}

export default SecretGarden;