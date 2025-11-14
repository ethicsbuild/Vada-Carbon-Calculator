import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, ArrowRight, MessageCircle } from 'lucide-react';
import { EventFormCalculator } from './event-form-calculator';

interface SageMessage {
  role: 'sage' | 'user';
  content: string;
  timestamp: Date;
}

interface SageGuidedCalculatorProps {
  initialEventType?: string;
}

export function SageGuidedCalculator({ initialEventType }: SageGuidedCalculatorProps) {
  const [messages, setMessages] = useState<SageMessage[]>([]);
  const [currentSection, setCurrentSection] = useState<string>('welcome');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    containerRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, []);

  // Connect to Sage WebSocket
  useEffect(() => {
    connectToSage();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const connectToSage = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/chat`;

    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('🟢 Connected to Sage');
      setIsConnected(true);

      // Send initial context message
      const contextMessage = {
        type: 'context',
        eventType: initialEventType,
        mode: 'guided-calculator',
        message: 'I\'m ready to calculate my event\'s carbon footprint. Guide me through the process.'
      };

      socket.send(JSON.stringify(contextMessage));

      // Add welcome message from Sage
      addSageMessage(getWelcomeMessage(initialEventType));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.response) {
          addSageMessage(data.response);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    socket.onclose = () => {
      console.log('🔴 Disconnected from Sage');
      setIsConnected(false);
      // Could auto-reconnect here
    };

    setWs(socket);
  };

  const addSageMessage = (content: string) => {
    setMessages(prev => [...prev, {
      role: 'sage',
      content,
      timestamp: new Date()
    }]);
  };

  const getWelcomeMessage = (eventType?: string) => {
    if (eventType === 'festival') {
      return "Hey friend! 🎪 Ready to calculate your festival's footprint? I'll walk you through this step by step. First things first—let me know the basics: how many souls are we expecting, and how many days of magic are we creating?";
    } else if (eventType === 'conference') {
      return "Hey there! 💼 Let's figure out the carbon footprint for your conference. Don't worry, I'll guide you through each section. We'll start with the basics—how many attendees and how long is the event?";
    } else if (eventType === 'wedding') {
      return "Congratulations! 💍 Let's make sure your celebration is as sustainable as it is beautiful. I'll help you calculate the footprint and find ways to reduce it. First up: guest count and event duration?";
    } else if (eventType === 'concert') {
      return "Rock on! 🎸 Let's calculate the carbon footprint for your show. I'll be right here to explain each field and give you tips. Ready to start with attendance and duration?";
    }

    return "Hey friend! 👋 I'm Sage, and I'm here to help you calculate your event's carbon footprint. I'll guide you through each section, explain what everything means, and give you tips along the way. Let's do this together!";
  };

  const sendContextualMessage = (section: string, action: string, data?: any) => {
    if (!ws || !isConnected) return;

    const contextMessage = {
      type: 'context-update',
      section,
      action,
      data
    };

    ws.send(JSON.stringify(contextMessage));
  };

  // Send contextual tips as user progresses
  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    sendContextualMessage(section, 'entered', {});
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div ref={containerRef} className="grid lg:grid-cols-2 gap-6 h-full">
      {/* Sage's Guidance Column */}
      <div className="order-2 lg:order-1 lg:sticky lg:top-4 lg:self-start">
        <Card className="bg-forest-100 dark:bg-forest-800/50 border-forest-300 dark:border-forest-700/50 backdrop-blur-sm flex flex-col lg:max-h-[calc(100vh-2rem)]">
          {/* Header */}
          <div className="p-4 border-b border-forest-300 dark:border-forest-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-forest-400 to-violet-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-forest-900 dark:text-forest-100" />
              </div>
              <div>
                <h3 className="font-bold text-forest-900 dark:text-forest-100 text-lg">Sage Riverstone</h3>
                <p className="text-sm text-sage-600 dark:text-sage-400 flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                  {isConnected ? 'Here to guide you' : 'Reconnecting...'}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className="flex gap-3">
                  {message.role === 'sage' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-forest-400 to-violet-400 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-forest-900 dark:text-forest-100" />
                    </div>
                  )}
                  <div className={`flex-1 ${message.role === 'user' ? 'ml-10' : ''}`}>
                    <div className={`rounded-xl p-3 ${
                      message.role === 'sage'
                        ? 'bg-sage-50 dark:bg-sage-900/50 text-forest-700 dark:text-forest-200'
                        : 'bg-forest-500/20 text-emerald-100'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                    <p className="text-xs text-sage-500 dark:text-sage-500 mt-1 ml-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Tips Section */}
          <div className="p-4 border-t border-forest-300 dark:border-forest-700/50 bg-sage-50 dark:bg-sage-900/30">
            <div className="flex items-start gap-2">
              <MessageCircle className="w-4 h-4 text-forest-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-sage-600 dark:text-sage-400">
                <p className="font-semibold text-forest-400 mb-1">💡 Pro tip</p>
                <p>
                  {currentSection === 'welcome' && "Start by filling out your event basics on the right. I'll explain each field as you go!"}
                  {currentSection === 'transportation' && "Transportation is usually the biggest source of emissions—60-80% of your footprint. Focus here for maximum impact!"}
                  {currentSection === 'staff-transportation' && "Break down staff by how they travel. Local crew driving vs. out-of-state crew flying makes a huge difference!"}
                  {currentSection === 'artist-transportation' && "Artists often have the longest travel distances. Consider offering ground transport incentives for shorter trips."}
                  {currentSection === 'equipment-transportation' && "Production trucks add up fast. Can you consolidate loads or source equipment locally?"}
                  {currentSection === 'energy' && "Solar + battery is the sweet spot. It's quieter AND cleaner than diesel generators."}
                  {currentSection === 'food' && "Local food can cut emissions by 30-60%. Plus, it tastes better and supports your community!"}
                  {currentSection === 'complete' && "Awesome work! You can save this calculation to track year-over-year progress."}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Form Column */}
      <div className="order-1 lg:order-2">
        <EventFormCalculator
          initialEventType={initialEventType}
          onSectionChange={handleSectionChange}
        />
      </div>
    </div>
  );
}
