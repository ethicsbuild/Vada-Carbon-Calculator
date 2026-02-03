import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Info, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { FoodCateringData, FoodSystemImpacts } from "@/types/carbon";
import { generateFoodImpactAnalysis, calculateFoodSystemImpacts, estimateFoodEmissions } from "@/lib/food-impact-calculator";

interface FoodImpactResultsProps {
  data: FoodCateringData;
}

export function FoodImpactResults({ data }: FoodImpactResultsProps) {
  const analysis = generateFoodImpactAnalysis(data);
  const systemImpacts = calculateFoodSystemImpacts(data);
  const emissions = estimateFoodEmissions(data);

  const foodData = data.detailLevel === 'advanced' ? data.advancedMode : data.liteMode;
  
  if (!foodData || foodData.foodProvided === 'none') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Food & Catering Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No food provided at this event.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Primary Impact Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Food & Catering Impact</CardTitle>
            <Badge variant={
              analysis.impactLevel === 'low' ? 'default' :
              analysis.impactLevel === 'moderate' ? 'secondary' : 'destructive'
            }>
              {analysis.impactLevel === 'low' && <TrendingDown className="w-3 h-3 mr-1" />}
              {analysis.impactLevel === 'moderate' && <Minus className="w-3 h-3 mr-1" />}
              {analysis.impactLevel === 'high' && <TrendingUp className="w-3 h-3 mr-1" />}
              {analysis.impactLevel.charAt(0).toUpperCase() + analysis.impactLevel.slice(1)} Impact
            </Badge>
          </div>
          <CardDescription>
            Estimated emissions: {emissions.toLocaleString()} kg CO₂e
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Primary Drivers */}
          <div>
            <h4 className="font-semibold mb-2">Primary Impact Drivers</h4>
            <ul className="space-y-1">
              {analysis.primaryDrivers.map((driver, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start">
                  <span className="mr-2">•</span>
                  <span>{driver}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Best Leverage Point */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Best Leverage Point:</strong> {analysis.leveragePoint}
            </AlertDescription>
          </Alert>

          {/* Tradeoff Note */}
          {analysis.tradeoffNote && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Tradeoff Context:</strong> {analysis.tradeoffNote}
              </AlertDescription>
            </Alert>
          )}

          {/* System Impact Notes */}
          {systemImpacts.impactNotes.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2 text-sm">Cross-Section Impacts</h4>
              <div className="space-y-2">
                {systemImpacts.impactNotes.map((note, index) => (
                  <Alert key={index} variant="default">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {note}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Level Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Analysis based on: <strong>{data.detailLevel === 'lite' ? 'Quick Estimate' : 'Detailed Planning'}</strong>
            </span>
            {data.detailLevel === 'lite' && (
              <span className="text-xs text-muted-foreground">
                Switch to Advanced mode for more detailed insights
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}