import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Info, Zap, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { PowerSystemData } from "@/types/carbon";
import { calculatePowerSystemImpacts, estimatePowerEmissions } from "@/lib/power-impact-calculator";

interface PowerImpactResultsProps {
  data: PowerSystemData;
}

export function PowerImpactResults({ data }: PowerImpactResultsProps) {
  const impacts = calculatePowerSystemImpacts(data);
  const emissions = estimatePowerEmissions(data);

  const powerData = data.detailLevel === 'detailed' ? data.detailedMode : data.basicMode;

  return (
    <div className="space-y-4">
      {/* Primary Impact Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-warning" />
              <CardTitle>Power System Impact</CardTitle>
            </div>
            <div className="flex gap-2">
              <Badge variant={
                impacts.reliabilityScore === 'high' ? 'default' :
                impacts.reliabilityScore === 'medium' ? 'secondary' : 'destructive'
              }>
                {impacts.reliabilityScore === 'high' && <TrendingUp className="w-3 h-3 mr-1" />}
                {impacts.reliabilityScore === 'medium' && <Minus className="w-3 h-3 mr-1" />}
                {impacts.reliabilityScore === 'low' && <TrendingDown className="w-3 h-3 mr-1" />}
                Reliability: {impacts.reliabilityScore.charAt(0).toUpperCase() + impacts.reliabilityScore.slice(1)}
              </Badge>
              <Badge variant={
                impacts.carbonIntensity === 'low' ? 'default' :
                impacts.carbonIntensity === 'medium' ? 'secondary' : 'destructive'
              }>
                {impacts.carbonIntensity === 'low' && <TrendingDown className="w-3 h-3 mr-1" />}
                {impacts.carbonIntensity === 'medium' && <Minus className="w-3 h-3 mr-1" />}
                {impacts.carbonIntensity === 'high' && <TrendingUp className="w-3 h-3 mr-1" />}
                Carbon: {impacts.carbonIntensity.charAt(0).toUpperCase() + impacts.carbonIntensity.slice(1)}
              </Badge>
            </div>
          </div>
          <CardDescription>
            Estimated emissions: {emissions.toLocaleString()} kg CO₂e
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tradeoff Analysis */}
          {impacts.tradeoffNotes.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                Reliability vs. Efficiency Tradeoffs
              </h4>
              <div className="space-y-2">
                {impacts.tradeoffNotes.map((note, index) => (
                  <Alert key={index} variant="default">
                    <AlertDescription className="text-sm">
                      {note}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          )}

          {/* Leverage Points */}
          {impacts.leveragePoints.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-info" />
                Highest-Leverage Improvements
              </h4>
              <ul className="space-y-2">
                {impacts.leveragePoints.map((point, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start">
                    <span className="mr-2">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Power Strategy Summary */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Your Power Strategy</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Primary Source:</span>
                <p className="font-medium">
                  {powerData?.primarySource === 'grid' && '🔌 Grid Power'}
                  {powerData?.primarySource === 'generator' && '⚡ Generator'}
                  {powerData?.primarySource === 'renewable' && '☀️ Renewable'}
                  {powerData?.primarySource === 'hybrid' && '🔄 Hybrid'}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Backup Power:</span>
                <p className="font-medium">
                  {powerData?.backupRequired ? 'Yes (required)' : 'No backup'}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Estimated Load:</span>
                <p className="font-medium capitalize">
                  {powerData?.estimatedLoad}
                </p>
              </div>
              {data.detailLevel === 'detailed' && data.detailedMode && (
                <>
                  <div>
                    <span className="text-muted-foreground">Distribution:</span>
                    <p className="font-medium capitalize">
                      {data.detailedMode.distribution.strategy}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Level Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Analysis based on: <strong>{data.detailLevel === 'basic' ? 'Basic' : 'Detailed'} mode</strong>
            </span>
            {data.detailLevel === 'basic' && (
              <span className="text-xs text-muted-foreground">
                Switch to Detailed mode for distribution and redundancy insights
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}