import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { CrewOperationsDetails } from "@/lib/types/carbon";

interface CrewImpactResultsProps {
  data: CrewOperationsDetails;
  impact: {
    travelCO2e: number;
    accommodationCO2e: number;
    totalCO2e: number;
    perPersonCO2e: number;
    leveragePoints: string[];
    tradeoffs: string[];
  };
}

export function CrewImpactResults({ data, impact }: CrewImpactResultsProps) {
  const getStaffingModelLabel = (model: string | undefined) => {
    const labels: Record<string, string> = {
      "local-hire": "Local Hire",
      "touring-core": "Touring Core + Local Support",
      "full-touring": "Full Touring Crew",
      "hybrid-regional": "Hybrid/Regional Model"
    };
    return model ? labels[model] : "Not specified";
  };

  const getAccommodationLabel = (strategy: string | undefined) => {
    const labels: Record<string, string> = {
      "hotel-standard": "Standard Hotel Rooms",
      "tour-bus": "Tour Bus/Mobile",
      "local-commute": "Local Commute",
      "mixed": "Mixed Strategy"
    };
    return strategy ? labels[strategy] : "Not specified";
  };

  const getTrendIcon = (text: string) => {
    if (text.toLowerCase().includes("increase") || text.toLowerCase().includes("higher")) {
      return <TrendingUp className="h-4 w-4 text-trend-up" />;
    }
    if (text.toLowerCase().includes("reduce") || text.toLowerCase().includes("lower")) {
      return <TrendingDown className="h-4 w-4 text-trend-down" />;
    }
    return <Minus className="h-4 w-4 text-trend-neutral" />;
  };

  return (
    <div className="space-y-6">
      
      {/* Impact Summary */}
      <Card className="border-primary-border bg-gradient-to-br from-primary-light to-white">
        <CardHeader>
          <CardTitle className="text-slate-800">Crew & Operations Impact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Total Impact */}
          <div className="flex items-baseline justify-between p-4 bg-white rounded-lg border border-primary-border">
            <div>
              <p className="text-sm text-slate-600">Total Crew Carbon</p>
              <p className="text-3xl font-bold text-slate-800">
                {impact.totalCO2e.toLocaleString()}
                <span className="text-lg font-normal text-slate-600 ml-2">kg CO₂e</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Per Person</p>
              <p className="text-xl font-semibold text-slate-700">
                {impact.perPersonCO2e.toLocaleString()} kg
              </p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600 mb-1">Travel Impact</p>
              <p className="text-2xl font-bold text-slate-800">
                {impact.travelCO2e.toLocaleString()}
                <span className="text-sm font-normal text-slate-600 ml-1">kg</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {((impact.travelCO2e / impact.totalCO2e) * 100).toFixed(0)}% of crew total
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600 mb-1">Accommodation Impact</p>
              <p className="text-2xl font-bold text-slate-800">
                {impact.accommodationCO2e.toLocaleString()}
                <span className="text-sm font-normal text-slate-600 ml-1">kg</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {((impact.accommodationCO2e / impact.totalCO2e) * 100).toFixed(0)}% of crew total
              </p>
            </div>
          </div>

          {/* Strategy Summary */}
          <div className="p-4 bg-slate-50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Staffing Model:</span>
              <span className="font-medium text-slate-800">{getStaffingModelLabel(data.staffingModel)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Accommodation:</span>
              <span className="font-medium text-slate-800">{getAccommodationLabel(data.accommodationStrategy)}</span>
            </div>
            {data.totalCrewSize && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Crew Size:</span>
                <span className="font-medium text-slate-800">{data.totalCrewSize} people</span>
              </div>
            )}
          </div>

        </CardContent>
      </Card>

      {/* Leverage Points */}
      {impact.leveragePoints.length > 0 && (
        <Card className="border-info-border bg-info-light">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800 flex items-center">
              <Info className="h-5 w-5 text-info mr-2" />
              Leverage Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Decisions that could meaningfully reduce crew carbon impact:
            </p>
            <ul className="space-y-3">
              {impact.leveragePoints.map((point, index) => (
                <li key={index} className="flex items-start space-x-3">
                  {getTrendIcon(point)}
                  <span className="text-sm text-slate-700 flex-1">{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Tradeoffs */}
      {impact.tradeoffs.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/30">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Tradeoffs to Consider</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {impact.tradeoffs.map((tradeoff, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <Minus className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{tradeoff}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Detailed Breakdown (if detailed data provided) */}
      {data.travelModeDistribution && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Travel Mode Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.travelModeDistribution.air > 0 && (
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                  <span className="text-sm text-slate-700">Air Travel</span>
                  <span className="font-medium text-slate-800">{data.travelModeDistribution.air}%</span>
                </div>
              )}
              {data.travelModeDistribution.ground > 0 && (
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                  <span className="text-sm text-slate-700">Ground Transport</span>
                  <span className="font-medium text-slate-800">{data.travelModeDistribution.ground}%</span>
                </div>
              )}
              {data.travelModeDistribution.local > 0 && (
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                  <span className="text-sm text-slate-700">Local Commute</span>
                  <span className="font-medium text-slate-800">{data.travelModeDistribution.local}%</span>
                </div>
              )}
            </div>
            
            {data.averageTravelDistance && (
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <p className="text-sm text-slate-700">
                  Average travel distance: <span className="font-medium">{data.averageTravelDistance} {data.distanceUnit || 'miles'}</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Build/Strike Duration (if provided) */}
      {(data.buildDays || data.strikeDays) && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">On-Site Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {data.buildDays && (
                <div className="p-3 bg-slate-50 rounded">
                  <p className="text-sm text-slate-600">Build Days</p>
                  <p className="text-xl font-semibold text-slate-800">{data.buildDays}</p>
                </div>
              )}
              {data.strikeDays && (
                <div className="p-3 bg-slate-50 rounded">
                  <p className="text-sm text-slate-600">Strike Days</p>
                  <p className="text-xl font-semibold text-slate-800">{data.strikeDays}</p>
                </div>
              )}
            </div>
            {(data.buildDays || 0) + (data.strikeDays || 0) > 0 && (
              <p className="text-sm text-slate-600 mt-3">
                Total on-site: <span className="font-medium text-slate-800">
                  {((data.buildDays || 0) + (data.strikeDays || 0)).toFixed(1)} days
                </span>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Context Notes (if provided) */}
      {data.notes && (
        <Alert className="border-slate-200 bg-slate-50">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm text-slate-700">
            <strong>Context:</strong> {data.notes}
          </AlertDescription>
        </Alert>
      )}

    </div>
  );
}