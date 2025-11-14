import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface ScopeBreakdownProps {
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
}

export function ScopeBreakdown({ scope1, scope2, scope3, total }: ScopeBreakdownProps) {
  const scopes = [
    {
      name: 'Scope 1',
      value: scope1,
      percentage: (scope1 / total) * 100,
      color: 'bg-red-500',
      description: 'Direct emissions',
      examples: ['Natural gas', 'Fleet vehicles', 'On-site fuel']
    },
    {
      name: 'Scope 2',
      value: scope2,
      percentage: (scope2 / total) * 100,
      color: 'bg-orange-500',
      description: 'Energy indirect',
      examples: ['Purchased electricity', 'Steam', 'Heating/cooling']
    },
    {
      name: 'Scope 3',
      value: scope3,
      percentage: (scope3 / total) * 100,
      color: 'bg-green-500',
      description: 'Value chain',
      examples: ['Business travel', 'Supply chain', 'Employee commuting']
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          Scope Breakdown
          <Badge variant="outline" className="text-xs">
            GHG Protocol 2025
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {scopes.map((scope) => (
            <div key={scope.name}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${scope.color}`}></div>
                  <span className="font-medium text-gray-900 dark:text-forest-900 dark:text-forest-50">
                    {scope.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900 dark:text-forest-900 dark:text-forest-50">
                    {scope.value.toFixed(1)} tCO2e
                  </div>
                  <div className="text-xs text-gray-600 dark:text-sage-600 dark:text-sage-400">
                    {scope.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <Progress value={scope.percentage} className="h-2 mb-2" />
              
              <div className="text-xs text-gray-600 dark:text-sage-600 dark:text-sage-400 mb-1">
                {scope.description}
              </div>
              
              <div className="flex flex-wrap gap-1">
                {scope.examples.map((example, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs bg-gray-100 dark:bg-forest-50 dark:bg-forest-800 text-gray-600 dark:text-sage-600 dark:text-sage-400"
                  >
                    {example}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-forest-50 dark:bg-forest-800 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900 dark:text-forest-900 dark:text-forest-50">Total Emissions</span>
            <span className="text-xl font-bold text-gray-900 dark:text-forest-900 dark:text-forest-50">
              {total.toFixed(1)} tCO2e
            </span>
          </div>
          
          <div className="mt-3 text-xs text-gray-600 dark:text-sage-600 dark:text-sage-400">
            {scope2 > scope1 + scope3 && (
              <div className="flex items-center space-x-1 text-orange-600">
                <div className="w-1 h-1 bg-orange-600 rounded-full"></div>
                <span>Energy (Scope 2) is your largest emission source</span>
              </div>
            )}
            {scope3 > scope1 + scope2 && (
              <div className="flex items-center space-x-1 text-green-600">
                <div className="w-1 h-1 bg-green-600 rounded-full"></div>
                <span>Value chain (Scope 3) is your largest emission source</span>
              </div>
            )}
            {scope1 > scope2 + scope3 && (
              <div className="flex items-center space-x-1 text-red-600">
                <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                <span>Direct emissions (Scope 1) are your largest source</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
