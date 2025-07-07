'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import ChatWindow from '@/components/chat/ChatWindow';
import { Message } from '@/components/chat/ChatWindow';
import MessageInput from '@/components/chat/MessageInput';
import KnowledgeGraphView from '@/components/knowledge-graph/KnowlegdeGraphView';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Brain, MessageSquare } from 'lucide-react';

export default function HomePage() {
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [showKnowledgeGraph, setShowKnowledgeGraph] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI Help Bot. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: messages.length + 1,
      text,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages([...messages, newMessage]);
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "I understand your question. Let me search through our knowledge graph to find the most relevant information for you.",
        sender: 'bot' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Chat Interface */}
          <div className="flex-1 space-y-6">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-4xl font-bold text-slate-800">AI Help Bot</h1>
              </div>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Get instant answers powered by our comprehensive knowledge graph. 
                Ask questions about admissions, courses, events, and more.
              </p>
            </div>

            {/* Query Topic Filter */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-slate-700">Select Query Topic:</span>
              </div>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Topics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admissions">Admissions</SelectItem>
                  <SelectItem value="courses">Courses</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="facilities">Facilities</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Chat Window */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <ChatWindow messages={messages} />
              <MessageInput onSendMessage={handleSendMessage} />
            </div>
          </div>

          {/* Knowledge Graph Panel */}
          <div className="lg:w-80">
            <div className="sticky top-8 space-y-4">
              <Button
                onClick={() => setShowKnowledgeGraph(!showKnowledgeGraph)}
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <Brain className="w-4 h-4" />
                {showKnowledgeGraph ? 'Hide' : 'Show'} Knowledge Graph
              </Button>
              
              {showKnowledgeGraph && (
                <div className="bg-white rounded-lg shadow-lg border border-slate-200">
                  <KnowledgeGraphView />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}