import { Card } from '@/components/ui/card';

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
  return (
    <Card className="fixed bottom-8 right-8 w-80 bg-slate-800/90 border-emerald-500/30 backdrop-blur-lg shadow-2xl p-6 hidden lg:block">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🏆</span>
        <h3 className="text-lg font-semibold text-white">Festival Leaderboard</h3>
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
              <span className="text-sm text-white">{entry.name}</span>
            </div>
            <span className="text-xs text-slate-400">{entry.score} t/person</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
