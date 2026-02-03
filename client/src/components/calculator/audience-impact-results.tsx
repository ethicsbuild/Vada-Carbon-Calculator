import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, AlertTriangle, TrendingUp, TrendingDown, Lightbulb } from "lucide-react";
import type { AudienceAccessDetails } from "@/types/carbon";

interface AudienceImpactResultsProps {
  data: AudienceAccessDetails;
  impact: {
    estimatedCO2e: number;
    perAttendeeCO2e: number;
    confidenceLevel: 'low' | 'medium' | 'high';
    accessibilityScore: 'poor' | 'fair' | 'good' | 'excellent';
    whatYouControl: string[];
    whatYouInfluence: string[];
    leveragePoints: string[];
    tradeoffs: string[];
  };
}

export function AudienceImpactResults({ data, impact }: AudienceImpactResultsProps) {
  const getLocationLabel = (type: string | undefined) => {
    const labels: Record<string, string> = {
      "urban-core": "Urban Core / Downtown",
      "urban-edge": "Urban Edge / Suburban",
      "suburban": "Suburban / Car-Oriented",
      "remote-destination": "Remote / Destination Event"
    };
    return type ? labels[type] : "Not specified";
  };

  const getTransitLabel = (level: string | undefined) => {
    const labels: Record<string, string> = {
      "excellent": "Excellent",
      "good": "Good",
      "limited": "Limited",
      "none": "None"
    };
    return level ? labels[level] : "Not specified";
  };

  const getParkingLabel = (strategy: string | undefined) => {
    const labels: Record<string, string> = {
      "abundant-free": "Abundant & Free",
      "available-paid": "Available & Paid",
      "limited-expensive": "Limited & Expensive",
      "none": "None / Discouraged"
    };
    return strategy ? labels[strategy] : "Not specified";
  };

  const getAccessibilityColor = (score: string) => {
    const colors: Record<string, string> = {
      "poor": "text-red-700 bg-red-50 border-red-200",
      "fair": "text-amber-700 bg-amber-50 border-amber-200",
      "good": "text-emerald-700 bg-emerald-50 border-emerald-200",
      "excellent": "text-blue-700 bg-blue-50 border-blue-200"
    };
    return colors[score] || colors.fair;
  };

  const getConfidenceColor = (level: string) => {
    const colors: Record<string, string> = {
      "low": "text-amber-700",
      "medium": "text-slate-700",
      "high": "text-emerald-700"
    };
    return colors[level] || colors.medium;
  };

  return (
    <div className="space-y-6">
      
      {/* Honesty First: Uncertainty Notice */}
      <Alert className="border-amber-200 bg-amber-50/50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-sm text-slate-700">
          <strong>Important:</strong> Audience travel is the largest source of uncertainty in event carbon calculations. 
          You control venue selection and accessibility, but not individual travel choices. 
          These estimates reflect what your venue strategy enables, not what attendees will definitely do.
        </AlertDescription>
      </Alert>

      {/* Impact Summary */}
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
        <CardHeader>
          <CardTitle className="text-slate-800">Audience Travel Impact (Estimated)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Total Impact with Confidence Level */}
          <div className="flex items-baseline justify-between p-4 bg-white rounded-lg border border-emerald-200">
            <div>
              <p className="text-sm text-slate-600">Estimated Total Impact</p>
              <p className="text-3xl font-bold text-slate-800">
                {impact.estimatedCO2e.toLocaleString()}
                <span className="text-lg font-normal text-slate-600 ml-2">kg CO₂e</span>
              </p>
              <p className={`text-xs mt-1 font-medium ${getConfidenceColor(impact.confidenceLevel)}`}>
                Confidence: {impact.confidenceLevel.toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Per Attendee</p>
              <p className="text-xl font-semibold text-slate-700">
                {impact.perAttendeeCO2e.toLocaleString()} kg
              </p>
            </div>
          </div>

          {/* Accessibility Score */}
          <div className={`p-4 rounded-lg border-2 ${getAccessibilityColor(impact.accessibilityScore)}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Venue Accessibility Score</p>
                <p className="text-2xl font-bold capitalize mt-1">{impact.accessibilityScore}</p>
              </div>
              <Info className="h-8 w-8 opacity-50" />
            </div>
            <p className="text-xs mt-2 opacity-90">
              Based on location type, transit access, parking strategy, and shuttle services
            </p>
          </div>

          {/* Strategy Summary */}
          <div className="p-4 bg-slate-50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Venue Location:</span>
              <span className="font-medium text-slate-800">{getLocationLabel(data.venueLocationType)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Transit Access:</span>
              <span className="font-medium text-slate-800">{getTransitLabel(data.transitAccessibility)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Parking Strategy:</span>
              <span className="font-medium text-slate-800">{getParkingLabel(data.parkingStrategy)}</span>
            </div>
            {(data.shuttleServices?.hotelShuttles || 
              data.shuttleServices?.transitHubShuttles || 
              data.shuttleServices?.parkingLotShuttles) && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Shuttles:</span>
                <span className="font-medium text-slate-800">Provided</span>
              </div>
            )}
          </div>

        </CardContent>
      </Card>

      {/* What You Control */}
      {impact.whatYouControl.length > 0 && (
        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800 flex items-center">
              <TrendingDown className="h-5 w-5 text-emerald-600 mr-2" />
              What You Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Decisions you make that directly shape audience travel:
            </p>
            <ul className="space-y-3">
              {impact.whatYouControl.map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                  <span className="text-sm text-slate-700 flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* What You Influence */}
      {impact.whatYouInfluence.length > 0 && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800 flex items-center">
              <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
              What You Influence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Factors you can nudge but not control:
            </p>
            <ul className="space-y-3">
              {impact.whatYouInfluence.map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                  <span className="text-sm text-slate-700 flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Leverage Points */}
      {impact.leveragePoints.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/30">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800 flex items-center">
              <Lightbulb className="h-5 w-5 text-amber-600 mr-2" />
              Highest-Leverage Decisions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Where your decisions have the most impact on audience travel carbon:
            </p>
            <ul className="space-y-3">
              {impact.leveragePoints.map((point, index) => (
                <li key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-amber-200">
                  <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Tradeoffs */}
      {impact.tradeoffs.length > 0 && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Tradeoffs to Consider</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {impact.tradeoffs.map((tradeoff, index) => (
                <li key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded">
                  <Info className="h-4 w-4 text-slate-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{tradeoff}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Reality Check Footer */}
      <Alert className="border-slate-200 bg-slate-50">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm text-slate-700">
          <strong>Remember:</strong> Venue selection happens early in planning and shapes everything downstream. 
          An urban core venue with excellent transit can reduce audience travel carbon by 50-70% compared to 
          a suburban car-dependent venue, but may increase venue costs or limit capacity. 
          These are real tradeoffs, not moral judgments.
        </AlertDescription>
      </Alert>

    </div>
  );
}