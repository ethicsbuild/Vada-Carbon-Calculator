import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RocketIcon, Calculator, Zap } from 'lucide-react';
import type { CalculationResult, OrganizationProfile, Scope1Data, Scope2Data, Scope3Data } from '@/types/carbon';

const organizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  type: z.enum(['corporate', 'government', 'ngo', 'university', 'event']),
  size: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']),
  industry: z.string().min(1, 'Industry is required'),
  reportingYear: z.number().min(2020).max(2025),
  calculationMethod: z.enum(['guided', 'estimation', 'detailed']),
  scopes: z.array(z.enum(['scope1', 'scope2', 'scope3'])).min(1, 'Select at least one scope'),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

interface CalculationFormProps {
  onEstimate: (data: any) => Promise<CalculationResult>;
  onCalculate: (data: any) => Promise<CalculationResult>;
  isLoading: boolean;
  result?: CalculationResult;
}

export function CalculationForm({ onEstimate, onCalculate, isLoading, result }: CalculationFormProps) {
  const [activeTab, setActiveTab] = useState('setup');
  const [organizationData, setOrganizationData] = useState<OrganizationFormData | null>(null);
  const [scope1Data, setScope1Data] = useState<Scope1Data>({});
  const [scope2Data, setScope2Data] = useState<Scope2Data>({});
  const [scope3Data, setScope3Data] = useState<Scope3Data>({});

  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      type: 'corporate',
      size: '51-200',
      reportingYear: 2024,
      calculationMethod: 'guided',
      scopes: ['scope1', 'scope2', 'scope3'],
    },
  });

  const handleOrganizationSubmit = async (data: OrganizationFormData) => {
    setOrganizationData(data);
    
    if (data.calculationMethod === 'estimation') {
      // Quick estimation
      await onEstimate({
        organizationType: data.type,
        organizationSize: data.size,
        industry: data.industry,
      });
    } else {
      // Move to detailed calculation tabs
      setActiveTab('scope1');
    }
  };

  const handleDetailedCalculation = async () => {
    if (!organizationData) return;
    
    await onCalculate({
      scope1Data,
      scope2Data,
      scope3Data,
      organizationSize: organizationData.size,
      industry: organizationData.industry,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="w-5 h-5 mr-2 text-green-600" />
          Carbon Footprint Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="scope1" disabled={!organizationData}>Scope 1</TabsTrigger>
            <TabsTrigger value="scope2" disabled={!organizationData}>Scope 2</TabsTrigger>
            <TabsTrigger value="scope3" disabled={!organizationData}>Scope 3</TabsTrigger>
            <TabsTrigger value="results" disabled={!result}>Results</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            <form onSubmit={form.handleSubmit(handleOrganizationSubmit)} className="space-y-6">
              {/* Organization Type */}
              <div>
                <Label className="text-sm font-medium">Organization Type</Label>
                <Select 
                  value={form.watch('type')} 
                  onValueChange={(value: any) => form.setValue('type', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select organization type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporate">Corporate/Business</SelectItem>
                    <SelectItem value="government">Government Agency</SelectItem>
                    <SelectItem value="ngo">Non-Profit Organization</SelectItem>
                    <SelectItem value="university">University/Educational</SelectItem>
                    <SelectItem value="event">Event/Conference</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.type && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.type.message}</p>
                )}
              </div>

              {/* Organization Name */}
              <div>
                <Label className="text-sm font-medium">Organization Name</Label>
                <Input 
                  className="mt-2"
                  placeholder="Enter your organization name"
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              {/* Company Size */}
              <div>
                <Label className="text-sm font-medium">Company Size (Employees)</Label>
                <Select 
                  value={form.watch('size')} 
                  onValueChange={(value: any) => form.setValue('size', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="501-1000">501-1000 employees</SelectItem>
                    <SelectItem value="1000+">1000+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Industry */}
              <div>
                <Label className="text-sm font-medium">Industry Sector</Label>
                <Select 
                  value={form.watch('industry')} 
                  onValueChange={(value) => form.setValue('industry', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select industry..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology/Software</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="retail">Retail/Consumer Goods</SelectItem>
                    <SelectItem value="finance">Financial Services</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="energy">Energy/Utilities</SelectItem>
                    <SelectItem value="transportation">Transportation/Logistics</SelectItem>
                    <SelectItem value="construction">Construction/Real Estate</SelectItem>
                    <SelectItem value="agriculture">Agriculture/Food</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.industry && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.industry.message}</p>
                )}
              </div>

              {/* Reporting Period */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Reporting Year</Label>
                  <Select 
                    value={form.watch('reportingYear').toString()} 
                    onValueChange={(value) => form.setValue('reportingYear', parseInt(value))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Calculation Method</Label>
                  <Select 
                    value={form.watch('calculationMethod')} 
                    onValueChange={(value: any) => form.setValue('calculationMethod', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guided">AI-Guided (Recommended)</SelectItem>
                      <SelectItem value="estimation">Quick Estimation</SelectItem>
                      <SelectItem value="detailed">Detailed Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Scopes Selection */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Emission Scopes to Calculate</Label>
                <div className="space-y-3">
                  {[
                    {
                      id: 'scope1',
                      title: 'Scope 1 - Direct Emissions',
                      description: 'Company vehicles, facilities, manufacturing'
                    },
                    {
                      id: 'scope2',
                      title: 'Scope 2 - Indirect Energy',
                      description: 'Purchased electricity, heating, cooling'
                    },
                    {
                      id: 'scope3',
                      title: 'Scope 3 - Value Chain',
                      description: 'Supply chain, business travel, waste'
                    }
                  ].map((scope) => (
                    <div key={scope.id} className="flex items-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Checkbox
                        id={scope.id}
                        checked={form.watch('scopes').includes(scope.id as any)}
                        onCheckedChange={(checked) => {
                          const currentScopes = form.watch('scopes');
                          if (checked) {
                            form.setValue('scopes', [...currentScopes, scope.id as any]);
                          } else {
                            form.setValue('scopes', currentScopes.filter(s => s !== scope.id));
                          }
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">{scope.title}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{scope.description}</div>
                        {scope.id === 'scope3' && (
                          <Badge variant="secondary" className="mt-1 text-xs bg-orange-100 text-orange-700">
                            Required per 2025 GHG Protocol
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {form.formState.errors.scopes && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.scopes.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <RocketIcon className="w-4 h-4 mr-2" />
                    Start Calculation with AI Co-Pilot
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="scope1" className="space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Scope 1 - Direct Emissions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Direct GHG emissions from sources owned or controlled by your organization
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Natural Gas (kWh/year)</Label>
                <Input
                  type="number"
                  className="mt-1"
                  value={scope1Data.naturalGas || ''}
                  onChange={(e) => setScope1Data(prev => ({...prev, naturalGas: parseFloat(e.target.value) || 0}))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Gasoline (liters/year)</Label>
                <Input
                  type="number"
                  className="mt-1"
                  value={scope1Data.gasoline || ''}
                  onChange={(e) => setScope1Data(prev => ({...prev, gasoline: parseFloat(e.target.value) || 0}))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Diesel (liters/year)</Label>
                <Input
                  type="number"
                  className="mt-1"
                  value={scope1Data.diesel || ''}
                  onChange={(e) => setScope1Data(prev => ({...prev, diesel: parseFloat(e.target.value) || 0}))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Propane (kg/year)</Label>
                <Input
                  type="number"
                  className="mt-1"
                  value={scope1Data.propane || ''}
                  onChange={(e) => setScope1Data(prev => ({...prev, propane: parseFloat(e.target.value) || 0}))}
                />
              </div>
            </div>
            
            <Button onClick={() => setActiveTab('scope2')} className="w-full">
              Continue to Scope 2 <Zap className="w-4 h-4 ml-2" />
            </Button>
          </TabsContent>

          <TabsContent value="scope2" className="space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Scope 2 - Energy Indirect</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Indirect GHG emissions from purchased electricity, steam, heating and cooling
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Electricity (kWh/year)</Label>
                <Input
                  type="number"
                  className="mt-1"
                  value={scope2Data.electricity || ''}
                  onChange={(e) => setScope2Data(prev => ({...prev, electricity: parseFloat(e.target.value) || 0}))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Heating (kWh/year)</Label>
                <Input
                  type="number"
                  className="mt-1"
                  value={scope2Data.heating || ''}
                  onChange={(e) => setScope2Data(prev => ({...prev, heating: parseFloat(e.target.value) || 0}))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Cooling (kWh/year)</Label>
                <Input
                  type="number"
                  className="mt-1"
                  value={scope2Data.cooling || ''}
                  onChange={(e) => setScope2Data(prev => ({...prev, cooling: parseFloat(e.target.value) || 0}))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Grid Emission Factor (optional)</Label>
                <Input
                  type="number"
                  step="0.001"
                  className="mt-1"
                  placeholder="kgCO2e/kWh"
                  value={scope2Data.gridEmissionFactor || ''}
                  onChange={(e) => setScope2Data(prev => ({...prev, gridEmissionFactor: parseFloat(e.target.value) || undefined}))}
                />
              </div>
            </div>
            
            <Button onClick={() => setActiveTab('scope3')} className="w-full">
              Continue to Scope 3
            </Button>
          </TabsContent>

          <TabsContent value="scope3" className="space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Scope 3 - Value Chain</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All other indirect emissions in your value chain (mandatory per GHG Protocol 2025)
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Business Travel (km/year)</Label>
                <Input
                  type="number"
                  className="mt-1"
                  value={scope3Data.businessTravel || ''}
                  onChange={(e) => setScope3Data(prev => ({...prev, businessTravel: parseFloat(e.target.value) || 0}))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Employee Commuting (km/year)</Label>
                <Input
                  type="number"
                  className="mt-1"
                  value={scope3Data.employeeCommuting || ''}
                  onChange={(e) => setScope3Data(prev => ({...prev, employeeCommuting: parseFloat(e.target.value) || 0}))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Waste Generated (kg/year)</Label>
                <Input
                  type="number"
                  className="mt-1"
                  value={scope3Data.wasteGenerated || ''}
                  onChange={(e) => setScope3Data(prev => ({...prev, wasteGenerated: parseFloat(e.target.value) || 0}))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Purchased Goods (USD/year)</Label>
                <Input
                  type="number"
                  className="mt-1"
                  value={scope3Data.purchasedGoods || ''}
                  onChange={(e) => setScope3Data(prev => ({...prev, purchasedGoods: parseFloat(e.target.value) || 0}))}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleDetailedCalculation} 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Calculating...
                </div>
              ) : (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Carbon Footprint
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {result && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Calculation Results
                </h3>
                
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{result.total.toFixed(1)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total tCO2e</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-xl font-bold text-red-600">{result.scope1.toFixed(1)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Scope 1</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-xl font-bold text-orange-600">{result.scope2.toFixed(1)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Scope 2</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-xl font-bold text-green-600">{result.scope3.toFixed(1)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Scope 3</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    ✅ GHG Protocol 2025 Compliant
                  </Badge>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
