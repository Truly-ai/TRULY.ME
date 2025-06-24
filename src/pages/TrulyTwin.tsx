import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Send, Volume2, VolumeX, Sparkles, Star, Moon } from 'lucide-react';
import LoginButton from '../components/LoginButton';
import { sendChatMessage, ChatMessage } from '../services/openai';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  reactions?: string[];
}

function TrulyTwin() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const welcomeMessage = "Hi, I'm Truly Twin — your gentle space to feel, reflect, and be heard. You can tell me anything, anytime. I'm here to listen — no pressure, no judgment.";

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setMessages([{
          id: '1',
          text: welcomeMessage,
          isUser: false,
          timestamp: new Date()
        }]);
        setShowWelcome(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    // Add user message to UI
    setMessages(prev => [...prev, userMessage]);
    
    // Add to conversation history for OpenAI
    const newConversationHistory: ChatMessage[] = [
      ...conversationHistory,
      { role: 'user', content: inputText }
    ];
    setConversationHistory(newConversationHistory);
    
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      // Get response from OpenAI
      const aiResponse = await sendChatMessage(newConversationHistory);
      
      // Add AI response to conversation history
      const updatedHistory: ChatMessage[] = [
        ...newConversationHistory,
        { role: 'assistant', content: aiResponse }
      ];
      setConversationHistory(updatedHistory);

      // Add AI message to UI
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback message if something goes wrong
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now, but I want you to know that I'm here with you. Your feelings are valid, and you're not alone in this moment.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, reactions: [...(msg.reactions || []), emoji] }
        : msg
    ));
  };

  const sendHug = () => {
    const hugMessage: Message = {
      id: Date.now().toString(),
      text: "🫂 *sending you the warmest, most gentle hug* 🫂",
      isUser: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, hugMessage]);
  };

  const LoadingDots = () => (
    <div className="flex space-x-1">
      <Sparkles size={12} className="text-purple-300/60 animate-pulse" style={{animationDelay: '0s'}} />
      <Sparkles size={12} className="text-pink-300/60 animate-pulse" style={{animationDelay: '0.2s'}} />
      <Sparkles size={12} className="text-indigo-300/60 animate-pulse" style={{animationDelay: '0.4s'}} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-violet-950 relative overflow-hidden pt-24 flex flex-col">
      {/* Soft Dark Purple Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-indigo-900/50 to-violet-900/60 animate-gradient-shift"></div>
        
        {/* Gentle Twinkling Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <Star 
              key={i}
              size={Math.random() * 4 + 2} 
              className="absolute text-white/15 animate-pulse-gentle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Soft Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <Sparkles size={16} className="absolute top-1/4 left-1/6 text-pink-300/15 animate-pulse-slow" />
          <Moon size={20} className="absolute top-1/3 right-1/4 text-purple-300/20 animate-pulse-gentle" />
          <Star size={14} className="absolute bottom-1/3 left-1/4 text-indigo-300/15 animate-pulse-slow" />
        </div>

        {/* Gentle Mist */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-purple-300/8 to-transparent animate-mist-1"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-transparent via-indigo-300/6 to-transparent animate-mist-2"></div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {showWelcome && (
            <div className="flex justify-center">
              <div className="animate-pulse">
                <LoadingDots />
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`max-w-md px-6 py-4 rounded-3xl group ${
                message.isUser 
                  ? 'bg-gradient-to-r from-purple-500/40 to-pink-500/40 backdrop-blur-sm border border-purple-300/40 text-purple-100' 
                  : 'bg-white/15 backdrop-blur-sm border border-white/25 text-purple-50'
              } glow-message`}>
                <p className="font-rounded leading-relaxed">{message.text}</p>
                
                {/* Reactions */}
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {message.reactions.map((reaction, index) => (
                      <span key={index} className="text-sm">{reaction}</span>
                    ))}
                  </div>
                )}
                
                {/* Reaction Buttons for AI messages */}
                {!message.isUser && (
                  <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => addReaction(message.id, '💜')}
                      className="text-xs hover:scale-110 transition-transform duration-200"
                    >
                      💜
                    </button>
                    <button 
                      onClick={() => addReaction(message.id, '🌟')}
                      className="text-xs hover:scale-110 transition-transform duration-200"
                    >
                      🌟
                    </button>
                    <button 
                      onClick={() => addReaction(message.id, '🫂')}
                      className="text-xs hover:scale-110 transition-transform duration-200"
                    >
                      🫂
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white/15 backdrop-blur-sm border border-white/25 px-6 py-4 rounded-3xl">
                <LoadingDots />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white/5 backdrop-blur-sm border-t border-white/10">
          <div className="flex items-end gap-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's in your heart..."
                className="w-full px-6 py-4 bg-white/15 backdrop-blur-sm border border-white/25 rounded-3xl text-purple-100 placeholder-purple-300/60 font-rounded resize-none focus:outline-none focus:border-purple-300/50 focus:bg-white/20 transition-all duration-300 glow-input"
                rows={1}
                style={{ minHeight: '56px', maxHeight: '120px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
                disabled={isTyping}
              />
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="p-4 bg-gradient-to-r from-purple-500/40 to-pink-500/40 backdrop-blur-sm border border-purple-300/40 rounded-full text-purple-100 hover:from-purple-500/50 hover:to-pink-500/50 hover:border-purple-300/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-button group"
            >
              <Send size={20} className="group-hover:translate-x-0.5 transition-transform duration-300" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center gap-4 mt-4">
            <button 
              onClick={() => setInputText("I'm feeling overwhelmed today...")}
              className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full text-purple-200/80 text-sm hover:bg-white/15 hover:text-purple-100 transition-all duration-300"
              disabled={isTyping}
            >
              I'm overwhelmed
            </button>
            <button 
              onClick={() => setInputText("I need someone to listen...")}
              className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full text-purple-200/80 text-sm hover:bg-white/15 hover:text-purple-100 transition-all duration-300"
              disabled={isTyping}
            >
              Need to talk
            </button>
            <button 
              onClick={() => setInputText("I'm having a hard time...")}
              className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full text-purple-200/80 text-sm hover:bg-white/15 hover:text-purple-100 transition-all duration-300"
              disabled={isTyping}
            >
              Having a hard time
            </button>
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

export default TrulyTwin;