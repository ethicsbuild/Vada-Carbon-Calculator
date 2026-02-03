import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Info, ChevronDown, ChevronUp, MapPin, Train, Car, Bus } from "lucide-react";
import { useState } from "react";
import type { AudienceAccessDetails } from "@/types/carbon";
import { SectionCard } from "@/components/ui/section-card";
import { Callout } from "@/components/ui/callout";
import { QuestionBlock } from "@/components/ui/question-block";

interface AudienceAccessSectionProps {
  data: AudienceAccessDetails;
  onChange: (data: AudienceAccessDetails) => void;
}

export function AudienceAccessSection({ data, onChange }: AudienceAccessSectionProps) {
  const [showDetailed, setShowDetailed] = useState(false);

  const updateField = <K extends keyof AudienceAccessDetails>(
    field: K,
    value: AudienceAccessDetails[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-slate-800">
          How People Get There
        </h2>
        <p className="text-slate-600 leading-relaxed">
          You don't control how attendees travel, but you control venue selection, 
          transit access, parking strategy, and shuttle services. Model what you actually decide.
        </p>
      </div>

      {/* Reality Check Callout */}
      <Callout variant="info" icon={Info}>
        <p className="text-sm font-medium text-slate-800">
          What You Control vs. What You Don't
        </p>
        <div className="text-sm text-slate-700 space-y-1">
          <p><strong>You control:</strong> Venue location, transit access, parking availability, shuttle services</p>
          <p><strong>You influence:</strong> Mode choice through pricing, convenience, and incentives</p>
          <p><strong>You don't control:</strong> Individual attendee travel decisions</p>
        </div>
      </Callout>

      {/* Basic Mode */}
      <SectionCard title="Venue Accessibility Strategy" description="
            4 questions • ~2 minutes
          " variant="default">
          
          {/* Question 1: Venue Location Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-slate-800 flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              Where is the venue located?
            </Label>
            <p className="text-sm text-slate-600">
              Location type fundamentally shapes how people can reach the event.
            </p>
            <RadioGroup
              value={data.venueLocationType || ""}
              onValueChange={(value) => updateField("venueLocationType", value as AudienceAccessDetails["venueLocationType"])}
              className="space-y-3"
            >
              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-slate-200 hover:border-primary/30 transition-colors">
                <RadioGroupItem value="urban-core" id="urban-core" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="urban-core" className="font-medium text-slate-800 cursor-pointer">
                    Urban Core / Downtown
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    Dense urban area with strong transit, walkability, limited parking. Favors transit/rideshare.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-slate-200 hover:border-primary/30 transition-colors">
                <RadioGroupItem value="urban-edge" id="urban-edge" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="urban-edge" className="font-medium text-slate-800 cursor-pointer">
                    Urban Edge / Suburban
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    Between urban and suburban. Some transit access, parking available. Mixed mode split.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-slate-200 hover:border-primary/30 transition-colors">
                <RadioGroupItem value="suburban" id="suburban" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="suburban" className="font-medium text-slate-800 cursor-pointer">
                    Suburban / Car-Oriented
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    Car-dependent area with ample parking, limited transit. Primarily driving.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-slate-200 hover:border-primary/30 transition-colors">
                <RadioGroupItem value="remote-destination" id="remote-destination" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="remote-destination" className="font-medium text-slate-800 cursor-pointer">
                    Remote / Destination Event
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    Remote location requiring significant travel. Often multi-day with accommodation.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Question 2: Transit Accessibility */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-slate-800 flex items-center">
              <Train className="h-4 w-4 mr-2 text-primary" />
              Public transit accessibility
            </Label>
            <p className="text-sm text-slate-600">
              How easily can attendees reach the venue via public transit?
            </p>
            <RadioGroup
              value={data.transitAccessibility || ""}
              onValueChange={(value) => updateField("transitAccessibility", value as AudienceAccessDetails["transitAccessibility"])}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                <RadioGroupItem value="excellent" id="transit-excellent" />
                <Label htmlFor="transit-excellent" className="font-normal cursor-pointer flex-1">
                  Excellent (direct rail/metro, frequent service, walkable from station)
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                <RadioGroupItem value="good" id="transit-good" />
                <Label htmlFor="transit-good" className="font-normal cursor-pointer flex-1">
                  Good (bus routes, reasonable frequency, short walk)
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                <RadioGroupItem value="limited" id="transit-limited" />
                <Label htmlFor="transit-limited" className="font-normal cursor-pointer flex-1">
                  Limited (infrequent service, long walk, or transfer required)
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                <RadioGroupItem value="none" id="transit-none" />
                <Label htmlFor="transit-none" className="font-normal cursor-pointer flex-1">
                  None (no practical public transit option)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Question 3: Parking Strategy */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-slate-800 flex items-center">
              <Car className="h-4 w-4 mr-2 text-primary" />
              Parking strategy
            </Label>
            <p className="text-sm text-slate-600">
              Parking availability and pricing shapes driving behavior.
            </p>
            <RadioGroup
              value={data.parkingStrategy || ""}
              onValueChange={(value) => updateField("parkingStrategy", value as AudienceAccessDetails["parkingStrategy"])}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                <RadioGroupItem value="abundant-free" id="parking-abundant" />
                <Label htmlFor="parking-abundant" className="font-normal cursor-pointer flex-1">
                  Abundant & Free (encourages driving)
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                <RadioGroupItem value="available-paid" id="parking-paid" />
                <Label htmlFor="parking-paid" className="font-normal cursor-pointer flex-1">
                  Available & Paid (moderate deterrent)
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                <RadioGroupItem value="limited-expensive" id="parking-limited" />
                <Label htmlFor="parking-limited" className="font-normal cursor-pointer flex-1">
                  Limited & Expensive (strong deterrent)
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                <RadioGroupItem value="none" id="parking-none" />
                <Label htmlFor="parking-none" className="font-normal cursor-pointer flex-1">
                  None / Discouraged (forces alternatives)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Question 4: Shuttle Services */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-slate-800 flex items-center">
              <Bus className="h-4 w-4 mr-2 text-primary" />
              Shuttle or transit partnerships
            </Label>
            <p className="text-sm text-slate-600">
              Do you provide shuttles or partner with transit services?
            </p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                <Checkbox
                  id="shuttle-hotel"
                  checked={data.shuttleServices?.hotelShuttles || false}
                  onCheckedChange={(checked) => updateField("shuttleServices", {
                    ...data.shuttleServices,
                    hotelShuttles: checked as boolean
                  })}
                />
                <div className="flex-1">
                  <Label htmlFor="shuttle-hotel" className="font-medium text-slate-800 cursor-pointer">
                    Hotel Shuttles
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    Shuttles between hotels and venue
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                <Checkbox
                  id="shuttle-transit"
                  checked={data.shuttleServices?.transitHubShuttles || false}
                  onCheckedChange={(checked) => updateField("shuttleServices", {
                    ...data.shuttleServices,
                    transitHubShuttles: checked as boolean
                  })}
                />
                <div className="flex-1">
                  <Label htmlFor="shuttle-transit" className="font-medium text-slate-800 cursor-pointer">
                    Transit Hub Shuttles
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    Shuttles from train/bus stations to venue
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                <Checkbox
                  id="shuttle-parking"
                  checked={data.shuttleServices?.parkingLotShuttles || false}
                  onCheckedChange={(checked) => updateField("shuttleServices", {
                    ...data.shuttleServices,
                    parkingLotShuttles: checked as boolean
                  })}
                />
                <div className="flex-1">
                  <Label htmlFor="shuttle-parking" className="font-medium text-slate-800 cursor-pointer">
                    Remote Parking Shuttles
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    Shuttles from remote parking to venue
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                <Checkbox
                  id="shuttle-none"
                  checked={!data.shuttleServices?.hotelShuttles && 
                           !data.shuttleServices?.transitHubShuttles && 
                           !data.shuttleServices?.parkingLotShuttles}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateField("shuttleServices", {
                        hotelShuttles: false,
                        transitHubShuttles: false,
                        parkingLotShuttles: false
                      });
                    }
                  }}
                />
                <div className="flex-1">
                  <Label htmlFor="shuttle-none" className="font-medium text-slate-800 cursor-pointer">
                    No Shuttles Provided
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    Attendees use their own transportation
                  </p>
                </div>
              </div>
            </div>
          </div>

        </SectionCard>

      {/* Detailed Mode Toggle */}
      <Button
        variant="outline"
        onClick={() => setShowDetailed(!showDetailed)}
        className="w-full border-primary text-primary hover:bg-primary/5"
      >
        {showDetailed ? (
          <>
            <ChevronUp className="mr-2 h-4 w-4" />
            Hide Detailed Options
          </>
        ) : (
          <>
            <ChevronDown className="mr-2 h-4 w-4" />
            Show Detailed Options (4 more questions)
          </>
        )}
      </Button>

      {/* Detailed Mode */}
      {showDetailed && (
        <SectionCard title="Detailed Accessibility Context" description="
              4 additional questions • ~2 minutes • More precise impact modeling
            " variant="detailed">

            {/* Question 5: Event Draw Geography */}
            <div className="space-y-3">
              <Label className="text-base font-medium text-slate-800">
                Event draw geography
              </Label>
              <p className="text-sm text-slate-600">
                Where do most attendees come from? This affects travel distance and mode.
              </p>
              <RadioGroup
                value={data.eventDrawGeography || ""}
                onValueChange={(value) => updateField("eventDrawGeography", value as AudienceAccessDetails["eventDrawGeography"])}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                  <RadioGroupItem value="hyper-local" id="draw-hyperlocal" />
                  <Label htmlFor="draw-hyperlocal" className="font-normal cursor-pointer flex-1">
                    Hyper-Local (same neighborhood/district, mostly walking/biking)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                  <RadioGroupItem value="city-metro" id="draw-metro" />
                  <Label htmlFor="draw-metro" className="font-normal cursor-pointer flex-1">
                    City/Metro Area (within 30 miles, local transit viable)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                  <RadioGroupItem value="regional" id="draw-regional" />
                  <Label htmlFor="draw-regional" className="font-normal cursor-pointer flex-1">
                    Regional (30-150 miles, mostly driving, some flights)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                  <RadioGroupItem value="national" id="draw-national" />
                  <Label htmlFor="draw-national" className="font-normal cursor-pointer flex-1">
                    National (150+ miles, significant air travel)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                  <RadioGroupItem value="international" id="draw-international" />
                  <Label htmlFor="draw-international" className="font-normal cursor-pointer flex-1">
                    International (global draw, primarily air travel)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Question 6: Estimated Attendance */}
            <div className="space-y-3">
              <Label htmlFor="attendance" className="text-base font-medium text-slate-800">
                Expected attendance
              </Label>
              <p className="text-sm text-slate-600">
                Rough estimate of total attendees. Ranges are fine.
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

            {/* Question 7: Carpooling/Rideshare Incentives */}
            <div className="space-y-3">
              <Label className="text-base font-medium text-slate-800">
                Carpooling or rideshare incentives
              </Label>
              <p className="text-sm text-slate-600">
                Do you actively encourage shared rides?
              </p>
              <RadioGroup
                value={data.carpoolIncentives || ""}
                onValueChange={(value) => updateField("carpoolIncentives", value as AudienceAccessDetails["carpoolIncentives"])}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                  <RadioGroupItem value="strong" id="carpool-strong" />
                  <Label htmlFor="carpool-strong" className="font-normal cursor-pointer flex-1">
                    Strong (preferred parking, discounts, matching service)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                  <RadioGroupItem value="moderate" id="carpool-moderate" />
                  <Label htmlFor="carpool-moderate" className="font-normal cursor-pointer flex-1">
                    Moderate (encouraged but not incentivized)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                  <RadioGroupItem value="none" id="carpool-none" />
                  <Label htmlFor="carpool-none" className="font-normal cursor-pointer flex-1">
                    None (no specific encouragement)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Question 8: Multi-Day Event Accommodation */}
            {data.venueLocationType === "remote-destination" && (
              <div className="space-y-3">
                <Label className="text-base font-medium text-slate-800">
                  Accommodation strategy (multi-day events)
                </Label>
                <p className="text-sm text-slate-600">
                  For destination events, how do attendees stay?
                </p>
                <RadioGroup
                  value={data.accommodationStrategy || ""}
                  onValueChange={(value) => updateField("accommodationStrategy", value as AudienceAccessDetails["accommodationStrategy"])}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                    <RadioGroupItem value="on-site-camping" id="accom-camping" />
                    <Label htmlFor="accom-camping" className="font-normal cursor-pointer flex-1">
                      On-Site Camping (lowest additional travel)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                    <RadioGroupItem value="nearby-hotels" id="accom-hotels" />
                    <Label htmlFor="accom-hotels" className="font-normal cursor-pointer flex-1">
                      Nearby Hotels (short daily commute)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded hover:bg-slate-50">
                    <RadioGroupItem value="dispersed" id="accom-dispersed" />
                    <Label htmlFor="accom-dispersed" className="font-normal cursor-pointer flex-1">
                      Dispersed (attendees find own accommodation)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

          </SectionCard>
      )}

      {/* Systems Thinking Callout */}
      <Callout variant="info" icon={Info}>
        <p className="text-sm font-medium text-slate-800">
          How Venue Selection Shapes Everything
        </p>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• <strong>Urban core venue:</strong> Enables transit, reduces parking needs, favors local draw</li>
          <li>• <strong>Suburban venue:</strong> Requires parking, limits transit, increases driving</li>
          <li>• <strong>Remote venue:</strong> Requires accommodation, increases travel distance, often multi-day</li>
          <li>• <strong>Shuttle services:</strong> Can offset poor transit but add operational complexity</li>
        </ul>
      </Callout>

    </div>
  );
}