import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Award, Target, TrendingUp, Star, Lock } from 'lucide-react';

export function AchievementBadges() {
  // Mock achievements data - in real app this would come from API
  const achievements = [
    {
      id: 1,
      type: 'first_calculation',
      title: 'Carbon Pioneer',
      description: 'Completed your first carbon footprint calculation',
      icon: 'trophy',
      unlocked: true,
      unlockedAt: new Date('2024-01-15'),
      rarity: 'common'
    },
    {
      id: 2,
      type: 'scope3_master',
      title: 'Scope 3 Master',
      description: 'Completed comprehensive Scope 3 emissions calculation',
      icon: 'award',
      unlocked: false,
      rarity: 'rare'
    },
    {
      id: 3,
      type: 'trend_tracker',
      title: 'Trend Tracker',
      description: 'Tracked carbon emissions over multiple periods',
      icon: 'trending_up',
      unlocked: false,
      rarity: 'epic'
    },
    {
      id: 4,
      type: 'reduction_champion',
      title: 'Reduction Champion',
      description: 'Achieved 25% reduction in carbon footprint',
      icon: 'target',
      unlocked: false,
      rarity: 'legendary'
    },
    {
      id: 5,
      type: 'blockchain_verified',
      title: 'Blockchain Pioneer',
      description: 'Generated your first blockchain-verified carbon receipt',
      icon: 'star',
      unlocked: false,
      rarity: 'rare'
    },
    {
      id: 6,
      type: 'api_integration',
      title: 'Tech Integrator',
      description: 'Integrated CarbonCoPilot with external systems',
      icon: 'star',
      unlocked: false,
      rarity: 'epic'
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return Trophy;
      case 'award': return Award;
      case 'trending_up': return TrendingUp;
      case 'target': return Target;
      case 'star': return Star;
      default: return Trophy;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 border-gray-300';
      case 'rare': return 'text-blue-600 border-blue-300';
      case 'epic': return 'text-purple-600 border-purple-300';
      case 'legendary': return 'text-yellow-600 border-yellow-300';
      default: return 'text-gray-600 border-gray-300';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = (unlockedCount / totalCount) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
            Achievements
          </div>
          <Badge variant="outline">
            {unlockedCount}/{totalCount}
          </Badge>
        </CardTitle>
        <div className="text-sm text-gray-600 dark:text-sage-600 dark:text-sage-400">
          {completionPercentage.toFixed(0)}% Complete
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {achievements.slice(0, 6).map((achievement) => {
            const Icon = getIcon(achievement.icon);
            const rarityColor = getRarityColor(achievement.rarity);
            const rarityBg = getRarityBg(achievement.rarity);

            return (
              <div key={achievement.id} className="text-center group">
                <div className={`
                  relative w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center
                  ${achievement.unlocked 
                    ? `bg-gradient-to-br ${rarityBg} shadow-lg` 
                    : 'bg-gray-300 dark:bg-gray-600'
                  }
                  ${achievement.unlocked ? 'cursor-pointer hover:scale-105' : ''}
                  transition-all duration-200
                `}>
                  {achievement.unlocked ? (
                    <Icon className="w-8 h-8 text-forest-900 dark:text-forest-50" />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-500 dark:text-sage-600 dark:text-sage-400" />
                  )}
                  
                  {achievement.unlocked && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
                
                <div className={`text-xs font-medium ${
                  achievement.unlocked ? 'text-gray-900 dark:text-forest-900 dark:text-forest-50' : 'text-gray-500 dark:text-sage-600 dark:text-sage-400'
                }`}>
                  {achievement.title}
                </div>
                
                {achievement.unlocked && achievement.unlockedAt && (
                  <div className="text-xs text-gray-500 dark:text-sage-600 dark:text-sage-400 mt-1">
                    {achievement.unlockedAt.toLocaleDateString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Recent Achievement */}
        {achievements.find(a => a.unlocked) && (
          <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-forest-900 dark:text-forest-50" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-forest-900 dark:text-forest-50 text-sm">
                  Recent Achievement Unlocked!
                </div>
                <div className="text-xs text-gray-600 dark:text-sage-600 dark:text-sage-400">
                  {achievements.find(a => a.unlocked)?.description}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Next Achievement */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <Lock className="w-4 h-4 text-gray-500 dark:text-sage-600 dark:text-sage-400" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-forest-900 dark:text-forest-50 text-sm">
                Next: {achievements.find(a => !a.unlocked)?.title}
              </div>
              <div className="text-xs text-gray-600 dark:text-sage-600 dark:text-sage-400">
                {achievements.find(a => !a.unlocked)?.description}
              </div>
            </div>
          </div>
        </div>

        {/* Progress towards next milestone */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-sage-600 dark:text-sage-400">Progress to Next Level</span>
            <span className="text-sm font-medium text-gray-900 dark:text-forest-900 dark:text-forest-50">
              {Math.min(75, completionPercentage + 25)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(75, completionPercentage + 25)}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
