import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Info, ChevronDown, ChevronUp, Calendar, MapPin, Users, Clock } from "lucide-react";
import { useState } from "react";
import type { EventFoundationDetails } from "@/types/carbon";

interface EventFoundationSectionProps {
  data: EventFoundationDetails;
  onChange: (data: EventFoundationDetails) => void;
}

export function EventFoundationSection({ data, onChange }: EventFoundationSectionProps) {
  const [showDetailed, setShowDetailed] = useState(false);

  const updateField = <K extends keyof EventFoundationDetails>(
    field: K,
    value: EventFoundationDetails[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-slate-800">
          Event Foundation
        </h2>
        <p className="text-slate-600 leading-relaxed">
          Not "what type of event" but "how complex is the production" and "what operational phases are involved." 
          This shapes everything downstream: crew needs, power requirements, build time, and carbon impact.
        </p>
      </div>

      {/* Reality Check Callout */}
      <Card className="border-blue-200 bg-blue-50/40">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-800">
                Why "Production Complexity" Instead of "Event Type"
              </p>
              <p className="text-sm text-slate-700">
                A 500-person corporate conference can have more complex production than a 5,000-person festival if it requires extensive AV, staging, and custom builds. 
                Event type doesn't tell us what we need to know - production complexity does.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Mode */}
      <Card className="border-emerald-200 bg-white">
        <CardHeader className="bg-emerald-50/50">
          <CardTitle className="text-lg text-slate-800">Core Event Parameters</CardTitle>
          <CardDescription className="text-slate-600">
            4 questions • ~2 minutes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* Question 1: Production Complexity */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-slate-800 flex items-center">
              <Users className="h-4 w-4 mr-2 text-emerald-600" />
              Production complexity level
            </Label>
            <p className="text-sm text-slate-600">
              How complex is the production build? This affects crew, power, equipment, and timeline.
            </p>
            <RadioGroup
              value={data.productionComplexity || ""}
              onValueChange={(value) => updateField("productionComplexity", value as EventFoundationDetails["productionComplexity"])}
              className="space-y-3"
            >
              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-slate-200 hover:border-emerald-300 transition-colors">
                <RadioGroupItem value="minimal" id="complexity-minimal" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="complexity-minimal" className="font-medium text-slate-800 cursor-pointer">
                    Minimal Production
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    Venue-provided setup, basic AV, minimal custom build. Quick load-in/out.
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Examples: Small meetings, simple gatherings, venue-standard events
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-slate-200 hover:border-emerald-300 transition-colors">
                <RadioGroupItem value="standard" id="complexity-standard" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="complexity-standard" className="font-medium text-slate-800 cursor-pointer">
                    Standard Production
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    Mix of venue and custom elements, moderate AV, some staging. 1-2 day build.
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Examples: Corporate events, medium concerts, standard conferences
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-slate-200 hover:border-emerald-300 transition-colors">
                <RadioGroupItem value="complex" id="complexity-complex" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="complexity-complex" className="font-medium text-slate-800 cursor-pointer">
                    Complex Production
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    Significant custom build, extensive AV/lighting, custom staging. 2-4 day build.
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Examples: Large concerts, trade shows, high-production conferences
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-slate-200 hover:border-emerald-300 transition-colors">
                <RadioGroupItem value="festival" id="complexity-festival" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="complexity-festival" className="font-medium text-slate-800 cursor-pointer">
                    Festival / Multi-Stage
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    Multiple stages, extensive infrastructure, full temporary build. 5+ day build.
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Examples: Music festivals, large outdoor events, multi-day productions
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Question 2: Operational Duration */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-slate-800 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-emerald-600" />
              Operational phases
            </Label>
            <p className="text-sm text-slate-600">
              How long are load-in, show, and strike? This determines crew duration and accommodation needs.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="load-in-days" className="text-sm text-slate-700">Load-In Days</Label>
                <Input
                  id="load-in-days"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="e.g., 2"
                  value={data.loadInDays || ""}
                  onChange={(e) => updateField("loadInDays", parseFloat(e.target.value) || undefined)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="show-days" className="text-sm text-slate-700">Show Days</Label>
                <Input
                  id="show-days"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="e.g., 1"
                  value={data.showDays || ""}
                  onChange={(e) => updateField("showDays", parseFloat(e.target.value) || undefined)}
                  className="mt-1"
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
                  className="mt-1"
                />
              </div>
            </div>
            {(data.loadInDays || data.showDays || data.strikeDays) && (
              <p className="text-sm text-slate-600 mt-2">
                Total on-site: <span className="font-medium text-slate-800">
                  {((data.loadInDays || 0) + (data.showDays || 0) + (data.strikeDays || 0)).toFixed(1)} days
                </span>
              </p>
            )}
          </div>

          {/* Question 3: Venue Capabilities */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-slate-800 flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-emerald-600" />
              Venue capabilities
            </Label>
            <p className="text-sm text-slate-600">
              What does the venue provide vs. what you need to bring? This shapes production strategy.
            </p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded">
                  <Checkbox
                    id="venue-stage"
                    checked={data.venueProvides?.stage || false}
                    onCheckedChange={(checked) => updateField("venueProvides", {
                      ...data.venueProvides,
                      stage: checked as boolean
                    })}
                  />
                  <Label htmlFor="venue-stage" className="text-sm cursor-pointer">Stage/Platform</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded">
                  <Checkbox
                    id="venue-lighting"
                    checked={data.venueProvides?.lighting || false}
                    onCheckedChange={(checked) => updateField("venueProvides", {
                      ...data.venueProvides,
                      lighting: checked as boolean
                    })}
                  />
                  <Label htmlFor="venue-lighting" className="text-sm cursor-pointer">Lighting System</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded">
                  <Checkbox
                    id="venue-sound"
                    checked={data.venueProvides?.sound || false}
                    onCheckedChange={(checked) => updateField("venueProvides", {
                      ...data.venueProvides,
                      sound: checked as boolean
                    })}
                  />
                  <Label htmlFor="venue-sound" className="text-sm cursor-pointer">Sound System</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded">
                  <Checkbox
                    id="venue-av"
                    checked={data.venueProvides?.av || false}
                    onCheckedChange={(checked) => updateField("venueProvides", {
                      ...data.venueProvides,
                      av: checked as boolean
                    })}
                  />
                  <Label htmlFor="venue-av" className="text-sm cursor-pointer">AV/Video</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded">
                  <Checkbox
                    id="venue-power"
                    checked={data.venueProvides?.power || false}
                    onCheckedChange={(checked) => updateField("venueProvides", {
                      ...data.venueProvides,
                      power: checked as boolean
                    })}
                  />
                  <Label htmlFor="venue-power" className="text-sm cursor-pointer">Adequate Power</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded">
                  <Checkbox
                    id="venue-rigging"
                    checked={data.venueProvides?.rigging || false}
                    onCheckedChange={(checked) => updateField("venueProvides", {
                      ...data.venueProvides,
                      rigging: checked as boolean
                    })}
                  />
                  <Label htmlFor="venue-rigging" className="text-sm cursor-pointer">Rigging Points</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Question 4: Expected Attendance */}
          <div className="space-y-3">
            <Label htmlFor="attendance" className="text-base font-medium text-slate-800 flex items-center">
              <Users className="h-4 w-4 mr-2 text-emerald-600" />
              Expected attendance
            </Label>
            <p className="text-sm text-slate-600">
              Rough estimate of total attendees. This affects catering, waste, and venue selection.
            </p>
            <div className="flex items-center space-x-3">
              <Input
                id="attendance"
                type="number"
                min="0"
                placeholder="e.g., 500"
                value={data.expectedAttendance || ""}
                onChange={(e) => updateField("expectedAttendance", parseInt(e.target.value) || undefined)}
                className="max-w-xs"
              />
              <span className="text-sm text-slate-600">people</span>
            </div>
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
            Show Detailed Options (3 more questions)
          </>
        )}
      </Button>

      {/* Detailed Mode */}
      {showDetailed && (
        <Card className="border-amber-200 bg-white">
          <CardHeader className="bg-amber-50/50">
            <CardTitle className="text-lg text-slate-800">Detailed Event Context</CardTitle>
            <CardDescription className="text-slate-600">
              3 additional questions • ~2 minutes • More precise context
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">

            {/* Question 5: Event Format */}
            <div className="space-y-3">
              <Label className="text-base font-medium text-slate-800">
                Event format
              </Label>
              <p className="text-sm text-slate-600">
                How is the event structured? This affects operational flow and resource needs.
              </p>
              <RadioGroup
                value={data.eventFormat || ""}
                onValueChange={(value) => updateField("eventFormat", value as EventFoundationDetails["eventFormat"])}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                  <RadioGroupItem value="single-day" id="format-single" />
                  <Label htmlFor="format-single" className="font-normal cursor-pointer flex-1">
                    Single Day Event
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                  <RadioGroupItem value="multi-day-same" id="format-multi-same" />
                  <Label htmlFor="format-multi-same" className="font-normal cursor-pointer flex-1">
                    Multi-Day (same programming each day)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                  <RadioGroupItem value="multi-day-different" id="format-multi-different" />
                  <Label htmlFor="format-multi-different" className="font-normal cursor-pointer flex-1">
                    Multi-Day (different programming each day)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                  <RadioGroupItem value="festival" id="format-festival" />
                  <Label htmlFor="format-festival" className="font-normal cursor-pointer flex-1">
                    Festival (continuous multi-day)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Question 6: Indoor vs Outdoor */}
            <div className="space-y-3">
              <Label className="text-base font-medium text-slate-800">
                Indoor or outdoor?
              </Label>
              <p className="text-sm text-slate-600">
                Location type affects power needs, weather contingency, and infrastructure requirements.
              </p>
              <RadioGroup
                value={data.indoorOutdoor || ""}
                onValueChange={(value) => updateField("indoorOutdoor", value as EventFoundationDetails["indoorOutdoor"])}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                  <RadioGroupItem value="fully-indoor" id="location-indoor" />
                  <Label htmlFor="location-indoor" className="font-normal cursor-pointer flex-1">
                    Fully Indoor (climate controlled)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                  <RadioGroupItem value="fully-outdoor" id="location-outdoor" />
                  <Label htmlFor="location-outdoor" className="font-normal cursor-pointer flex-1">
                    Fully Outdoor (weather dependent)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                  <RadioGroupItem value="mixed" id="location-mixed" />
                  <Label htmlFor="location-mixed" className="font-normal cursor-pointer flex-1">
                    Mixed (indoor + outdoor spaces)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                  <RadioGroupItem value="covered-outdoor" id="location-covered" />
                  <Label htmlFor="location-covered" className="font-normal cursor-pointer flex-1">
                    Covered Outdoor (tent/structure)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Question 7: Weather Contingency */}
            {(data.indoorOutdoor === "fully-outdoor" || 
              data.indoorOutdoor === "mixed" || 
              data.indoorOutdoor === "covered-outdoor") && (
              <div className="space-y-3">
                <Label className="text-base font-medium text-slate-800">
                  Weather contingency plan
                </Label>
                <p className="text-sm text-slate-600">
                  For outdoor events, how do you handle weather?
                </p>
                <RadioGroup
                  value={data.weatherContingency || ""}
                  onValueChange={(value) => updateField("weatherContingency", value as EventFoundationDetails["weatherContingency"])}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                    <RadioGroupItem value="rain-or-shine" id="weather-shine" />
                    <Label htmlFor="weather-shine" className="font-normal cursor-pointer flex-1">
                      Rain or Shine (no contingency)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                    <RadioGroupItem value="covered-areas" id="weather-covered" />
                    <Label htmlFor="weather-covered" className="font-normal cursor-pointer flex-1">
                      Covered Areas Available
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                    <RadioGroupItem value="indoor-backup" id="weather-backup" />
                    <Label htmlFor="weather-backup" className="font-normal cursor-pointer flex-1">
                      Indoor Backup Venue
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                    <RadioGroupItem value="postponement" id="weather-postpone" />
                    <Label htmlFor="weather-postpone" className="font-normal cursor-pointer flex-1">
                      Postponement/Cancellation Plan
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

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
                How Event Foundation Shapes Everything
              </p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• <strong>Production Complexity:</strong> Determines crew size, equipment needs, and build time</li>
                <li>• <strong>Operational Duration:</strong> Affects crew accommodation, catering days, and power usage</li>
                <li>• <strong>Venue Capabilities:</strong> Shapes production strategy (bring vs. rent vs. venue-provided)</li>
                <li>• <strong>Indoor/Outdoor:</strong> Affects power requirements, weather contingency, and infrastructure</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}