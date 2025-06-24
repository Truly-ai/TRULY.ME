import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Star, Sparkles, Volume2, Play, Pause, VolumeX } from 'lucide-react';
import LoginButton from '../components/LoginButton';
import { generateLullaby } from '../services/openai';
import { generateSpeech, cleanupAudioUrl } from '../services/elevenlabs';

const emotionalStates = [
  { value: 'sad', label: 'Sad', color: 'from-blue-400 to-indigo-500', description: 'Feeling tender and tearful' },
  { value: 'anxious', label: 'Anxious', color: 'from-purple-400 to-pink-500', description: 'Mind racing with worries' },
  { value: 'heavy', label: 'Heavy', color: 'from-gray-400 to-slate-500', description: 'Carrying the weight of the world' },
  { value: 'numb', label: 'Numb', color: 'from-indigo-400 to-blue-500', description: 'Feeling disconnected and empty' }
];

function LullabyMode() {
  const navigate = useNavigate();
  const [emotionalState, setEmotionalState] = useState(1); // 0-3 index
  const [lullabyText, setLullabyText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLullaby, setShowLullaby] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const currentEmotion = emotionalStates[emotionalState];

  // Cleanup audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        cleanupAudioUrl(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleGenerateLullaby = async () => {
    setIsGenerating(true);
    setShowLullaby(false);
    setAudioError(false);

    try {
      // Generate lullaby text
      const lullaby = await generateLullaby(currentEmotion.value, currentEmotion.description);
      setLullabyText(lullaby);
      setShowLullaby(true);

      // Generate speech audio
      setIsGeneratingAudio(true);
      const newAudioUrl = await generateSpeech(lullaby, import.meta.env.VITE_ELEVENLABS_VOICE_ID);
      
      if (newAudioUrl) {
        // Cleanup previous audio URL
        if (audioUrl) {
          cleanupAudioUrl(audioUrl);
        }
        
        setAudioUrl(newAudioUrl);
        
        // Create new audio player
        const newAudioPlayer = new Audio(newAudioUrl);
        
        // Set up event listeners
        newAudioPlayer.onended = () => {
          setIsPlayingAudio(false);
        };
        
        newAudioPlayer.onerror = () => {
          console.error('Audio playback error');
          setAudioError(true);
          setIsPlayingAudio(false);
        };
        
        newAudioPlayer.onloadeddata = () => {
          console.log('🎵 Audio loaded and ready to play');
        };
        
        setAudioPlayer(newAudioPlayer);
        
        // Auto-play the lullaby
        try {
          await newAudioPlayer.play();
          setIsPlayingAudio(true);
          console.log('🎵 Auto-playing lullaby');
        } catch (playError) {
          console.warn('Auto-play prevented by browser:', playError);
          setAudioError(false); // Not really an error, just browser policy
        }
      } else {
        console.log('🎵 ElevenLabs generation failed, showing text-only lullaby');
        setAudioError(true);
      }
    } catch (error) {
      console.error('Error generating lullaby:', error);
      setLullabyText("Close your eyes, dear heart, and breathe... You are safe in this moment. Let the gentle rhythm of your breath carry you to a place of peace. Tomorrow will bring new light, but for now, rest in the knowing that you are enough, just as you are.");
      setShowLullaby(true);
      setAudioError(true);
    } finally {
      setIsGenerating(false);
      setIsGeneratingAudio(false);
    }
  };

  const toggleAudioPlayback = async () => {
    if (!audioPlayer) return;

    try {
      if (isPlayingAudio) {
        audioPlayer.pause();
        setIsPlayingAudio(false);
      } else {
        await audioPlayer.play();
        setIsPlayingAudio(true);
      }
    } catch (error) {
      console.error('Error toggling audio playback:', error);
      setAudioError(true);
    }
  };

  const createAnotherLullaby = () => {
    setShowLullaby(false);
    setLullabyText('');
    if (audioUrl) {
      cleanupAudioUrl(audioUrl);
      setAudioUrl(null);
    }
    if (audioPlayer) {
      audioPlayer.pause();
      setAudioPlayer(null);
    }
    setIsPlayingAudio(false);
    setAudioError(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950 relative overflow-hidden">
      {/* Login Button */}
      <div className="absolute top-6 right-6 z-20">
        <LoginButton />
      </div>

      {/* Dreamy Night Sky Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-purple-900/30 to-blue-900/50 animate-gradient-shift"></div>
        
        {/* Gentle Twinkling Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(80)].map((_, i) => (
            <Star 
              key={i}
              size={Math.random() * 3 + 1} 
              className="absolute text-white/20 animate-pulse-gentle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Soft Floating Clouds */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-20 left-10 w-40 h-20 bg-white/10 rounded-full blur-2xl animate-mist-1"></div>
          <div className="absolute top-40 right-20 w-48 h-24 bg-white/8 rounded-full blur-2xl animate-mist-2"></div>
          <div className="absolute bottom-40 left-1/3 w-44 h-22 bg-white/6 rounded-full blur-2xl animate-mist-3"></div>
          <div className="absolute top-60 right-1/4 w-36 h-18 bg-white/12 rounded-full blur-xl animate-mist-1" style={{animationDelay: '3s'}}></div>
        </div>

        {/* Moonlight Glow */}
        <div className="absolute top-16 right-16 w-32 h-32 bg-gradient-to-br from-yellow-200/20 to-blue-200/10 rounded-full blur-3xl animate-pulse-slow"></div>
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

        <h1 className="text-2xl font-cursive text-blue-200 glow-text">Lullaby Mode</h1>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-88px)] p-8">
        <div className="max-w-2xl mx-auto text-center">
          
          {!showLullaby ? (
            /* Initial Form */
            <div className="animate-fade-in">
              {/* Gentle Moon Icon */}
              <div className="relative inline-block mb-12">
                <Moon size={80} className="text-blue-300/60 animate-pulse-slow" />
                <div className="absolute inset-0 rounded-full bg-blue-300/10 blur-2xl animate-pulse-gentle"></div>
                
                {/* Floating sparkles around moon */}
                <div className="absolute inset-0">
                  {[...Array(8)].map((_, i) => (
                    <Sparkles
                      key={i}
                      size={8}
                      className="absolute text-blue-300/40 animate-pulse-gentle"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                        animationDelay: `${i * 0.5}s`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Gentle Prompt */}
              <h2 className="text-3xl font-cursive text-blue-200 mb-8 glow-text">
                How is your heart feeling right now?
              </h2>
              <p className="text-lg font-rounded text-blue-300/80 mb-12 leading-relaxed">
                Let me sing your soul to sleep with words that understand exactly where you are
              </p>

              {/* Emotional State Slider */}
              <div className="bg-white/10 backdrop-blur-sm border border-blue-300/30 rounded-3xl p-8 mb-8 glow-message">
                <div className="mb-8">
                  <div className="relative mb-6">
                    <input
                      type="range"
                      min="0"
                      max="3"
                      value={emotionalState}
                      onChange={(e) => setEmotionalState(parseInt(e.target.value))}
                      className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, rgb(59 130 246 / 0.5) 0%, rgb(59 130 246 / 0.5) ${(emotionalState / 3) * 100}%, rgb(255 255 255 / 0.2) ${(emotionalState / 3) * 100}%, rgb(255 255 255 / 0.2) 100%)`
                      }}
                    />
                    
                    {/* Slider Labels */}
                    <div className="flex justify-between text-sm text-blue-300/60 mt-3">
                      {emotionalStates.map((state, index) => (
                        <span 
                          key={state.value}
                          className={`font-cursive transition-all duration-300 ${
                            index === emotionalState ? 'text-blue-200 font-semibold' : ''
                          }`}
                        >
                          {state.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Current Emotion Display */}
                  <div className={`p-6 bg-gradient-to-r ${currentEmotion.color}/20 backdrop-blur-sm border border-blue-300/20 rounded-2xl transition-all duration-500`}>
                    <h3 className="text-xl font-cursive text-blue-200 mb-2">
                      {currentEmotion.label}
                    </h3>
                    <p className="text-blue-300/80 font-rounded italic">
                      {currentEmotion.description}
                    </p>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerateLullaby}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm border border-blue-300/40 rounded-2xl text-blue-100 font-cursive text-lg hover:from-blue-500/40 hover:to-purple-500/40 hover:border-blue-300/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-button"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-blue-300/30 border-t-blue-300 rounded-full animate-spin"></div>
                      Weaving your lullaby...
                    </>
                  ) : (
                    <>
                      <Moon size={20} />
                      Sing me a lullaby
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Lullaby Display */
            <div className="animate-fade-in">
              {/* Lullaby Header */}
              <div className="relative inline-block mb-8">
                <h2 className="text-3xl font-cursive text-blue-200 glow-text mb-4">
                  Your Gentle Lullaby
                </h2>
                <div className="flex justify-center">
                  <Sparkles size={24} className="text-blue-300/60 animate-pulse-gentle" />
                </div>
              </div>

              {/* Lullaby Text Box */}
              <div className="relative bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-indigo-900/40 backdrop-blur-sm border border-blue-300/30 rounded-3xl p-8 mb-8 glow-message">
                {/* Floating Sparkles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                  {[...Array(12)].map((_, i) => (
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

                <p className="text-lg font-rounded text-blue-100 leading-relaxed relative z-10 italic">
                  {lullabyText}
                </p>
              </div>

              {/* Audio Player */}
              {audioUrl && !audioError && (
                <div className="relative bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-blue-900/40 backdrop-blur-sm border border-purple-300/30 rounded-3xl p-6 mb-8 glow-message">
                  {/* Glowing Waveforms */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                    {isPlayingAudio && (
                      <>
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute bg-purple-300/20 rounded-full animate-pulse"
                            style={{
                              width: `${Math.random() * 4 + 2}px`,
                              height: `${Math.random() * 20 + 10}px`,
                              left: `${15 + i * 10}%`,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              animationDelay: `${i * 0.1}s`,
                              animationDuration: `${0.5 + Math.random() * 0.5}s`
                            }}
                          />
                        ))}
                        
                        {/* Moon particles */}
                        {[...Array(6)].map((_, i) => (
                          <Moon
                            key={i}
                            size={8}
                            className="absolute text-blue-300/30 animate-pulse-gentle"
                            style={{
                              top: `${20 + Math.random() * 60}%`,
                              left: `${20 + Math.random() * 60}%`,
                              animationDelay: `${i * 0.3}s`
                            }}
                          />
                        ))}
                      </>
                    )}
                  </div>

                  <div className="relative z-10 flex items-center justify-center gap-4">
                    <button
                      onClick={toggleAudioPlayback}
                      className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/30 to-blue-500/30 backdrop-blur-sm border border-purple-300/40 rounded-full text-purple-200 font-cursive hover:from-purple-500/40 hover:to-blue-500/40 hover:border-purple-300/60 transition-all duration-300 glow-button"
                    >
                      {isPlayingAudio ? (
                        <>
                          <Pause size={18} />
                          Pause Lullaby
                        </>
                      ) : (
                        <>
                          <Play size={18} />
                          Play Lullaby
                        </>
                      )}
                    </button>
                    
                    {isPlayingAudio && (
                      <div className="flex items-center gap-2 text-purple-300/70">
                        <Volume2 size={16} className="animate-pulse" />
                        <span className="text-sm font-cursive">Playing...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Audio Generation Status */}
              {isGeneratingAudio && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-6 text-center">
                  <div className="flex items-center justify-center gap-3 text-purple-200">
                    <div className="w-4 h-4 border-2 border-purple-300/30 border-t-purple-300 rounded-full animate-spin"></div>
                    <span className="font-cursive">Creating your voice lullaby...</span>
                  </div>
                </div>
              )}

              {/* Audio Error Message */}
              {audioError && (
                <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-300/30 rounded-2xl p-4 mb-6 text-center">
                  <div className="flex items-center justify-center gap-2 text-yellow-200 mb-2">
                    <VolumeX size={16} />
                    <span className="font-cursive text-sm">Voice lullaby unavailable</span>
                  </div>
                  <p className="text-xs text-yellow-300/80 font-serif">
                    Your written lullaby is ready to comfort you
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <button
                  onClick={createAnotherLullaby}
                  className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm border border-blue-300/30 rounded-full text-blue-200 font-cursive hover:bg-white/20 hover:border-blue-300/50 transition-all duration-300"
                >
                  <Moon size={18} />
                  Create Another
                </button>
              </div>

              {/* Gentle Closing Message */}
              <p className="text-blue-300/70 font-cursive italic">
                "Rest now, dear soul. You are held in love and light."
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LullabyMode;