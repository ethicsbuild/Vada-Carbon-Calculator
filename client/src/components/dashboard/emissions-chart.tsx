import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, Calendar } from 'lucide-react';

export function EmissionsChart() {
  // Mock chart data - in real app this would come from API
  const chartData = {
    totalEmissions: 156.2,
    previousPeriod: 170.4,
    change: -8.5,
    monthlyData: [
      { month: 'Jan', emissions: 145.2 },
      { month: 'Feb', emissions: 138.7 },
      { month: 'Mar', emissions: 152.1 },
      { month: 'Apr', emissions: 160.8 },
      { month: 'May', emissions: 158.3 },
      { month: 'Jun', emissions: 161.7 },
      { month: 'Jul', emissions: 159.4 },
      { month: 'Aug', emissions: 163.2 },
      { month: 'Sep', emissions: 157.9 },
      { month: 'Oct', emissions: 154.6 },
      { month: 'Nov', emissions: 151.2 },
      { month: 'Dec', emissions: 156.2 },
    ]
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Emission Trends</CardTitle>
          <div className="flex space-x-2">
            <Button size="sm" className="bg-green-600 hover:bg-green-700">Monthly</Button>
            <Button size="sm" variant="outline">Quarterly</Button>
            <Button size="sm" variant="outline">Yearly</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart Placeholder - In real app, use a proper charting library */}
        <div className="relative h-64 bg-white dark:bg-gray-800 rounded-xl p-4 mb-4">
          {/* Mock chart visualization */}
          <div className="w-full h-full bg-gradient-to-t from-green-100 to-transparent dark:from-green-900/20 dark:to-transparent rounded-lg relative overflow-hidden">
            {/* Trend line mockup */}
            <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
              {chartData.monthlyData.map((data, index) => (
                <div key={data.month} className="flex flex-col items-center">
                  <div 
                    className="w-6 bg-green-600 rounded-t"
                    style={{ 
                      height: `${(data.emissions / Math.max(...chartData.monthlyData.map(d => d.emissions))) * 100}%`,
                      minHeight: '20px'
                    }}
                  ></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{data.month}</span>
                </div>
              ))}
            </div>
            
            {/* Chart overlay info */}
            <div className="absolute top-4 left-4">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-green-600 rounded"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Total Emissions</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {chartData.totalEmissions} tCO2e
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 text-sm font-medium">
                    {Math.abs(chartData.change)}% vs last year
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Period Comparison */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Current Period</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {chartData.totalEmissions} tCO2e
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Previous Period</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {chartData.previousPeriod} tCO2e
            </div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Change</div>
            <div className="text-lg font-bold text-green-600">
              {chartData.change}%
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Trend Analysis
              </div>
              <div className="text-sm text-blue-800 dark:text-blue-200">
                Your emissions have decreased by {Math.abs(chartData.change)}% compared to last year. 
                The largest improvements were in Q4, likely due to energy efficiency initiatives.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
