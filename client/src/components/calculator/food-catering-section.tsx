import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { FoodCateringData, FoodDetailLevel, FoodLiteMode, FoodAdvancedMode } from "@/types/carbon";

interface FoodCateringSectionProps {
  data: FoodCateringData;
  onChange: (data: FoodCateringData) => void;
}

export function FoodCateringSection({ data, onChange }: FoodCateringSectionProps) {
  const handleModeChange = (mode: FoodDetailLevel) => {
    onChange({
      ...data,
      detailLevel: mode,
    });
  };

  const handleLiteModeChange = (field: keyof FoodLiteMode, value: any) => {
    onChange({
      ...data,
      liteMode: {
        ...data.liteMode!,
        [field]: value,
      },
    });
  };

  const handleAdvancedModeChange = (field: keyof FoodAdvancedMode, value: any) => {
    onChange({
      ...data,
      advancedMode: {
        ...data.advancedMode!,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Food & Catering</CardTitle>
          <CardDescription>
            Food is one of the most variable—and controllable—sources of event emissions.
            Rather than counting individual meals, we'll assess how food is planned, sourced, served, and disposed of.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">How detailed do you want to be about food planning?</Label>
            <p className="text-sm text-muted-foreground">
              You can start simple and refine later. Carbon modeling improves with clarity, not guesswork.
            </p>
            <RadioGroup value={data.detailLevel} onValueChange={handleModeChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lite" id="lite" />
                <Label htmlFor="lite" className="font-normal cursor-pointer">
                  Quick Estimate (recommended)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced" className="font-normal cursor-pointer">
                  Detailed Planning (advanced)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Lite Mode */}
          {data.detailLevel === 'lite' && (
            <LiteModeForm 
              data={data.liteMode!} 
              onChange={handleLiteModeChange}
            />
          )}

          {/* Advanced Mode */}
          {data.detailLevel === 'advanced' && (
            <AdvancedModeForm 
              data={data.advancedMode!} 
              onChange={handleAdvancedModeChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface LiteModeFormProps {
  data: FoodLiteMode;
  onChange: (field: keyof FoodLiteMode, value: any) => void;
}

function LiteModeForm({ data, onChange }: LiteModeFormProps) {
  return (
    <div className="space-y-6">
      {/* 1. Food Presence */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Is food provided as part of the event?</Label>
        <RadioGroup value={data.foodProvided} onValueChange={(v) => onChange('foodProvided', v)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="food-none" />
            <Label htmlFor="food-none" className="font-normal cursor-pointer">
              No food provided
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light-catering" id="food-light" />
            <Label htmlFor="food-light" className="font-normal cursor-pointer">
              Light catering (snacks / beverages)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="full-meals" id="food-full" />
            <Label htmlFor="food-full" className="font-normal cursor-pointer">
              Full meals provided
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Only show remaining questions if food is provided */}
      {data.foodProvided !== 'none' && (
        <>
          {/* 2. Service Model */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">How is food mainly served?</Label>
            <RadioGroup value={data.serviceModel} onValueChange={(v) => onChange('serviceModel', v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full-service" id="service-full" />
                <Label htmlFor="service-full" className="font-normal cursor-pointer">
                  Full-service catering
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="buffet" id="service-buffet" />
                <Label htmlFor="service-buffet" className="font-normal cursor-pointer">
                  Buffet / self-serve
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pre-packaged" id="service-prepack" />
                <Label htmlFor="service-prepack" className="font-normal cursor-pointer">
                  Pre-packaged / grab-and-go
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="food-trucks" id="service-trucks" />
                <Label htmlFor="service-trucks" className="font-normal cursor-pointer">
                  Food trucks / external vendors
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="attendee-purchase" id="service-purchase" />
                <Label htmlFor="service-purchase" className="font-normal cursor-pointer">
                  Attendees purchase food independently
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* 3. Sourcing */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">What best describes sourcing?</Label>
            <RadioGroup value={data.sourcing} onValueChange={(v) => onChange('sourcing', v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="local" id="source-local" />
                <Label htmlFor="source-local" className="font-normal cursor-pointer">
                  Mostly local / regional
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mixed" id="source-mixed" />
                <Label htmlFor="source-mixed" className="font-normal cursor-pointer">
                  Mixed sourcing
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="national" id="source-national" />
                <Label htmlFor="source-national" className="font-normal cursor-pointer">
                  Large-scale / national suppliers
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unknown" id="source-unknown" />
                <Label htmlFor="source-unknown" className="font-normal cursor-pointer">
                  Unknown
                </Label>
              </div>
            </RadioGroup>
            
            <div className="flex items-center space-x-2 mt-3">
              <Checkbox 
                id="plant-forward" 
                checked={data.plantForward}
                onCheckedChange={(checked) => onChange('plantForward', checked)}
              />
              <Label htmlFor="plant-forward" className="font-normal cursor-pointer">
                Plant-forward or vegetarian emphasis
              </Label>
            </div>
          </div>

          {/* 4. Scale */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Roughly how many people receive food per day?</Label>
            <RadioGroup value={data.scale} onValueChange={(v) => onChange('scale', v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1-50" id="scale-1" />
                <Label htmlFor="scale-1" className="font-normal cursor-pointer">
                  1–50
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="51-250" id="scale-2" />
                <Label htmlFor="scale-2" className="font-normal cursor-pointer">
                  51–250
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="251-1000" id="scale-3" />
                <Label htmlFor="scale-3" className="font-normal cursor-pointer">
                  251–1,000
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1000+" id="scale-4" />
                <Label htmlFor="scale-4" className="font-normal cursor-pointer">
                  1,000+
                </Label>
              </div>
            </RadioGroup>
          </div>
        </>
      )}
    </div>
  );
}

interface AdvancedModeFormProps {
  data: FoodAdvancedMode;
  onChange: (field: keyof FoodAdvancedMode, value: any) => void;
}

function AdvancedModeForm({ data, onChange }: AdvancedModeFormProps) {
  return (
    <div className="space-y-6">
      {/* Include all Lite Mode questions first */}
      <LiteModeForm 
        data={data} 
        onChange={onChange}
      />

      {/* Only show advanced questions if food is provided */}
      {data.foodProvided !== 'none' && (
        <>
          {/* 1. Groups Fed */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Who is provided food?</Label>
            <p className="text-sm text-muted-foreground">Select all that apply</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="group-staff" 
                  checked={data.groupsFed.staff}
                  onCheckedChange={(checked) => onChange('groupsFed', { ...data.groupsFed, staff: checked })}
                />
                <Label htmlFor="group-staff" className="font-normal cursor-pointer">
                  Event staff / crew
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="group-talent" 
                  checked={data.groupsFed.talent}
                  onCheckedChange={(checked) => onChange('groupsFed', { ...data.groupsFed, talent: checked })}
                />
                <Label htmlFor="group-talent" className="font-normal cursor-pointer">
                  Talent / speakers / artists
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="group-attendees" 
                  checked={data.groupsFed.attendees}
                  onCheckedChange={(checked) => onChange('groupsFed', { ...data.groupsFed, attendees: checked })}
                />
                <Label htmlFor="group-attendees" className="font-normal cursor-pointer">
                  Attendees (general)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="group-vip" 
                  checked={data.groupsFed.vip}
                  onCheckedChange={(checked) => onChange('groupsFed', { ...data.groupsFed, vip: checked })}
                />
                <Label htmlFor="group-vip" className="font-normal cursor-pointer">
                  VIP / hosted guests
                </Label>
              </div>
            </div>
          </div>

          {/* 2. Food Strategy */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Which best reflects your approach?</Label>
            <RadioGroup value={data.foodStrategy} onValueChange={(v) => onChange('foodStrategy', v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="strategy-standard" />
                <Label htmlFor="strategy-standard" className="font-normal cursor-pointer">
                  Standard event catering
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="plant-forward" id="strategy-plant" />
                <Label htmlFor="strategy-plant" className="font-normal cursor-pointer">
                  Plant-forward menus emphasized
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vegetarian-vegan" id="strategy-veg" />
                <Label htmlFor="strategy-veg" className="font-normal cursor-pointer">
                  Fully vegetarian / vegan
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-strategy" id="strategy-none" />
                <Label htmlFor="strategy-none" className="font-normal cursor-pointer">
                  No defined strategy
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* 3. Service Ware */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">What is primarily used?</Label>
            <RadioGroup value={data.serviceWare} onValueChange={(v) => onChange('serviceWare', v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reusable" id="ware-reusable" />
                <Label htmlFor="ware-reusable" className="font-normal cursor-pointer">
                  Reusable dishware
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compostable" id="ware-compost" />
                <Label htmlFor="ware-compost" className="font-normal cursor-pointer">
                  Compostable / recyclable disposables
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mixed-disposable" id="ware-mixed" />
                <Label htmlFor="ware-mixed" className="font-normal cursor-pointer">
                  Mixed disposables
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single-use-plastic" id="ware-plastic" />
                <Label htmlFor="ware-plastic" className="font-normal cursor-pointer">
                  Primarily single-use plastics
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unknown" id="ware-unknown" />
                <Label htmlFor="ware-unknown" className="font-normal cursor-pointer">
                  Unknown
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* 4. Waste Handling */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">What happens to leftover food and waste?</Label>
            <RadioGroup value={data.wasteHandling} onValueChange={(v) => onChange('wasteHandling', v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="composting" id="waste-compost" />
                <Label htmlFor="waste-compost" className="font-normal cursor-pointer">
                  Composting
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="donation" id="waste-donate" />
                <Label htmlFor="waste-donate" className="font-normal cursor-pointer">
                  Donation
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="landfill" id="waste-landfill" />
                <Label htmlFor="waste-landfill" className="font-normal cursor-pointer">
                  Landfill
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-plan" id="waste-none" />
                <Label htmlFor="waste-none" className="font-normal cursor-pointer">
                  No defined waste plan
                </Label>
              </div>
            </RadioGroup>
            
            <div className="space-y-2 mt-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="portion-control" 
                  checked={data.portionControl}
                  onCheckedChange={(checked) => onChange('portionControl', checked)}
                />
                <Label htmlFor="portion-control" className="font-normal cursor-pointer">
                  Portion control / pre-planned quantities used
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="vendor-mitigation" 
                  checked={data.vendorWasteMitigation}
                  onCheckedChange={(checked) => onChange('vendorWasteMitigation', checked)}
                />
                <Label htmlFor="vendor-mitigation" className="font-normal cursor-pointer">
                  Vendor-required waste mitigation
                </Label>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}