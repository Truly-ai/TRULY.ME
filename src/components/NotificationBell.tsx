import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true); // Mock unread state

  // Mock checking for unread notifications
  useEffect(() => {
    // In a real app, this would check actual notification state
    const checkUnread = () => {
      // Simulate having unread notifications
      setHasUnread(true);
    };

    checkUnread();
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-full text-purple-200 hover:bg-white/20 hover:border-purple-300/50 transition-all duration-300 glow-button group"
      >
        <Bell size={18} className="group-hover:animate-pulse" />
        
        {/* Unread Indicator */}
        {hasUnread && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-pulse glow-text">
            <div className="absolute inset-0 bg-pink-400 rounded-full animate-ping opacity-75"></div>
          </div>
        )}
      </button>

      <NotificationCenter 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}

export default NotificationBell;