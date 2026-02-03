import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Info, Package, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { ProductionBuildData } from "@/types/carbon";
import { calculateProductionSystemImpacts, estimateProductionEmissions } from "@/lib/production-impact-calculator";

interface ProductionImpactResultsProps {
  data: ProductionBuildData;
}

export function ProductionImpactResults({ data }: ProductionImpactResultsProps) {
  const impacts = calculateProductionSystemImpacts(data);
  const emissions = estimateProductionEmissions(data);

  const productionData = data.detailLevel === 'detailed' ? data.detailedMode : data.basicMode;

  return (
    <div className="space-y-4">
      {/* Primary Impact Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-500" />
              <CardTitle>Production Build Impact</CardTitle>
            </div>
            <div className="flex gap-2">
              <Badge variant={
                impacts.controlLevel === 'high' ? 'default' :
                impacts.controlLevel === 'medium' ? 'secondary' : 'destructive'
              }>
                {impacts.controlLevel === 'high' && <TrendingUp className="w-3 h-3 mr-1" />}
                {impacts.controlLevel === 'medium' && <Minus className="w-3 h-3 mr-1" />}
                {impacts.controlLevel === 'low' && <TrendingDown className="w-3 h-3 mr-1" />}
                Control: {impacts.controlLevel.charAt(0).toUpperCase() + impacts.controlLevel.slice(1)}
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
                Control vs. Carbon vs. Cost Tradeoffs
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

          {/* Production Strategy Summary */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Your Production Strategy</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Build Strategy:</span>
                <p className="font-medium capitalize">
                  {productionData?.buildStrategy?.replace(/-/g, ' ')}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Production Scale:</span>
                <p className="font-medium capitalize">
                  {productionData?.productionScale?.replace(/-/g, ' ')}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Transport Required:</span>
                <p className="font-medium">
                  {productionData?.transportRequired ? 'Yes' : 'No'}
                </p>
              </div>
              {data.detailLevel === 'detailed' && data.detailedMode && (
                <>
                  <div>
                    <span className="text-muted-foreground">Vendor Approach:</span>
                    <p className="font-medium capitalize">
                      {data.detailedMode.vendorStrategy.approach.replace(/-/g, ' ')}
                    </p>
                  </div>
                  {data.detailedMode.transportRequired && (
                    <>
                      <div>
                        <span className="text-muted-foreground">Trucks:</span>
                        <p className="font-medium">
                          {data.detailedMode.transportLogistics.trucksRequired}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Consolidated Shipping:</span>
                        <p className="font-medium">
                          {data.detailedMode.transportLogistics.consolidatedShipping ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Logistics Complexity */}
          {impacts.logisticsComplexity !== 'low' && (
            <div className="border-t pt-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Logistics Complexity: {impacts.logisticsComplexity.charAt(0).toUpperCase() + impacts.logisticsComplexity.slice(1)}</strong>
                  <br />
                  {impacts.logisticsComplexity === 'high' && 
                    "High complexity increases coordination time, risk, and potential for inefficiency. Consider consolidating vendors or simplifying your build strategy."}
                  {impacts.logisticsComplexity === 'medium' && 
                    "Moderate complexity is manageable with good planning. Ensure clear communication between vendors and crew."}
                </AlertDescription>
              </Alert>
            </div>
          )}
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
                Switch to Detailed mode for vendor coordination and logistics insights
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}