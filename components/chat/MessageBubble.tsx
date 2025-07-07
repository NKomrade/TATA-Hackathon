'use client';

import { Brain, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'} group`}>
      {isBot && (
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-blue-100 transition-all group-hover:scale-105">
          <Brain className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-sm transition-all duration-200 group-hover:shadow-md ${
        isBot 
          ? 'bg-white border border-slate-200/60 text-slate-800 rounded-tl-md' 
          : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-md shadow-blue-100'
      }`}>
        <p className="text-sm leading-relaxed font-medium">{message.text}</p>
        <p className={`text-xs mt-2 flex items-center gap-1 ${
          isBot ? 'text-slate-400' : 'text-blue-100'
        }`} suppressHydrationWarning>
          <span className="w-1 h-1 rounded-full bg-current opacity-60"></span>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
      
      {!isBot && (
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-slate-100 transition-all group-hover:scale-105">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;