import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Info, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { CrewOperationsDetails } from "@/lib/types/carbon";

interface CrewOperationsSectionProps {
  data: CrewOperationsDetails;
  onChange: (data: CrewOperationsDetails) => void;
}

export function CrewOperationsSection({ data, onChange }: CrewOperationsSectionProps) {
  const [showDetailed, setShowDetailed] = useState(false);

  const updateField = <K extends keyof CrewOperationsDetails>(
    field: K,
    value: CrewOperationsDetails[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-800">
          Crew & Operations Reality
        </h2>
        <p className="text-slate-600">
          How you staff the event determines travel, accommodation, and operational carbon.
          Model the actual hiring and logistics decisions you make.
        </p>
      </div>

      {/* Basic Mode */}
      <Card className="border-emerald-200 bg-white">
        <CardHeader className="bg-emerald-50/50">
          <CardTitle className="text-lg text-slate-800">Core Staffing Strategy</CardTitle>
          <CardDescription className="text-slate-600">
            3 questions • ~2 minutes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* Question 1: Staffing Model */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-slate-800">
              What's your staffing model?
            </Label>
            <p className="text-sm text-slate-600">
              How you source crew determines travel impact and operational flexibility.
            </p>
            <RadioGroup
              value={data.staffingModel || ""}
              onValueChange={(value) => updateField("staffingModel", value as CrewOperationsDetails["staffingModel"])}
              className="space-y-3"
            >
              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-slate-200 hover:border-emerald-300 transition-colors">
                <RadioGroupItem value="local-hire" id="local-hire" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="local-hire" className="font-medium text-slate-800 cursor-pointer">
                    Local Hire (Venue Market)
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    Hire crew from the venue's local market. Lower travel carbon, requires local network.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-slate-200 hover:border-emerald-300 transition-colors">
                <RadioGroupItem value="touring-core" id="touring-core" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="touring-core" className="font-medium text-slate-800 cursor-pointer">
                    Touring Core + Local Support
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    Bring key crew, hire locally for support roles. Balances consistency with local hiring.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-slate-200 hover:border-emerald-300 transition-colors">
                <RadioGroupItem value="full-touring" id="full-touring" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="full-touring" className="font-medium text-slate-800 cursor-pointer">
                    Full Touring Crew
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    Bring entire crew. Maximum consistency, highest travel impact.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-slate-200 hover:border-emerald-300 transition-colors">
                <RadioGroupItem value="hybrid-regional" id="hybrid-regional" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="hybrid-regional" className="font-medium text-slate-800 cursor-pointer">
                    Hybrid/Regional Model
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    Mix of touring crew, regional hires, and local support. Complex coordination.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Question 2: Crew Size Estimate */}
          <div className="space-y-3">
            <Label htmlFor="crew-size" className="text-base font-medium text-slate-800">
              Total crew size (rough estimate)
            </Label>
            <p className="text-sm text-slate-600">
              Include production, technical, operations, and support staff. Ranges are fine.
            </p>
            <div className="flex items-center space-x-3">
              <Input
                id="crew-size"
                type="number"
                min="0"
                placeholder="e.g., 50"
                value={data.totalCrewSize || ""}
                onChange={(e) => updateField("totalCrewSize", parseInt(e.target.value) || undefined)}
                className="max-w-xs"
              />
              <span className="text-sm text-slate-600">people</span>
            </div>
          </div>

          {/* Question 3: Accommodation Strategy */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-slate-800">
              Accommodation strategy
            </Label>
            <p className="text-sm text-slate-600">
              How crew stays affects carbon, cost, and crew welfare.
            </p>
            <RadioGroup
              value={data.accommodationStrategy || ""}
              onValueChange={(value) => updateField("accommodationStrategy", value as CrewOperationsDetails["accommodationStrategy"])}
              className="space-y-3"
            >
              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-slate-200 hover:border-emerald-300 transition-colors">
                <RadioGroupItem value="hotel-standard" id="hotel-standard" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="hotel-standard" className="font-medium text-slate-800 cursor-pointer">
                    Standard Hotel Rooms
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    Individual or shared hotel rooms. Standard approach, moderate carbon.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-slate-200 hover:border-emerald-300 transition-colors">
                <RadioGroupItem value="tour-bus" id="tour-bus" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="tour-bus" className="font-medium text-slate-800 cursor-pointer">
                    Tour Bus/Mobile Accommodation
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    Crew sleeps on tour buses. Common for touring shows, fuel-intensive.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-slate-200 hover:border-emerald-300 transition-colors">
                <RadioGroupItem value="local-commute" id="local-commute" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="local-commute" className="font-medium text-slate-800 cursor-pointer">
                    Local Commute (No Accommodation)
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    Local crew commutes from home. Lowest carbon, requires local hiring.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-slate-200 hover:border-emerald-300 transition-colors">
                <RadioGroupItem value="mixed" id="mixed" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="mixed" className="font-medium text-slate-800 cursor-pointer">
                    Mixed Strategy
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    Combination of hotels, buses, and local commute. Varies by role/seniority.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

        </CardContent>
      </Card>

      {/* Detailed Mode Toggle */}
      <Button
        variant="outline"
        onClick={() => setShowDetailed(!showDetailed)}
        className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50"
      >
        {showDetailed ? (
          <>
            <ChevronUp className="mr-2 h-4 w-4" />
            Hide Detailed Options
          </>
        ) : (
          <>
            <ChevronDown className="mr-2 h-4 w-4" />
            Show Detailed Options (6 more questions)
          </>
        )}
      </Button>

      {/* Detailed Mode */}
      {showDetailed && (
        <Card className="border-amber-200 bg-white">
          <CardHeader className="bg-amber-50/50">
            <CardTitle className="text-lg text-slate-800">Detailed Crew Operations</CardTitle>
            <CardDescription className="text-slate-600">
              6 additional questions • ~3 minutes • More precise carbon modeling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">

            {/* Question 4: Travel Mode Distribution */}
            <div className="space-y-3">
              <Label className="text-base font-medium text-slate-800">
                How does crew travel to the event?
              </Label>
              <p className="text-sm text-slate-600">
                Rough breakdown of travel modes. Percentages don't need to be exact.
              </p>
              <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="travel-air" className="text-sm text-slate-700">Air Travel (%)</Label>
                    <Input
                      id="travel-air"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={data.travelModeDistribution?.air || ""}
                      onChange={(e) => updateField("travelModeDistribution", {
                        ...data.travelModeDistribution,
                        air: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="travel-ground" className="text-sm text-slate-700">Ground Transport (%)</Label>
                    <Input
                      id="travel-ground"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={data.travelModeDistribution?.ground || ""}
                      onChange={(e) => updateField("travelModeDistribution", {
                        ...data.travelModeDistribution,
                        ground: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="travel-local" className="text-sm text-slate-700">Local Commute (%)</Label>
                    <Input
                      id="travel-local"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={data.travelModeDistribution?.local || ""}
                      onChange={(e) => updateField("travelModeDistribution", {
                        ...data.travelModeDistribution,
                        local: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Question 5: Average Travel Distance */}
            <div className="space-y-3">
              <Label htmlFor="avg-distance" className="text-base font-medium text-slate-800">
                Average travel distance per crew member
              </Label>
              <p className="text-sm text-slate-600">
                Rough estimate of how far crew travels to reach the venue. Use ranges if uncertain.
              </p>
              <div className="flex items-center space-x-3">
                <Input
                  id="avg-distance"
                  type="number"
                  min="0"
                  placeholder="e.g., 500"
                  value={data.averageTravelDistance || ""}
                  onChange={(e) => updateField("averageTravelDistance", parseInt(e.target.value) || undefined)}
                  className="max-w-xs"
                />
                <Select
                  value={data.distanceUnit || "miles"}
                  onValueChange={(value) => updateField("distanceUnit", value as "miles" | "kilometers")}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="miles">miles</SelectItem>
                    <SelectItem value="kilometers">km</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Question 6: Build/Strike Duration */}
            <div className="space-y-3">
              <Label className="text-base font-medium text-slate-800">
                Build and strike duration
              </Label>
              <p className="text-sm text-slate-600">
                How long crew is on-site affects accommodation and meal needs.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="build-days" className="text-sm text-slate-700">Build Days</Label>
                  <Input
                    id="build-days"
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="e.g., 2"
                    value={data.buildDays || ""}
                    onChange={(e) => updateField("buildDays", parseFloat(e.target.value) || undefined)}
                  />
                </div>
                <div>
                  <Label htmlFor="strike-days" className="text-sm text-slate-700">Strike Days</Label>
                  <Input
                    id="strike-days"
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="e.g., 1"
                    value={data.strikeDays || ""}
                    onChange={(e) => updateField("strikeDays", parseFloat(e.target.value) || undefined)}
                  />
                </div>
              </div>
            </div>

            {/* Question 7: Crew Welfare Considerations */}
            <div className="space-y-3">
              <Label className="text-base font-medium text-slate-800">
                Crew welfare priorities
              </Label>
              <p className="text-sm text-slate-600">
                What drives your crew accommodation and logistics decisions?
              </p>
              <RadioGroup
                value={data.crewWelfarePriority || ""}
                onValueChange={(value) => updateField("crewWelfarePriority", value as CrewOperationsDetails["crewWelfarePriority"])}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cost-minimum" id="cost-minimum" />
                  <Label htmlFor="cost-minimum" className="font-normal cursor-pointer">
                    Cost Minimum (budget-constrained)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard-comfort" id="standard-comfort" />
                  <Label htmlFor="standard-comfort" className="font-normal cursor-pointer">
                    Standard Comfort (industry baseline)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="premium-welfare" id="premium-welfare" />
                  <Label htmlFor="premium-welfare" className="font-normal cursor-pointer">
                    Premium Welfare (crew retention priority)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Question 8: Local Hiring Constraints */}
            <div className="space-y-3">
              <Label className="text-base font-medium text-slate-800">
                What limits local hiring?
              </Label>
              <p className="text-sm text-slate-600">
                Understanding constraints helps identify opportunities to reduce travel impact.
              </p>
              <RadioGroup
                value={data.localHiringConstraint || ""}
                onValueChange={(value) => updateField("localHiringConstraint", value as CrewOperationsDetails["localHiringConstraint"])}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no-constraint" id="no-constraint" />
                  <Label htmlFor="no-constraint" className="font-normal cursor-pointer">
                    No major constraint (could hire more locally)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="skill-availability" id="skill-availability" />
                  <Label htmlFor="skill-availability" className="font-normal cursor-pointer">
                    Skill availability (specialized roles not available locally)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="consistency-required" id="consistency-required" />
                  <Label htmlFor="consistency-required" className="font-normal cursor-pointer">
                    Consistency required (need same crew across tour)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="union-requirements" id="union-requirements" />
                  <Label htmlFor="union-requirements" className="font-normal cursor-pointer">
                    Union/contract requirements
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="trust-relationships" id="trust-relationships" />
                  <Label htmlFor="trust-relationships" className="font-normal cursor-pointer">
                    Trust/relationship-based (work with known crew)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Question 9: Notes/Context */}
            <div className="space-y-3">
              <Label htmlFor="crew-notes" className="text-base font-medium text-slate-800">
                Additional context (optional)
              </Label>
              <p className="text-sm text-slate-600">
                Any crew logistics details that affect carbon or operational decisions.
              </p>
              <Textarea
                id="crew-notes"
                placeholder="e.g., 'Core touring crew of 15, hire locally for load-in/out labor. Hotel rooms shared 2-per for support crew.'"
                value={data.notes || ""}
                onChange={(e) => updateField("notes", e.target.value)}
                rows={3}
              />
            </div>

          </CardContent>
        </Card>
      )}

      {/* Systems Thinking Callout */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-800">
                Systems Connections
              </p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• <strong>Food:</strong> Crew size and duration determine catering needs</li>
                <li>• <strong>Power:</strong> Accommodation strategy affects venue power load</li>
                <li>• <strong>Production:</strong> Local hiring enables venue-provided equipment use</li>
                <li>• <strong>Transport:</strong> Touring crew requires freight coordination</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}