import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Calendar, MapPin, Users, Clock } from "lucide-react";
import type { EventFoundationDetails } from "@/types/carbon";

interface EventFoundationResultsProps {
  data: EventFoundationDetails;
  summary: {
    totalDays: number;
    complexityLevel: string;
    venueCapabilityScore: number;
    operationalInsights: string[];
    systemsConnections: string[];
  };
}

export function EventFoundationResults({ data, summary }: EventFoundationResultsProps) {
  const getComplexityLabel = (complexity: string | undefined) => {
    const labels: Record<string, string> = {
      "minimal": "Minimal Production",
      "standard": "Standard Production",
      "complex": "Complex Production",
      "festival": "Festival / Multi-Stage"
    };
    return complexity ? labels[complexity] : "Not specified";
  };

  const getComplexityColor = (complexity: string | undefined) => {
    const colors: Record<string, string> = {
      "minimal": "text-emerald-700 bg-emerald-50 border-emerald-200",
      "standard": "text-blue-700 bg-blue-50 border-blue-200",
      "complex": "text-amber-700 bg-amber-50 border-amber-200",
      "festival": "text-purple-700 bg-purple-50 border-purple-200"
    };
    return complexity ? colors[complexity] : colors.standard;
  };

  const getVenueCapabilityLabel = (score: number) => {
    if (score >= 5) return "Comprehensive";
    if (score >= 3) return "Moderate";
    if (score >= 1) return "Limited";
    return "Minimal";
  };

  const getVenueCapabilityColor = (score: number) => {
    if (score >= 5) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 3) return "text-blue-700 bg-blue-50 border-blue-200";
    if (score >= 1) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-slate-700 bg-slate-50 border-slate-200";
  };

  return (
    <div className="space-y-6">
      
      {/* Event Overview */}
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
        <CardHeader>
          <CardTitle className="text-slate-800">Event Foundation Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Production Complexity */}
          <div className={`p-4 rounded-lg border-2 ${getComplexityColor(data.productionComplexity)}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Production Complexity</p>
                <p className="text-2xl font-bold mt-1">{getComplexityLabel(data.productionComplexity)}</p>
              </div>
              <Users className="h-8 w-8 opacity-50" />
            </div>
          </div>

          {/* Operational Timeline */}
          {summary.totalDays > 0 && (
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-slate-700">Operational Timeline</p>
                <Clock className="h-5 w-5 text-slate-600" />
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-800">{data.loadInDays || 0}</p>
                  <p className="text-xs text-slate-600">Load-In</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-800">{data.showDays || 0}</p>
                  <p className="text-xs text-slate-600">Show</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-800">{data.strikeDays || 0}</p>
                  <p className="text-xs text-slate-600">Strike</p>
                </div>
                <div className="text-center border-l border-slate-200">
                  <p className="text-2xl font-bold text-emerald-700">{summary.totalDays}</p>
                  <p className="text-xs text-slate-600">Total Days</p>
                </div>
              </div>
            </div>
          )}

          {/* Venue Capabilities */}
          {summary.venueCapabilityScore > 0 && (
            <div className={`p-4 rounded-lg border-2 ${getVenueCapabilityColor(summary.venueCapabilityScore)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Venue Capabilities</p>
                  <p className="text-2xl font-bold mt-1">{getVenueCapabilityLabel(summary.venueCapabilityScore)}</p>
                  <p className="text-xs mt-1 opacity-90">{summary.venueCapabilityScore} of 6 systems provided</p>
                </div>
                <MapPin className="h-8 w-8 opacity-50" />
              </div>
            </div>
          )}

          {/* Attendance */}
          {data.expectedAttendance && (
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Expected Attendance:</span>
                <span className="font-semibold text-slate-800">{data.expectedAttendance.toLocaleString()} people</span>
              </div>
            </div>
          )}

          {/* Event Format */}
          {data.eventFormat && (
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Event Format:</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {data.eventFormat.replace(/-/g, ' ')}
                </span>
              </div>
            </div>
          )}

          {/* Indoor/Outdoor */}
          {data.indoorOutdoor && (
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Location Type:</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {data.indoorOutdoor.replace(/-/g, ' ')}
                </span>
              </div>
            </div>
          )}

        </CardContent>
      </Card>

      {/* Operational Insights */}
      {summary.operationalInsights.length > 0 && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800 flex items-center">
              <Info className="h-5 w-5 text-blue-600 mr-2" />
              Operational Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              How your event foundation shapes operational decisions:
            </p>
            <ul className="space-y-3">
              {summary.operationalInsights.map((insight, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                  <span className="text-sm text-slate-700 flex-1">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Systems Connections */}
      {summary.systemsConnections.length > 0 && (
        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800 flex items-center">
              <Calendar className="h-5 w-5 text-emerald-600 mr-2" />
              Systems Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              How event foundation connects to other sections:
            </p>
            <ul className="space-y-3">
              {summary.systemsConnections.map((connection, index) => (
                <li key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-emerald-200">
                  <div className="h-2 w-2 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{connection}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Venue Capabilities Detail */}
      {data.venueProvides && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">What Venue Provides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {data.venueProvides.stage && (
                <div className="flex items-center space-x-2 p-3 bg-emerald-50 rounded border border-emerald-200">
                  <div className="h-2 w-2 rounded-full bg-emerald-600" />
                  <span className="text-sm text-slate-700">Stage/Platform</span>
                </div>
              )}
              {data.venueProvides.lighting && (
                <div className="flex items-center space-x-2 p-3 bg-emerald-50 rounded border border-emerald-200">
                  <div className="h-2 w-2 rounded-full bg-emerald-600" />
                  <span className="text-sm text-slate-700">Lighting System</span>
                </div>
              )}
              {data.venueProvides.sound && (
                <div className="flex items-center space-x-2 p-3 bg-emerald-50 rounded border border-emerald-200">
                  <div className="h-2 w-2 rounded-full bg-emerald-600" />
                  <span className="text-sm text-slate-700">Sound System</span>
                </div>
              )}
              {data.venueProvides.av && (
                <div className="flex items-center space-x-2 p-3 bg-emerald-50 rounded border border-emerald-200">
                  <div className="h-2 w-2 rounded-full bg-emerald-600" />
                  <span className="text-sm text-slate-700">AV/Video</span>
                </div>
              )}
              {data.venueProvides.power && (
                <div className="flex items-center space-x-2 p-3 bg-emerald-50 rounded border border-emerald-200">
                  <div className="h-2 w-2 rounded-full bg-emerald-600" />
                  <span className="text-sm text-slate-700">Adequate Power</span>
                </div>
              )}
              {data.venueProvides.rigging && (
                <div className="flex items-center space-x-2 p-3 bg-emerald-50 rounded border border-emerald-200">
                  <div className="h-2 w-2 rounded-full bg-emerald-600" />
                  <span className="text-sm text-slate-700">Rigging Points</span>
                </div>
              )}
            </div>
            {summary.venueCapabilityScore === 0 && (
              <p className="text-sm text-slate-600 mt-3">
                No venue capabilities selected - full custom build required
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Weather Contingency (if outdoor) */}
      {data.weatherContingency && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm text-slate-700">
            <strong>Weather Contingency:</strong> {data.weatherContingency.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </AlertDescription>
        </Alert>
      )}

    </div>
  );
}