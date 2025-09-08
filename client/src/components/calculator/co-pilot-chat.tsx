import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { apiRequest } from '@/lib/queryClient';
import { Bot, User, Send, Lightbulb, TrendingUp, Calculator } from 'lucide-react';
import type { AiMessage, CoPilotSession } from '@/types/carbon';

export function CoPilotChat() {
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      role: 'assistant',
      content: "👋 Welcome to CarbonCoPilot! I'm your AI-powered guide for carbon footprint calculations using the latest GHG Protocol 2025 standards.\n\nI'll help you:\n✅ Calculate Scope 1, 2, and 3 emissions accurately\n✅ Estimate missing data using industry benchmarks\n✅ Ensure full GHG Protocol compliance\n✅ Generate verified carbon reports\n✅ Identify reduction opportunities\n\nTo get started, could you tell me about your organization? What type of organization are you calculating for, and what industry are you in?",
      timestamp: new Date(),
      metadata: {
        suggestedActions: ['setup_organization', 'quick_estimate', 'detailed_calculation'],
        nextStep: 'organization_setup'
      }
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize conversation
  const startConversationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/copilot/start', {
        userId: 1, // Replace with actual user ID
      });
      return response.json();
    },
    onSuccess: (session: CoPilotSession) => {
      setSessionId(session.sessionId);
    },
  });

  // Send message to AI
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/copilot/message', {
        sessionId,
        message,
      });
      return response.json();
    },
    onSuccess: (response: { message: AiMessage }) => {
      setMessages(prev => [...prev, response.message]);
    },
  });

  // Initialize session on mount
  useEffect(() => {
    if (!sessionId) {
      startConversationMutation.mutate();
    }
  }, []);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !sessionId) return;

    const userMessage: AiMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    sendMessageMutation.mutate(inputMessage);
    setInputMessage('');
  };

  const handleSuggestedAction = (action: string) => {
    const actionMessages: Record<string, string> = {
      setup_organization: "I'd like to set up my organization profile for carbon calculation",
      quick_estimate: "Can you give me a quick emissions estimate for my organization?",
      detailed_calculation: "I want to do a detailed carbon footprint calculation",
      continue_calculation: "Let's continue with the calculation",
      generate_report: "I'd like to generate a carbon footprint report",
      explore_reductions: "Show me ways to reduce my carbon emissions",
    };

    const message = actionMessages[action] || action;
    setInputMessage(message);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Carbon Co-Pilot</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 dark:text-green-400">Online</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 mb-4 pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}>
                  <div className="flex items-start space-x-2">
                    {message.role === 'assistant' && (
                      <Bot className="w-5 h-5 mt-0.5 text-green-600" />
                    )}
                    {message.role === 'user' && (
                      <User className="w-5 h-5 mt-0.5 text-white" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </div>
                      {message.metadata?.calculationResult && (
                        <div className="mt-3 p-3 bg-white/10 rounded-lg">
                          <div className="text-xs font-medium mb-2">Calculation Result:</div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>Total: {message.metadata.calculationResult.total.toFixed(1)} tCO2e</div>
                            <div>Scope 1: {message.metadata.calculationResult.scope1.toFixed(1)} tCO2e</div>
                            <div>Scope 2: {message.metadata.calculationResult.scope2.toFixed(1)} tCO2e</div>
                            <div>Scope 3: {message.metadata.calculationResult.scope3.toFixed(1)} tCO2e</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {sendMessageMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-green-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Suggested Actions */}
        {messages[messages.length - 1]?.metadata?.suggestedActions && (
          <div className="mb-4">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Suggested actions:</div>
            <div className="flex flex-wrap gap-2">
              {messages[messages.length - 1].metadata!.suggestedActions!.map((action, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20"
                  onClick={() => handleSuggestedAction(action)}
                >
                  {action === 'setup_organization' && <User className="w-3 h-3 mr-1" />}
                  {action === 'quick_estimate' && <TrendingUp className="w-3 h-3 mr-1" />}
                  {action === 'detailed_calculation' && <Calculator className="w-3 h-3 mr-1" />}
                  {action === 'generate_report' && <Lightbulb className="w-3 h-3 mr-1" />}
                  {action.replace(/_/g, ' ')}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me about carbon calculations, data requirements, or industry benchmarks..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={sendMessageMutation.isPending || !sessionId}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || sendMessageMutation.isPending || !sessionId}
            size="sm"
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
