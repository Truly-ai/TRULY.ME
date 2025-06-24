import React, { useState, useEffect } from 'react';
import { Bell, X, Heart, Moon, Sparkles, Star, MessageCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'wording' | 'ritual' | 'interaction';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Mock notifications for demo
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'wording',
        title: 'Daily Wording',
        message: 'Your future self whispers: "Trust the process of becoming. Every breath is a new beginning."',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isRead: false,
        icon: Heart
      },
      {
        id: '2',
        type: 'ritual',
        title: 'Lullaby Reminder',
        message: 'The stars are calling for your evening ritual. Time to let your soul rest.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isRead: false,
        icon: Moon
      },
      {
        id: '3',
        type: 'interaction',
        title: 'Secret Garden',
        message: 'Someone sent a soft note to your planted thought. Your flower is blooming! 🌸',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        isRead: true,
        icon: Sparkles
      },
      {
        id: '4',
        type: 'interaction',
        title: 'Truly Twin',
        message: 'Your conversation thread is ready for you whenever you need to reconnect.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        isRead: true,
        icon: MessageCircle
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'wording': return 'from-pink-500/20 to-rose-500/20 border-pink-300/30';
      case 'ritual': return 'from-blue-500/20 to-indigo-500/20 border-blue-300/30';
      case 'interaction': return 'from-purple-500/20 to-indigo-500/20 border-purple-300/30';
      default: return 'from-gray-500/20 to-slate-500/20 border-gray-300/30';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>

      {/* Notification Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-br from-indigo-950/95 via-purple-950/95 to-blue-950/95 backdrop-blur-lg border-l border-purple-300/30 shadow-2xl z-50 animate-slide-in-right overflow-y-auto">
        {/* Floating Sparkles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
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

        {/* Header */}
        <div className="relative z-10 p-6 border-b border-purple-300/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-cursive text-purple-100 glow-text">Gentle Whispers</h2>
            <button
              onClick={onClose}
              className="p-2 text-purple-300/70 hover:text-purple-200 hover:bg-white/10 rounded-full transition-all duration-300"
            >
              <X size={20} />
            </button>
          </div>
          
          {notifications.some(n => !n.isRead) && (
            <button
              onClick={markAllAsRead}
              className="text-sm font-cursive text-purple-300/80 hover:text-purple-200 transition-colors duration-300"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="relative z-10 p-6 space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Star size={48} className="mx-auto mb-4 text-purple-300/40 animate-pulse-gentle" />
              <p className="text-purple-200/60 font-serif">Your whispers will appear here...</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`relative p-4 bg-gradient-to-r ${getNotificationColor(notification.type)} backdrop-blur-sm border rounded-2xl cursor-pointer hover:scale-[1.02] transition-all duration-300 glow-message ${
                  !notification.isRead ? 'animate-bounce-gentle' : ''
                }`}
              >
                {/* Unread Indicator */}
                {!notification.isRead && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                )}

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-2 bg-white/10 rounded-full">
                    <notification.icon size={20} className="text-purple-200" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-cursive text-purple-100 mb-1">{notification.title}</h3>
                    <p className="text-sm text-purple-200/80 font-serif leading-relaxed mb-2">
                      {notification.message}
                    </p>
                    <span className="text-xs text-purple-300/60 font-rounded">
                      {getTimeAgo(notification.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="relative z-10 p-6 border-t border-purple-300/20">
          <p className="text-center text-sm font-cursive text-purple-300/70 italic">
            "Every whisper carries love..."
          </p>
        </div>
      </div>
    </>
  );
}

export default NotificationCenter;