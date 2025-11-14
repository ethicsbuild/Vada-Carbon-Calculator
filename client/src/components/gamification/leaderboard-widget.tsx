import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronUp, ChevronDown } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  isCurrentUser?: boolean;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Lightning in a Bottle', score: 0.028 },
  { rank: 4, name: 'Your Event', score: 0.042, isCurrentUser: true },
  { rank: 5, name: 'Desert Hearts', score: 0.045 }
];

export function LeaderboardWidget() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(true); // Start minimized by default

  if (!isOpen) return null;

  return (
    <Card className={`fixed bottom-8 right-8 bg-forest-50 dark:bg-forest-800/90 border-emerald-500/30 backdrop-blur-lg shadow-2xl hidden lg:block transition-all duration-300 ${
      isMinimized ? 'w-auto' : 'w-80'
    }`}>
      {isMinimized ? (
        // Minimized state - just a compact button
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 p-3 hover:bg-slate-700/30 transition-colors rounded-xl"
        >
          <span className="text-xl">🏆</span>
          <ChevronDown className="h-3 w-3 text-sage-600 dark:text-sage-400" />
        </button>
      ) : (
        // Expanded state
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <h3 className="text-lg font-semibold text-forest-900 dark:text-forest-50">Festival Leaderboard</h3>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-6 w-6 p-0 hover:bg-slate-700/50"
              >
                <ChevronUp className="h-4 w-4 text-sage-600 dark:text-sage-400" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 hover:bg-slate-700/50"
              >
                <X className="h-4 w-4 text-sage-600 dark:text-sage-400" />
              </Button>
            </div>
          </div>

          {/* Leaderboard Items */}
          <div className="space-y-3">
            {mockLeaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  entry.isCurrentUser
                    ? 'bg-emerald-500/20 border border-emerald-500/30'
                    : 'bg-slate-700/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-emerald-400">#{entry.rank}</span>
                  <span className="text-sm text-forest-900 dark:text-forest-50">{entry.name}</span>
                </div>
                <span className="text-xs text-sage-600 dark:text-sage-400">{entry.score} t/person</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
