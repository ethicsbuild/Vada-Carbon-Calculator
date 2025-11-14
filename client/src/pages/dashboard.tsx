import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmissionsChart } from '@/components/dashboard/emissions-chart';
import { ScopeBreakdown } from '@/components/dashboard/scope-breakdown';
import { 
  BarChart3, 
  TrendingDown, 
  Zap, 
  Car, 
  Trash2,
  Calendar,
  Download,
  Share
} from 'lucide-react';

export default function Dashboard() {
  const currentEmissions = {
    total: 156.2,
    scope1: 45.3,
    scope2: 67.8,
    scope3: 43.1,
    change: -8.5
  };

  const keyMetrics = [
    {
      icon: Zap,
      label: "Energy Use",
      value: "89.2 MWh",
      color: "text-forest-600",
      bgColor: "bg-forest-600"
    },
    {
      icon: Car,
      label: "Transport",
      value: "12.4 tCO2e",
      color: "text-blue-600",
      bgColor: "bg-blue-600"
    },
    {
      icon: Trash2,
      label: "Waste",
      value: "3.7 tCO2e",
      color: "text-orange-600",
      bgColor: "bg-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-sage-50 dark:bg-forest-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-forest-900 dark:text-forest-100 mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-xl text-gray-600 dark:text-sage-700 dark:text-sage-300">
              Real-time insights and trend analysis for your carbon footprint
            </p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share Report
            </Button>
            <Button size="sm" className="bg-forest-600 hover:bg-green-700">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Review
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-sage-600 dark:text-sage-400">Total Emissions</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-forest-900 dark:text-forest-100">
                    {currentEmissions.total} <span className="text-sm font-normal">tCO2e</span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-gray-100 dark:bg-forest-50 dark:bg-forest-800 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-gray-600 dark:text-sage-600 dark:text-sage-400" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingDown className="w-4 h-4 text-forest-600 mr-1" />
                <span className="text-forest-600 text-sm font-medium">
                  {Math.abs(currentEmissions.change)}% vs last year
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-sage-600 dark:text-sage-400">Scope 1</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-forest-900 dark:text-forest-100">
                    {currentEmissions.scope1} <span className="text-sm font-normal">tCO2e</span>
                  </p>
                </div>
                <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                  29%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-sage-600 dark:text-sage-400">Scope 2</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-forest-900 dark:text-forest-100">
                    {currentEmissions.scope2} <span className="text-sm font-normal">tCO2e</span>
                  </p>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                  43%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-sage-600 dark:text-sage-400">Scope 3</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-forest-900 dark:text-forest-100">
                    {currentEmissions.scope3} <span className="text-sm font-normal">tCO2e</span>
                  </p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  28%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <EmissionsChart />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Scope Breakdown */}
            <ScopeBreakdown 
              scope1={currentEmissions.scope1}
              scope2={currentEmissions.scope2}
              scope3={currentEmissions.scope3}
              total={currentEmissions.total}
            />

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {keyMetrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${metric.bgColor} rounded-full flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-forest-900 dark:text-forest-100" />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-sage-600 dark:text-sage-400">{metric.label}</span>
                        </div>
                        <span className={`text-sm font-medium ${metric.color}`}>{metric.value}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <p className="text-blue-800 dark:text-blue-200 font-medium mb-1">Energy Optimization</p>
                    <p className="text-blue-700 dark:text-blue-300">
                      Switch to renewable energy sources could reduce Scope 2 emissions by 30%
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <p className="text-green-800 dark:text-green-200 font-medium mb-1">Supply Chain</p>
                    <p className="text-green-700 dark:text-green-300">
                      Engage top 5 suppliers for carbon reduction initiatives
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <p className="text-purple-800 dark:text-purple-200 font-medium mb-1">Transportation</p>
                    <p className="text-purple-700 dark:text-purple-300">
                      Implement hybrid work policy to cut commuting emissions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
