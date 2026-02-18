import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Package, Truck } from "lucide-react";
import { ProductionBuildData, ProductionDetailLevel, ProductionBasicMode, ProductionDetailedMode } from "@/types/carbon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductionBuildSectionProps {
  data: ProductionBuildData;
  onChange: (data: ProductionBuildData) => void;
}

export function ProductionBuildSection({ data, onChange }: ProductionBuildSectionProps) {
  const handleModeChange = (mode: ProductionDetailLevel) => {
    const updates: Partial<ProductionBuildData> = {
      detailLevel: mode,
    };
    
    // Initialize detailedMode when switching to detailed
    if (mode === 'detailed' && !data.detailedMode) {
      updates.detailedMode = {
        // Copy basic mode values
        buildStrategy: data.basicMode?.buildStrategy || 'hybrid',
        productionScale: data.basicMode?.productionScale || 'standard',
        transportRequired: data.basicMode?.transportRequired || false,
        // Initialize detailed-specific fields
        venueProvides: {
          stage: false,
          lighting: false,
          sound: false,
          video: false,
          power: false,
          rigging: false,
        },
        bringingOwn: {
          stage: false,
          lighting: false,
          sound: false,
          video: false,
          specialEffects: false,
          customRigging: false,
        },
        vendorStrategy: {
          approach: 'hybrid',
          numberOfVendors: 1,
          localVendors: true,
        },
        transportLogistics: {
          trucksRequired: 0,
          averageDistance: 0,
          consolidatedShipping: true,
          freightFlights: 0,
        },
        buildTime: {
          loadInDays: 1,
          strikeDownDays: 1,
          crewSize: 10,
        },
      };
    }
    
    onChange({
      ...data,
      ...updates,
    });
  };

  const handleBasicModeChange = (field: keyof ProductionBasicMode, value: any) => {
    onChange({
      ...data,
      basicMode: {
        ...data.basicMode!,
        [field]: value,
      },
    });
  };

  const handleDetailedModeChange = (field: keyof ProductionDetailedMode, value: any) => {
    onChange({
      ...data,
      detailedMode: {
        ...data.detailedMode!,
        [field]: value,
      },
    });
  };

  const handleVenueProvidesChange = (field: string, value: boolean) => {
    onChange({
      ...data,
      detailedMode: {
        ...data.detailedMode!,
        venueProvides: {
          ...data.detailedMode!.venueProvides,
          [field]: value,
        },
      },
    });
  };

  const handleBringingOwnChange = (field: string, value: boolean) => {
    onChange({
      ...data,
      detailedMode: {
        ...data.detailedMode!,
        bringingOwn: {
          ...data.detailedMode!.bringingOwn,
          [field]: value,
        },
      },
    });
  };

  const handleVendorStrategyChange = (field: string, value: any) => {
    onChange({
      ...data,
      detailedMode: {
        ...data.detailedMode!,
        vendorStrategy: {
          ...data.detailedMode!.vendorStrategy,
          [field]: value,
        },
      },
    });
  };

  const handleTransportLogisticsChange = (field: string, value: any) => {
    onChange({
      ...data,
      detailedMode: {
        ...data.detailedMode!,
        transportLogistics: {
          ...data.detailedMode!.transportLogistics,
          [field]: value,
        },
      },
    });
  };

  const handleBuildTimeChange = (field: string, value: any) => {
    onChange({
      ...data,
      detailedMode: {
        ...data.detailedMode!,
        buildTime: {
          ...data.detailedMode!.buildTime,
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-500" />
            <CardTitle>Production Build & Infrastructure</CardTitle>
          </div>
          <CardDescription>
            Production decisions are about control vs. carbon vs. cost. Are you bringing your full rig, 
            renting locally, or using venue infrastructure? Each choice has tradeoffs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">How detailed do you want to be about production planning?</Label>
            <p className="text-sm text-muted-foreground">
              Start with your build strategy or dive into vendor coordination and logistics.
            </p>
            <RadioGroup value={data.detailLevel} onValueChange={handleModeChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="basic" id="prod-basic" />
                <Label htmlFor="prod-basic" className="font-normal cursor-pointer">
                  Basic (recommended for most events)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="detailed" id="prod-detailed" />
                <Label htmlFor="prod-detailed" className="font-normal cursor-pointer">
                  Detailed (for complex productions)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Basic Mode */}
          {data.detailLevel === 'basic' && (
            <BasicModeForm 
              data={data.basicMode!} 
              onChange={handleBasicModeChange}
            />
          )}

          {/* Detailed Mode */}
          {data.detailLevel === 'detailed' && (
            <DetailedModeForm 
              data={data.detailedMode!} 
              onBasicChange={handleDetailedModeChange}
              onVenueProvidesChange={handleVenueProvidesChange}
              onBringingOwnChange={handleBringingOwnChange}
              onVendorStrategyChange={handleVendorStrategyChange}
              onTransportLogisticsChange={handleTransportLogisticsChange}
              onBuildTimeChange={handleBuildTimeChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface BasicModeFormProps {
  data: ProductionBasicMode;
  onChange: (field: keyof ProductionBasicMode, value: any) => void;
}

function BasicModeForm({ data, onChange }: BasicModeFormProps) {
  return (
    <div className="space-y-6">
      {/* 1. Build Strategy */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">What's your production build strategy?</Label>
        <p className="text-sm text-muted-foreground">
          This is the core tradeoff: control vs. local resources vs. carbon.
        </p>
        <RadioGroup value={data.buildStrategy} onValueChange={(v) => onChange('buildStrategy', v)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="venue-provided" id="strategy-venue" />
            <Label htmlFor="strategy-venue" className="font-normal cursor-pointer">
              📍 Using venue infrastructure (lowest carbon)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rent-locally" id="strategy-rent" />
            <Label htmlFor="strategy-rent" className="font-normal cursor-pointer">
              🏪 Renting locally (balanced approach)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hybrid" id="strategy-hybrid" />
            <Label htmlFor="strategy-hybrid" className="font-normal cursor-pointer">
              🔄 Hybrid (some touring gear, some local)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bring-full-rig" id="strategy-bring" />
            <Label htmlFor="strategy-bring" className="font-normal cursor-pointer">
              🚚 Bringing full touring rig (highest control)
            </Label>
          </div>
        </RadioGroup>

        {/* Contextual notes based on selection */}
        {data.buildStrategy === 'bring-full-rig' && (
          <Alert>
            <Truck className="h-4 w-4" />
            <AlertDescription>
              <strong>Bringing your full rig maximizes control</strong> but increases transportation 
              emissions and logistics complexity. Consider if venue or local rental can meet your needs.
            </AlertDescription>
          </Alert>
        )}

        {data.buildStrategy === 'venue-provided' && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Using venue infrastructure is most efficient</strong> but may limit your 
              production capabilities. Verify venue equipment meets your technical requirements.
            </AlertDescription>
          </Alert>
        )}

        {data.buildStrategy === 'rent-locally' && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Local rental balances control and carbon</strong> but requires advance 
              coordination and may have availability constraints in some markets.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* 2. Production Scale */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">What's your production scale?</Label>
        <p className="text-sm text-muted-foreground">
          Think about complexity and infrastructure, not just size.
        </p>
        <RadioGroup value={data.productionScale} onValueChange={(v) => onChange('productionScale', v)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="minimal" id="scale-minimal" />
            <Label htmlFor="scale-minimal" className="font-normal cursor-pointer">
              Minimal (basic AV, simple setup)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="standard" id="scale-standard" />
            <Label htmlFor="scale-standard" className="font-normal cursor-pointer">
              Standard (full AV, lighting, single stage)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="full-production" id="scale-full" />
            <Label htmlFor="scale-full" className="font-normal cursor-pointer">
              Full production (elaborate setup, multiple elements)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="festival" id="scale-festival" />
            <Label htmlFor="scale-festival" className="font-normal cursor-pointer">
              Festival (multiple stages, full infrastructure)
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* 3. Transport Required */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Does your build strategy require equipment transport?</Label>
        <RadioGroup 
          value={data.transportRequired ? 'yes' : 'no'} 
          onValueChange={(v) => onChange('transportRequired', v === 'yes')}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="transport-yes" />
            <Label htmlFor="transport-yes" className="font-normal cursor-pointer">
              Yes, transporting equipment
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="transport-no" />
            <Label htmlFor="transport-no" className="font-normal cursor-pointer">
              No, using local/venue equipment
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

interface DetailedModeFormProps {
  data: ProductionDetailedMode;
  onBasicChange: (field: keyof ProductionDetailedMode, value: any) => void;
  onVenueProvidesChange: (field: string, value: boolean) => void;
  onBringingOwnChange: (field: string, value: boolean) => void;
  onVendorStrategyChange: (field: string, value: any) => void;
  onTransportLogisticsChange: (field: string, value: any) => void;
  onBuildTimeChange: (field: string, value: any) => void;
}

function DetailedModeForm({ 
  data, 
  onBasicChange,
  onVenueProvidesChange,
  onBringingOwnChange,
  onVendorStrategyChange,
  onTransportLogisticsChange,
  onBuildTimeChange
}: DetailedModeFormProps) {
  return (
    <div className="space-y-6">
      {/* Include all Basic Mode questions first */}
      <BasicModeForm 
        data={data} 
        onChange={onBasicChange}
      />

      {/* Detailed Mode Additional Questions */}
      
      {/* 1. What Venue Provides */}
      <div className="space-y-4 pt-4 border-t">
        <Label className="text-base font-semibold">What does the venue provide?</Label>
        <p className="text-sm text-muted-foreground">
          Understanding venue capabilities helps optimize your build strategy.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="venue-stage" 
              checked={data.venueProvides.stage}
              onCheckedChange={(checked) => onVenueProvidesChange('stage', !!checked)}
            />
            <Label htmlFor="venue-stage" className="font-normal cursor-pointer">
              Stage/Platform
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="venue-lighting" 
              checked={data.venueProvides.lighting}
              onCheckedChange={(checked) => onVenueProvidesChange('lighting', !!checked)}
            />
            <Label htmlFor="venue-lighting" className="font-normal cursor-pointer">
              Lighting rig
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="venue-sound" 
              checked={data.venueProvides.sound}
              onCheckedChange={(checked) => onVenueProvidesChange('sound', !!checked)}
            />
            <Label htmlFor="venue-sound" className="font-normal cursor-pointer">
              Sound system
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="venue-video" 
              checked={data.venueProvides.video}
              onCheckedChange={(checked) => onVenueProvidesChange('video', !!checked)}
            />
            <Label htmlFor="venue-video" className="font-normal cursor-pointer">
              Video/Screens
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="venue-power" 
              checked={data.venueProvides.power}
              onCheckedChange={(checked) => onVenueProvidesChange('power', !!checked)}
            />
            <Label htmlFor="venue-power" className="font-normal cursor-pointer">
              Power distribution
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="venue-rigging" 
              checked={data.venueProvides.rigging}
              onCheckedChange={(checked) => onVenueProvidesChange('rigging', !!checked)}
            />
            <Label htmlFor="venue-rigging" className="font-normal cursor-pointer">
              Rigging points
            </Label>
          </div>
        </div>
      </div>

      {/* 2. What You're Bringing */}
      <div className="space-y-4 pt-4 border-t">
        <Label className="text-base font-semibold">What are you bringing?</Label>
        <p className="text-sm text-muted-foreground">
          Each item you bring increases transport emissions but gives you more control.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="bring-stage" 
              checked={data.bringingOwn.stage}
              onCheckedChange={(checked) => onBringingOwnChange('stage', !!checked)}
            />
            <Label htmlFor="bring-stage" className="font-normal cursor-pointer">
              Stage/Platform
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="bring-lighting" 
              checked={data.bringingOwn.lighting}
              onCheckedChange={(checked) => onBringingOwnChange('lighting', !!checked)}
            />
            <Label htmlFor="bring-lighting" className="font-normal cursor-pointer">
              Lighting rig
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="bring-sound" 
              checked={data.bringingOwn.sound}
              onCheckedChange={(checked) => onBringingOwnChange('sound', !!checked)}
            />
            <Label htmlFor="bring-sound" className="font-normal cursor-pointer">
              Sound system
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="bring-video" 
              checked={data.bringingOwn.video}
              onCheckedChange={(checked) => onBringingOwnChange('video', !!checked)}
            />
            <Label htmlFor="bring-video" className="font-normal cursor-pointer">
              Video/Screens
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="bring-fx" 
              checked={data.bringingOwn.specialEffects}
              onCheckedChange={(checked) => onBringingOwnChange('specialEffects', !!checked)}
            />
            <Label htmlFor="bring-fx" className="font-normal cursor-pointer">
              Special effects
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="bring-rigging" 
              checked={data.bringingOwn.customRigging}
              onCheckedChange={(checked) => onBringingOwnChange('customRigging', !!checked)}
            />
            <Label htmlFor="bring-rigging" className="font-normal cursor-pointer">
              Custom rigging
            </Label>
          </div>
        </div>
      </div>

      {/* 3. Vendor Strategy */}
      <div className="space-y-4 pt-4 border-t">
        <Label className="text-base font-semibold">Vendor Coordination Strategy</Label>
        
        <div className="space-y-3">
          <Label className="text-sm">Vendor Approach</Label>
          <RadioGroup 
            value={data.vendorStrategy.approach} 
            onValueChange={(v) => onVendorStrategyChange('approach', v)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="single-vendor" id="vendor-single" />
              <Label htmlFor="vendor-single" className="font-normal cursor-pointer">
                Single vendor (one-stop shop)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="multiple-specialists" id="vendor-multiple" />
              <Label htmlFor="vendor-multiple" className="font-normal cursor-pointer">
                Multiple specialists (best-in-class)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hybrid" id="vendor-hybrid" />
              <Label htmlFor="vendor-hybrid" className="font-normal cursor-pointer">
                Hybrid (mix of consolidated and specialist)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="in-house" id="vendor-inhouse" />
              <Label htmlFor="vendor-inhouse" className="font-normal cursor-pointer">
                In-house (own equipment and crew)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {(data.vendorStrategy.approach === 'multiple-specialists' || data.vendorStrategy.approach === 'hybrid') && (
          <div className="space-y-3">
            <Label className="text-sm">Number of Vendors</Label>
            <Select 
              value={data.vendorStrategy.numberOfVendors.toString()} 
              onValueChange={(v) => onVendorStrategyChange('numberOfVendors', parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 vendors</SelectItem>
                <SelectItem value="3">3 vendors</SelectItem>
                <SelectItem value="4">4 vendors</SelectItem>
                <SelectItem value="5">5+ vendors</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="local-vendors" 
            checked={data.vendorStrategy.localVendors}
            onCheckedChange={(checked) => onVendorStrategyChange('localVendors', !!checked)}
          />
          <Label htmlFor="local-vendors" className="font-normal cursor-pointer">
            Using local vendors (reduces transport emissions)
          </Label>
        </div>
      </div>

      {/* 4. Transport Logistics */}
      {data.transportRequired && (
        <div className="space-y-4 pt-4 border-t">
          <Label className="text-base font-semibold">Transport Logistics</Label>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Trucks Required</Label>
              <Input
                type="number"
                value={data.transportLogistics.trucksRequired}
                onChange={(e) => onTransportLogisticsChange('trucksRequired', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Average Distance (km)</Label>
              <Input
                type="number"
                value={data.transportLogistics.averageDistance}
                onChange={(e) => onTransportLogisticsChange('averageDistance', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Freight Flights</Label>
              <Input
                type="number"
                value={data.transportLogistics.freightFlights}
                onChange={(e) => onTransportLogisticsChange('freightFlights', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="consolidated-shipping" 
              checked={data.transportLogistics.consolidatedShipping}
              onCheckedChange={(checked) => onTransportLogisticsChange('consolidatedShipping', !!checked)}
            />
            <Label htmlFor="consolidated-shipping" className="font-normal cursor-pointer">
              Consolidated shipping (reduces trips and emissions)
            </Label>
          </div>
        </div>
      )}

      {/* 5. Build Time */}
      <div className="space-y-4 pt-4 border-t">
        <Label className="text-base font-semibold">Build Time & Crew</Label>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm">Load-in Days</Label>
            <Input
              type="number"
              value={data.buildTime.loadInDays}
              onChange={(e) => onBuildTimeChange('loadInDays', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Strike-down Days</Label>
            <Input
              type="number"
              value={data.buildTime.strikeDownDays}
              onChange={(e) => onBuildTimeChange('strikeDownDays', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Crew Size</Label>
            <Input
              type="number"
              value={data.buildTime.crewSize}
              onChange={(e) => onBuildTimeChange('crewSize', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Longer build times increase crew accommodation and meal emissions. 
            Efficient load-in/strike reduces both cost and carbon.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}