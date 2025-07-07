'use client';

import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow = ({ messages }: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-96 overflow-y-auto p-6 space-y-6 bg-gradient-to-br from-slate-50/80 via-white to-blue-50/30 backdrop-blur-sm scrollbar-thin relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
      
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full relative z-10">
          <div className="text-center space-y-6 p-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <div className="w-10 h-10 bg-white/20 rounded-xl animate-pulse backdrop-blur-sm"></div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white animate-bounce"></div>
            </div>
            <div className="space-y-2">
              <p className="text-slate-700 font-medium text-lg">Welcome to AI Help Bot</p>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">Ask me anything about courses, admissions, or campus life. I'm here to help!</p>
            </div>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`animate-in slide-in-from-bottom-2 duration-300 [animation-delay:${index * 50}ms]`}
            >
              <MessageBubble message={message} />
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;