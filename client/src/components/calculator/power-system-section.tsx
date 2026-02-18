

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Zap, AlertTriangle } from "lucide-react";
import { PowerSystemData, PowerDetailLevel, PowerBasicMode, PowerDetailedMode } from "@/types/carbon";
import { SectionCard } from "@/components/ui/section-card";
import { Callout } from "@/components/ui/callout";
import { QuestionBlock } from "@/components/ui/question-block";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PowerSystemSectionProps {
  data: PowerSystemData;
  onChange: (data: PowerSystemData) => void;
}

export function PowerSystemSection({ data, onChange }: PowerSystemSectionProps) {
  const handleModeChange = (mode: PowerDetailLevel) => {
    const updates: Partial<PowerSystemData> = {
      detailLevel: mode,
    };
    
    // Initialize detailedMode when switching to detailed
    if (mode === 'detailed' && !data.detailedMode) {
      updates.detailedMode = {
        // Copy basic mode values
        primarySource: data.basicMode?.primarySource || 'grid',
        backupRequired: data.basicMode?.backupRequired || false,
        estimatedLoad: data.basicMode?.estimatedLoad || 'medium',
        // Initialize detailed-specific fields
        backupStrategy: {
          hasBackup: data.basicMode?.backupRequired || false,
          backupType: 'generator',
          backupCapacity: 'partial',
        },
        distribution: {
          strategy: 'centralized',
          zones: 1,
        },
        loadProfile: {
          peakLoad: 'medium',
          sustainedLoad: 'medium',
          criticalSystems: true,
        },
        venueCapabilities: {
          gridAvailable: data.basicMode?.primarySource === 'grid',
          gridCapacity: 'adequate',
          existingInfrastructure: false,
        },
      };
    }
    
    onChange({
      ...data,
      ...updates,
    });
  };

  const handleBasicModeChange = (field: keyof PowerBasicMode, value: any) => {
    onChange({
      ...data,
      basicMode: {
        ...data.basicMode!,
        [field]: value,
      },
    });
  };

  const handleDetailedModeChange = (field: keyof PowerDetailedMode, value: any) => {
    onChange({
      ...data,
      detailedMode: {
        ...data.detailedMode!,
        [field]: value,
      },
    });
  };

  const handleBackupStrategyChange = (field: string, value: any) => {
    onChange({
      ...data,
      detailedMode: {
        ...data.detailedMode!,
        backupStrategy: {
          ...data.detailedMode!.backupStrategy,
          [field]: value,
        },
      },
    });
  };

  const handleDistributionChange = (field: string, value: any) => {
    onChange({
      ...data,
      detailedMode: {
        ...data.detailedMode!,
        distribution: {
          ...data.detailedMode!.distribution,
          [field]: value,
        },
      },
    });
  };

  const handleLoadProfileChange = (field: string, value: any) => {
    onChange({
      ...data,
      detailedMode: {
        ...data.detailedMode!,
        loadProfile: {
          ...data.detailedMode!.loadProfile,
          [field]: value,
        },
      },
    });
  };

  const handleVenueCapabilitiesChange = (field: string, value: any) => {
    onChange({
      ...data,
      detailedMode: {
        ...data.detailedMode!,
        venueCapabilities: {
          ...data.detailedMode!.venueCapabilities,
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-slate-800 flex items-center">
          <Zap className="h-5 w-5 text-primary mr-2" />
          How the Event Is Powered (and Backed Up)
        </h2>
        <p className="text-slate-600 leading-relaxed">
          Power strategy shapes reliability, cost, and carbon impact. Model your primary source, backup requirements, and distribution approach.
        </p>
      </div>

      {/* Basic Mode */}
      <SectionCard title="Core Power Strategy" description="3 questions • ~2 minutes" variant="default">
          {/* Mode Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">How detailed do you want to be about power planning?</Label>
            <p className="text-sm text-muted-foreground">
              Start simple or dive into distribution strategy and redundancy requirements.
            </p>
            <RadioGroup value={data.detailLevel} onValueChange={handleModeChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="basic" id="power-basic" />
                <Label htmlFor="power-basic" className="font-normal cursor-pointer">
                  Basic (recommended for most events)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="detailed" id="power-detailed" />
                <Label htmlFor="power-detailed" className="font-normal cursor-pointer">
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
          {data.detailLevel === 'detailed' && data.detailedMode && (
            <DetailedModeForm 
              data={data.detailedMode} 
              onBasicChange={handleDetailedModeChange}
              onBackupChange={handleBackupStrategyChange}
              onDistributionChange={handleDistributionChange}
              onLoadProfileChange={handleLoadProfileChange}
              onVenueCapabilitiesChange={handleVenueCapabilitiesChange}
            />
          )}
        </SectionCard>
    </div>
  );
}

interface BasicModeFormProps {
  data: PowerBasicMode;
  onChange: (field: keyof PowerBasicMode, value: any) => void;
}

function BasicModeForm({ data, onChange }: BasicModeFormProps) {
  return (
    <div className="space-y-6">
      {/* 1. Primary Power Source */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">What's your primary power source?</Label>
        <RadioGroup value={data.primarySource} onValueChange={(v) => onChange('primarySource', v)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="grid" id="primary-grid" />
            <Label htmlFor="primary-grid" className="font-normal cursor-pointer">
              🔌 Venue grid power
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="generator" id="primary-generator" />
            <Label htmlFor="primary-generator" className="font-normal cursor-pointer">
              ⚡ Generators (diesel/gas)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="renewable" id="primary-renewable" />
            <Label htmlFor="primary-renewable" className="font-normal cursor-pointer">
              ☀️ Renewable (solar/wind/battery)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hybrid" id="primary-hybrid" />
            <Label htmlFor="primary-hybrid" className="font-normal cursor-pointer">
              🔄 Hybrid (grid + generator/renewable)
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* 2. Backup Power Required */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Do you need backup power?</Label>
        <p className="text-sm text-muted-foreground">
          Safety, insurance, or critical systems may require redundancy.
        </p>
        <RadioGroup 
          value={data.backupRequired ? 'yes' : 'no'} 
          onValueChange={(v) => onChange('backupRequired', v === 'yes')}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="backup-yes" />
            <Label htmlFor="backup-yes" className="font-normal cursor-pointer">
              Yes, backup power required
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="backup-no" />
            <Label htmlFor="backup-no" className="font-normal cursor-pointer">
              No backup needed
            </Label>
          </div>
        </RadioGroup>

        {data.backupRequired && (
          <Alert className="mt-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Backup power increases emissions</strong> but is often non-negotiable for safety, 
              insurance, or critical systems. This is a reliability vs. efficiency tradeoff.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* 3. Estimated Load */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">What's your estimated power load?</Label>
        <p className="text-sm text-muted-foreground">
          Think about your production scale, not exact kilowatts.
        </p>
        <RadioGroup value={data.estimatedLoad} onValueChange={(v) => onChange('estimatedLoad', v)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="small" id="load-small" />
            <Label htmlFor="load-small" className="font-normal cursor-pointer">
              Small (basic AV, lighting)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="load-medium" />
            <Label htmlFor="load-medium" className="font-normal cursor-pointer">
              Medium (full production, single stage)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="large" id="load-large" />
            <Label htmlFor="load-large" className="font-normal cursor-pointer">
              Large (multiple stages, extensive production)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="festival" id="load-festival" />
            <Label htmlFor="load-festival" className="font-normal cursor-pointer">
              Festival (multiple stages, full infrastructure)
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

interface DetailedModeFormProps {
  data: PowerDetailedMode;
  onBasicChange: (field: keyof PowerDetailedMode, value: any) => void;
  onBackupChange: (field: string, value: any) => void;
  onDistributionChange: (field: string, value: any) => void;
  onLoadProfileChange: (field: string, value: any) => void;
  onVenueCapabilitiesChange: (field: string, value: any) => void;
}

function DetailedModeForm({ 
  data, 
  onBasicChange, 
  onBackupChange, 
  onDistributionChange, 
  onLoadProfileChange,
  onVenueCapabilitiesChange 
}: DetailedModeFormProps) {
  return (
    <div className="space-y-6">
      {/* Include all Basic Mode questions first */}
      <BasicModeForm 
        data={data} 
        onChange={onBasicChange}
      />

      {/* Detailed Mode Additional Questions */}
      
      {/* 1. Backup Strategy */}
      <div className="space-y-4 pt-4 border-t">
        <Label className="text-base font-semibold">Backup Power Strategy</Label>
        
        <div className="space-y-3">
          <Label className="text-sm">Backup Type</Label>
          <Select 
            value={data.backupStrategy.backupType} 
            onValueChange={(v) => onBackupChange('backupType', v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No backup</SelectItem>
              <SelectItem value="generator">Generator</SelectItem>
              <SelectItem value="battery">Battery system</SelectItem>
              <SelectItem value="redundant-grid">Redundant grid connection</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {data.backupStrategy.backupType !== 'none' && (
          <div className="space-y-3">
            <Label className="text-sm">Backup Capacity</Label>
            <RadioGroup 
              value={data.backupStrategy.backupCapacity} 
              onValueChange={(v) => onBackupChange('backupCapacity', v)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="critical-only" id="capacity-critical" />
                <Label htmlFor="capacity-critical" className="font-normal cursor-pointer">
                  Critical systems only (safety, emergency)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partial" id="capacity-partial" />
                <Label htmlFor="capacity-partial" className="font-normal cursor-pointer">
                  Partial (critical + essential production)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full" id="capacity-full" />
                <Label htmlFor="capacity-full" className="font-normal cursor-pointer">
                  Full (complete redundancy)
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}
      </div>

      {/* 2. Power Distribution */}
      <div className="space-y-4 pt-4 border-t">
        <Label className="text-base font-semibold">Power Distribution Strategy</Label>
        
        <div className="space-y-3">
          <Label className="text-sm">Distribution Approach</Label>
          <RadioGroup 
            value={data.distribution.strategy} 
            onValueChange={(v) => onDistributionChange('strategy', v)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="centralized" id="dist-central" />
              <Label htmlFor="dist-central" className="font-normal cursor-pointer">
                Centralized (single power source)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="distributed" id="dist-distributed" />
              <Label htmlFor="dist-distributed" className="font-normal cursor-pointer">
                Distributed (multiple power zones)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hybrid" id="dist-hybrid" />
              <Label htmlFor="dist-hybrid" className="font-normal cursor-pointer">
                Hybrid (central + distributed)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {(data.distribution.strategy === 'distributed' || data.distribution.strategy === 'hybrid') && (
          <div className="space-y-3">
            <Label className="text-sm">Number of Power Zones</Label>
            <Select 
              value={data.distribution.zones.toString()} 
              onValueChange={(v) => onDistributionChange('zones', parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 zones</SelectItem>
                <SelectItem value="3">3 zones</SelectItem>
                <SelectItem value="4">4 zones</SelectItem>
                <SelectItem value="5">5+ zones</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* 3. Load Profile */}
      <div className="space-y-4 pt-4 border-t">
        <Label className="text-base font-semibold">Load Profile</Label>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label className="text-sm">Peak Load</Label>
            <Select 
              value={data.loadProfile.peakLoad} 
              onValueChange={(v) => onLoadProfileChange('peakLoad', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="extreme">Extreme</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm">Sustained Load</Label>
            <Select 
              value={data.loadProfile.sustainedLoad} 
              onValueChange={(v) => onLoadProfileChange('sustainedLoad', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-3">
          <Checkbox 
            id="critical-systems" 
            checked={data.loadProfile.criticalSystems}
            onCheckedChange={(checked) => onLoadProfileChange('criticalSystems', checked)}
          />
          <Label htmlFor="critical-systems" className="font-normal cursor-pointer">
            Critical systems require uninterrupted power (safety, medical, security)
          </Label>
        </div>
      </div>

      {/* 4. Venue Capabilities */}
      <div className="space-y-4 pt-4 border-t">
        <Label className="text-base font-semibold">Venue Power Capabilities</Label>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="grid-available" 
              checked={data.venueCapabilities.gridAvailable}
              onCheckedChange={(checked) => onVenueCapabilitiesChange('gridAvailable', checked)}
            />
            <Label htmlFor="grid-available" className="font-normal cursor-pointer">
              Venue has grid power available
            </Label>
          </div>

          {data.venueCapabilities.gridAvailable && (
            <div className="space-y-3 ml-6">
              <Label className="text-sm">Grid Capacity</Label>
              <RadioGroup 
                value={data.venueCapabilities.gridCapacity} 
                onValueChange={(v) => onVenueCapabilitiesChange('gridCapacity', v)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="insufficient" id="capacity-insufficient" />
                  <Label htmlFor="capacity-insufficient" className="font-normal cursor-pointer">
                    Insufficient (need supplemental power)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="adequate" id="capacity-adequate" />
                  <Label htmlFor="capacity-adequate" className="font-normal cursor-pointer">
                    Adequate (meets basic needs)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="abundant" id="capacity-abundant" />
                  <Label htmlFor="capacity-abundant" className="font-normal cursor-pointer">
                    Abundant (more than enough)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="existing-infrastructure" 
              checked={data.venueCapabilities.existingInfrastructure}
              onCheckedChange={(checked) => onVenueCapabilitiesChange('existingInfrastructure', checked)}
            />
            <Label htmlFor="existing-infrastructure" className="font-normal cursor-pointer">
              Venue has existing power distribution infrastructure
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}