import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface SageMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export function SageMessage({ message, isStreaming }: SageMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex gap-3 max-w-[80%]", isUser && "flex-row-reverse")}>
        {/* Avatar */}
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center text-lg flex-shrink-0">
            🌱
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 relative",
            isUser
              ? "bg-emerald-500 text-forest-900 dark:text-forest-50"
              : "bg-slate-700/50 text-forest-800 dark:text-forest-100"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

          {/* Streaming Indicator */}
          {isStreaming && (
            <div className="inline-flex ml-1">
              <span className="w-1 h-4 bg-emerald-400 animate-pulse inline-block" />
            </div>
          )}

          {/* Timestamp */}
          {message.timestamp && (
            <p className="text-xs opacity-60 mt-1">
              {message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
