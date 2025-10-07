import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSageConversation } from '@/hooks/use-sage-conversation';
import { SageMessage } from './sage-message';
import { Send, Loader2, Mic, MicOff } from 'lucide-react';

interface SageChatProps {
  eventType?: string;
  onDataExtracted?: (data: any) => void;
}

export interface SageChatRef {
  sendMessage: (message: string) => void;
}

export const SageChat = forwardRef<SageChatRef, SageChatProps>(
  ({ eventType, onDataExtracted }, ref) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const {
    messages,
    isLoading,
    isStreaming,
    sendMessage,
    extractedData,
    completionPercentage
  } = useSageConversation(eventType);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      });
    }
  }, [messages, isStreaming]);

  // Notify parent when data is extracted
  useEffect(() => {
    if (extractedData && onDataExtracted) {
      onDataExtracted(extractedData);
    }
  }, [extractedData, onDataExtracted]);

  // Expose sendMessage to parent through ref
  useImperativeHandle(ref, () => ({
    sendMessage: async (message: string) => {
      await sendMessage(message);
    }
  }));

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoiceInput = async () => {
    console.log('🎤 Microphone button clicked! isRecording:', isRecording);

    if (isRecording) {
      // Stop recording
      console.log('Stopping recording...');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error('Error stopping recognition:', e);
        }
      }
      setIsRecording(false);
      return;
    }

    // Check browser support
    const hasSupport = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    console.log('Browser speech recognition support:', hasSupport);

    if (!hasSupport) {
      alert('⚠️ Speech recognition is not supported in this browser.\n\nPlease use:\n• Chrome\n• Edge\n• Safari');
      return;
    }

    try {
      // Request microphone permission first
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (permError) {
        console.error('Microphone permission denied:', permError);
        alert('🎤 Microphone access is required.\n\nPlease allow microphone access and try again.');
        return;
      }

      console.log('Creating speech recognition instance...');
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('✅ Speech recognition started - speak now!');
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const results = event.results;
        const lastResult = results[results.length - 1];
        const transcript = lastResult[0].transcript;
        console.log('📝 Transcript received:', transcript, 'Final:', lastResult.isFinal);

        // Update input with transcript
        setInput(transcript);

        // If final result, stop automatically
        if (lastResult.isFinal) {
          recognition.stop();
        }
      };

      recognition.onerror = (event: any) => {
        console.error('❌ Speech recognition error:', event.error);
        setIsRecording(false);

        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          alert('🎤 Microphone access denied.\n\nPlease allow microphone access in your browser settings and try again.');
        } else if (event.error === 'no-speech') {
          console.log('No speech detected - automatically stopped');
        } else if (event.error === 'aborted') {
          console.log('Recognition aborted');
        } else {
          alert(`Speech recognition error: ${event.error}\n\nPlease try again.`);
        }
      };

      recognition.onend = () => {
        console.log('🛑 Speech recognition ended');
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      console.log('Starting recognition...');
      recognition.start();
    } catch (error) {
      console.error('Error creating speech recognition:', error);
      setIsRecording(false);
      alert('Failed to start speech recognition.\n\nPlease make sure you\'re using Chrome, Edge, or Safari and try again.');
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center text-xl">
            🌱
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Sage</h3>
            <p className="text-sm text-slate-400">Your Carbon Calculator Co-Pilot</p>
          </div>
        </div>

        {/* Progress Indicator */}
        {completionPercentage > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Event Data Collection</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-violet-500 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <SageMessage
              key={index}
              message={message}
              isStreaming={isStreaming && index === messages.length - 1}
            />
          ))}

          {isLoading && messages.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-6 border-t border-slate-700/50">
        <div className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tell me about your event..."
            disabled={isLoading || isRecording}
            className="flex-1 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500"
          />
          <Button
            onClick={toggleVoiceInput}
            disabled={isLoading}
            className={`px-4 ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-slate-700 hover:bg-slate-600'
            } text-white`}
          >
            {isRecording ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Quick Suggestions */}
        {messages.length === 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setInput("It's a 3-day music festival with about 5,000 attendees")}
              className="text-xs px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-full hover:bg-slate-700 transition-colors"
            >
              Music Festival
            </button>
            <button
              onClick={() => setInput("Corporate conference for 200 people, 2 days")}
              className="text-xs px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-full hover:bg-slate-700 transition-colors"
            >
              Conference
            </button>
            <button
              onClick={() => setInput("Wedding with 150 guests, outdoor venue")}
              className="text-xs px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-full hover:bg-slate-700 transition-colors"
            >
              Wedding
            </button>
          </div>
        )}
      </div>
    </Card>
  );
});

SageChat.displayName = 'SageChat';
