import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Sparkles, Star, Plus, RotateCcw, Send } from 'lucide-react';
import LoginButton from '../components/LoginButton';
import { sendChatMessage, ChatMessage } from '../services/openai';

interface MindMapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  connections: string[];
  isCenter?: boolean;
}

interface Connection {
  from: string;
  to: string;
  opacity: number;
}

function AIMindMap() {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState('');
  const [nodes, setNodes] = useState<MindMapNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showInput, setShowInput] = useState(true);

  const nodeColors = [
    'from-pink-400/60 to-rose-500/60',
    'from-purple-400/60 to-indigo-500/60',
    'from-blue-400/60 to-cyan-500/60',
    'from-green-400/60 to-emerald-500/60',
    'from-yellow-400/60 to-orange-500/60',
    'from-indigo-400/60 to-purple-500/60'
  ];

  const generateMindMap = async () => {
    if (!userInput.trim() || isGenerating) return;

    setIsGenerating(true);
    setShowInput(false);

    try {
      const prompt = `Create a mind map based on this thought: "${userInput}". 
      
      Return exactly 6-7 related concepts or ideas that branch from this central thought. Each should be 1-3 words maximum. 
      
      Format your response as a simple list, one concept per line, like:
      Self-care
      Boundaries
      Growth
      Healing
      etc.
      
      Make the concepts emotionally resonant and meaningful for personal reflection.`;

      const messages: ChatMessage[] = [
        { role: 'user', content: prompt }
      ];

      const response = await sendChatMessage(messages);
      
      // Parse the response into individual concepts
      const concepts = response
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.includes(':') && line.length < 20)
        .slice(0, 6);

      // Create center node
      const centerNode: MindMapNode = {
        id: 'center',
        text: userInput.length > 15 ? userInput.substring(0, 15) + '...' : userInput,
        x: 50,
        y: 50,
        color: 'from-pink-500/80 to-purple-500/80',
        connections: [],
        isCenter: true
      };

      // Create surrounding nodes in a circle
      const surroundingNodes: MindMapNode[] = concepts.map((concept, index) => {
        const angle = (index * 360) / concepts.length;
        const radius = 35;
        const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
        const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

        return {
          id: `node-${index}`,
          text: concept,
          x: Math.max(10, Math.min(90, x)),
          y: Math.max(10, Math.min(90, y)),
          color: nodeColors[index % nodeColors.length],
          connections: ['center']
        };
      });

      // Create connections
      const newConnections: Connection[] = surroundingNodes.map(node => ({
        from: 'center',
        to: node.id,
        opacity: 0.4 + Math.random() * 0.3
      }));

      // Add some random connections between surrounding nodes
      for (let i = 0; i < Math.min(2, surroundingNodes.length - 1); i++) {
        const from = surroundingNodes[i];
        const to = surroundingNodes[(i + 1) % surroundingNodes.length];
        newConnections.push({
          from: from.id,
          to: to.id,
          opacity: 0.2 + Math.random() * 0.2
        });
      }

      setNodes([centerNode, ...surroundingNodes]);
      setConnections(newConnections);

    } catch (error) {
      console.error('Error generating mind map:', error);
      
      // Fallback mind map
      const fallbackConcepts = ['Reflection', 'Growth', 'Peace', 'Clarity', 'Hope', 'Strength'];
      const centerNode: MindMapNode = {
        id: 'center',
        text: userInput.length > 15 ? userInput.substring(0, 15) + '...' : userInput,
        x: 50,
        y: 50,
        color: 'from-pink-500/80 to-purple-500/80',
        connections: [],
        isCenter: true
      };

      const surroundingNodes: MindMapNode[] = fallbackConcepts.map((concept, index) => {
        const angle = (index * 360) / fallbackConcepts.length;
        const radius = 35;
        const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
        const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

        return {
          id: `node-${index}`,
          text: concept,
          x: Math.max(10, Math.min(90, x)),
          y: Math.max(10, Math.min(90, y)),
          color: nodeColors[index % nodeColors.length],
          connections: ['center']
        };
      });

      const newConnections: Connection[] = surroundingNodes.map(node => ({
        from: 'center',
        to: node.id,
        opacity: 0.4
      }));

      setNodes([centerNode, ...surroundingNodes]);
      setConnections(newConnections);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearMindMap = () => {
    setNodes([]);
    setConnections([]);
    setUserInput('');
    setShowInput(true);
  };

  const addAnotherThought = () => {
    setShowInput(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950 relative overflow-hidden">
      {/* Login Button */}
      <div className="absolute top-6 right-6 z-20">
        <LoginButton />
      </div>

      {/* Constellation Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-blue-900/40 animate-gradient-shift"></div>
        
        {/* Twinkling Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(100)].map((_, i) => (
            <Star 
              key={i}
              size={Math.random() * 2 + 1} 
              className="absolute text-white/20 animate-pulse-gentle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Floating Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <Sparkles 
              key={i}
              size={Math.random() * 6 + 4} 
              className="absolute text-white/10 animate-pulse-slow"
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
          onClick={() => navigate('/truly-space')}
          className="flex items-center gap-3 text-purple-200 hover:text-purple-100 transition-colors duration-300 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-serif">Back to Truly Space</span>
        </button>

        <h1 className="text-2xl font-cursive text-blue-200 glow-text">Your Mind, Illuminated</h1>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-88px)] p-8">
        <div className="max-w-6xl mx-auto w-full">
          
          {/* Initial Input or Mind Map Display */}
          {showInput && nodes.length === 0 ? (
            /* Input Form */
            <div className="text-center animate-fade-in">
              <div className="relative inline-block mb-12">
                <Brain size={80} className="text-blue-300/60 animate-pulse-slow" />
                <div className="absolute inset-0 rounded-full bg-blue-300/10 blur-2xl animate-pulse-gentle"></div>
                
                {/* Orbiting sparkles around brain */}
                <div className="absolute inset-0 animate-spin-slow">
                  {[...Array(8)].map((_, i) => (
                    <Sparkles
                      key={i}
                      size={8}
                      className="absolute text-blue-300/40 animate-pulse-gentle"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                        animationDelay: `${i * 0.3}s`
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <h2 className="text-3xl font-cursive text-blue-200 mb-8 glow-text">
                Share a thought, and watch it bloom into a constellation of ideas
              </h2>
              
              <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm border border-blue-300/30 rounded-3xl p-8 glow-message">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="What's on your mind? Share a feeling, dream, worry, or idea..."
                  className="w-full h-32 px-6 py-4 bg-white/10 backdrop-blur-sm border border-blue-300/20 rounded-2xl text-blue-100 placeholder-blue-300/60 font-serif resize-none focus:outline-none focus:border-blue-300/50 focus:bg-white/15 transition-all duration-300 glow-input"
                />

                <button
                  onClick={generateMindMap}
                  disabled={!userInput.trim() || isGenerating}
                  className="w-full mt-6 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm border border-blue-300/40 rounded-2xl text-blue-100 font-cursive text-lg hover:from-blue-500/40 hover:to-purple-500/40 hover:border-blue-300/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-button"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-blue-300/30 border-t-blue-300 rounded-full animate-spin"></div>
                      Illuminating your thoughts...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Create Mind Map
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Mind Map Display */
            <div className="w-full h-[600px] relative animate-fade-in">
              {/* SVG Mind Map */}
              <div className="w-full h-full bg-gradient-to-br from-indigo-950/50 to-purple-950/50 rounded-3xl border border-blue-300/20 relative overflow-hidden glow-message">
                {/* Background constellation effect */}
                <div className="absolute inset-0">
                  {[...Array(30)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse-gentle"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>

                {/* SVG for connections and nodes */}
                <svg className="absolute inset-0 w-full h-full">
                  {/* Connection Lines */}
                  {connections.map((connection, index) => {
                    const fromNode = nodes.find(n => n.id === connection.from);
                    const toNode = nodes.find(n => n.id === connection.to);
                    
                    if (!fromNode || !toNode) return null;
                    
                    return (
                      <line
                        key={index}
                        x1={`${fromNode.x}%`}
                        y1={`${fromNode.y}%`}
                        x2={`${toNode.x}%`}
                        y2={`${toNode.y}%`}
                        stroke="rgba(168, 85, 247, 0.4)"
                        strokeWidth="2"
                        opacity={connection.opacity}
                        className="animate-pulse-gentle"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      />
                    );
                  })}
                </svg>

                {/* Floating Nodes */}
                {nodes.map((node, index) => (
                  <div
                    key={node.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 animate-fade-in ${
                      node.isCenter ? 'animate-pulse-gentle' : 'animate-pulse-slow'
                    }`}
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      animationDelay: `${index * 0.3}s`
                    }}
                  >
                    {/* Node Glow */}
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${node.color} blur-lg opacity-60 ${
                      node.isCenter ? 'w-24 h-24' : 'w-20 h-20'
                    } animate-pulse-slow`}></div>
                    
                    {/* Node Content */}
                    <div className={`relative bg-gradient-to-r ${node.color} backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-center ${
                      node.isCenter ? 'w-20 h-20' : 'w-16 h-16'
                    } glow-button group hover:scale-110 transition-all duration-300`}>
                      <span className={`text-white font-cursive ${
                        node.isCenter ? 'text-sm' : 'text-xs'
                      } px-2 leading-tight group-hover:glow-text transition-all duration-300`}>
                        {node.text}
                      </span>
                    </div>

                    {/* Floating sparkles around nodes */}
                    {node.isCenter && (
                      <div className="absolute inset-0 animate-spin-slow">
                        {[...Array(6)].map((_, i) => (
                          <Sparkles
                            key={i}
                            size={6}
                            className="absolute text-white/40 animate-pulse-gentle"
                            style={{
                              top: `${-10 + Math.sin(i * 60 * Math.PI / 180) * 40}px`,
                              left: `${-10 + Math.cos(i * 60 * Math.PI / 180) * 40}px`,
                              animationDelay: `${i * 0.2}s`
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={addAnotherThought}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-300/30 rounded-full text-blue-200 font-cursive hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-300/50 transition-all duration-300 glow-button"
                >
                  <Plus size={18} />
                  Add Another Thought
                </button>
                
                <button
                  onClick={clearMindMap}
                  className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-purple-200 font-cursive hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                >
                  <RotateCcw size={18} />
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Gentle Footer Message */}
          <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <p className="text-lg font-cursive text-blue-300/70 italic">
              "Every thought is a star in the constellation of your mind..."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIMindMap;