import { useState, useEffect, useCallback, useRef } from 'react';

export interface QuickReply {
  label: string;
  value: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ExtractedEventData {
  eventType?: string;
  attendance?: number;
  duration?: {
    days: number;
    hoursPerDay: number;
  };
  venue?: {
    type: string;
    location?: string;
    isOutdoor?: boolean;
  };
  power?: {
    source: 'grid' | 'generator' | 'hybrid' | 'renewable';
  };
  catering?: {
    style: string;
    mealCount: number;
    dietaryMix?: string;
  };
  transportation?: {
    primaryMode: string;
    distance?: number;
  };
  materialItems?: Array<{
    description: string;
    quantity?: number;
    unit?: string;
  }>;
}

export function useSageConversation(eventType?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedEventData | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [carbonCalculation, setCarbonCalculation] = useState<any>(null);

  const wsRef = useRef<WebSocket | null>(null);

  // Initialize conversation with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      role: 'assistant',
      content: eventType
        ? `Hey! I'm Sage Riverstone. I see you're planning a ${eventType}. That's exciting! Let's figure out the carbon footprint together. Tell me a bit about it - how many people are you expecting?`
        : "Hey friend, I'm Sage Riverstone. Tell me about your event and I'll help you understand its carbon footprint with clarity and actionable steps.",
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
  }, [eventType]);

  // Connect to WebSocket
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return wsRef.current;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/chat`);

    ws.onopen = () => {
      console.log('Sage WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'stream') {
        // Streaming chunk
        setIsStreaming(true);
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.role === 'assistant' && !lastMessage.timestamp) {
            // Update streaming message
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, content: lastMessage.content + data.content }
            ];
          } else {
            // Start new streaming message
            return [...prev, { role: 'assistant', content: data.content, timestamp: undefined as any }];
          }
        });
      } else if (data.type === 'complete') {
        // Stream complete
        setIsStreaming(false);
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          return [
            ...prev.slice(0, -1),
            { ...lastMessage, timestamp: new Date() }
          ];
        });

        // Update extracted data and progress
        if (data.extractedData) {
          setExtractedData(data.extractedData);
        }
        if (data.completionPercentage !== undefined) {
          setCompletionPercentage(data.completionPercentage);
        }
        if (data.conversationId) {
          setConversationId(data.conversationId);
        }
        if (data.quickReplies) {
          setQuickReplies(data.quickReplies);
        }
        if (data.carbonCalculation) {
          setCarbonCalculation(data.carbonCalculation);
          console.log('🌍 Carbon footprint calculated:', data.carbonCalculation);
        }

        setIsLoading(false);
      } else if (data.type === 'error') {
        setIsStreaming(false);
        setIsLoading(false);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: "I'm having trouble right now. Could you try rephrasing that?",
            timestamp: new Date()
          }
        ]);
      }
    };

    ws.onerror = (error) => {
      console.error('Sage WebSocket error:', error);
      setIsStreaming(false);
      setIsLoading(false);
    };

    ws.onclose = () => {
      console.log('Sage WebSocket disconnected');
      wsRef.current = null;
    };

    wsRef.current = ws;
    return ws;
  }, []);

  // Send message to Sage
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Clear quick replies when user sends a message
    setQuickReplies([]);

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Connect WebSocket if needed
    const ws = connectWebSocket();

    // Wait for connection
    if (ws.readyState === WebSocket.CONNECTING) {
      await new Promise((resolve) => {
        ws.addEventListener('open', resolve, { once: true });
      });
    }

    // Send message
    ws.send(JSON.stringify({
      type: 'message',
      content: content.trim(),
      conversationId,
      eventType,
      extractedData
    }));
  }, [conversationId, eventType, extractedData, connectWebSocket]);

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    messages,
    isLoading,
    isStreaming,
    sendMessage,
    extractedData,
    completionPercentage,
    conversationId,
    quickReplies,
    carbonCalculation
  };
}
