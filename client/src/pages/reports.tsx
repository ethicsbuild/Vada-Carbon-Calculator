import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  Shield, 
  Calendar,
  TrendingUp,
  CheckCircle,
  ExternalLink,
  Coins,
  Link as LinkIcon,
  Globe
} from 'lucide-react';

export default function Reports() {
  const [selectedReportType, setSelectedReportType] = useState('ghg_protocol');
  const [exportFormats, setExportFormats] = useState({
    pdf: true,
    csv: true,
    blockchain: false
  });

  // Mock data for demonstration - in real app this would come from API
  const sampleReport = {
    totalEmissions: 156.2,
    scope1: 45.3,
    scope2: 67.8,
    scope3: 43.1,
    verificationStatus: 'completed',
    reportingPeriod: '2024',
    generatedAt: new Date().toISOString()
  };

  const { data: userReports } = useQuery({
    queryKey: ['/api/reports/user', 1], // Replace with actual userId
    enabled: false // Disable for demo
  });

  const handleGenerateReport = async () => {
    // Implementation would call API to generate report
    console.log('Generating report:', { selectedReportType, exportFormats });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-sage-50 dark:bg-forest-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-forest-900 dark:text-forest-50 mb-4">
            Carbon Reports & Receipts
          </h1>
          <p className="text-xl text-gray-600 dark:text-sage-700 dark:text-sage-300 max-w-2xl mx-auto">
            Generate verifiable carbon reports and blockchain-backed receipts compliant with GHG Protocol 2025 standards
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Report Generation */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-green-600" />
                  Generate Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Report Type Selection */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Report Type</Label>
                  <div className="grid grid-cols-1 gap-4">
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedReportType === 'ghg_protocol' 
                          ? 'border-green-600 bg-green-50 dark:bg-green-900/20' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-green-600'
                      }`}
                      onClick={() => setSelectedReportType('ghg_protocol')}
                    >
                      <div className="flex items-start">
                        <input 
                          type="radio" 
                          name="report-type" 
                          value="ghg_protocol" 
                          checked={selectedReportType === 'ghg_protocol'}
                          onChange={() => setSelectedReportType('ghg_protocol')}
                          className="mr-3 mt-1" 
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-forest-900 dark:text-forest-50">GHG Protocol Report</div>
                          <div className="text-sm text-gray-600 dark:text-sage-600 dark:text-sage-400">
                            Comprehensive compliance report with Scope 1, 2, 3 breakdown
                          </div>
                          <Badge variant="secondary" className="mt-2">2025 Compliant</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedReportType === 'carbon_receipt' 
                          ? 'border-green-600 bg-green-50 dark:bg-green-900/20' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-green-600'
                      }`}
                      onClick={() => setSelectedReportType('carbon_receipt')}
                    >
                      <div className="flex items-start">
                        <input 
                          type="radio" 
                          name="report-type" 
                          value="carbon_receipt" 
                          checked={selectedReportType === 'carbon_receipt'}
                          onChange={() => setSelectedReportType('carbon_receipt')}
                          className="mr-3 mt-1" 
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-forest-900 dark:text-forest-50">Carbon Receipt</div>
                          <div className="text-sm text-gray-600 dark:text-sage-600 dark:text-sage-400">
                            Blockchain-verified receipt with offset tracking
                          </div>
                          <Badge variant="secondary" className="mt-2 bg-purple-100 text-purple-700">Blockchain</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reporting Period */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">From Date</Label>
                    <Input type="date" defaultValue="2024-01-01" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">To Date</Label>
                    <Input type="date" defaultValue="2024-12-31" />
                  </div>
                </div>

                {/* Export Options */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Export Format</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="pdf" 
                        checked={exportFormats.pdf}
                        onCheckedChange={(checked) => 
                          setExportFormats(prev => ({ ...prev, pdf: !!checked }))
                        }
                      />
                      <Label htmlFor="pdf" className="text-sm">PDF Report</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="csv" 
                        checked={exportFormats.csv}
                        onCheckedChange={(checked) => 
                          setExportFormats(prev => ({ ...prev, csv: !!checked }))
                        }
                      />
                      <Label htmlFor="csv" className="text-sm">CSV Data</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="blockchain" 
                        checked={exportFormats.blockchain}
                        onCheckedChange={(checked) => 
                          setExportFormats(prev => ({ ...prev, blockchain: !!checked }))
                        }
                      />
                      <Label htmlFor="blockchain" className="text-sm">Blockchain Receipt</Label>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleGenerateReport}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Report Preview & Features */}
          <div className="space-y-6">
            {/* Report Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Report Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Sample Report Header */}
                <div className="relative mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=200" 
                    alt="Eco-friendly lifestyle and carbon reduction choices" 
                    className="w-full h-32 object-cover rounded-lg" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-transparent rounded-lg"></div>
                  <div className="absolute inset-0 flex items-center px-6">
                    <div className="text-forest-900 dark:text-forest-50">
                      <h4 className="text-lg font-semibold">Carbon Footprint Report 2024</h4>
                      <p className="text-sm opacity-90">GHG Protocol Compliant</p>
                    </div>
                  </div>
                </div>

                {/* Report Summary */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-gray-600 dark:text-sage-600 dark:text-sage-400">Total Emissions</span>
                    <span className="font-semibold text-gray-900 dark:text-forest-900 dark:text-forest-50">
                      {sampleReport.totalEmissions} tCO2e
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-gray-600 dark:text-sage-600 dark:text-sage-400">Scope 1</span>
                    <span className="font-semibold text-gray-900 dark:text-forest-900 dark:text-forest-50">
                      {sampleReport.scope1} tCO2e
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-gray-600 dark:text-sage-600 dark:text-sage-400">Scope 2</span>
                    <span className="font-semibold text-gray-900 dark:text-forest-900 dark:text-forest-50">
                      {sampleReport.scope2} tCO2e
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-gray-600 dark:text-sage-600 dark:text-sage-400">Scope 3</span>
                    <span className="font-semibold text-gray-900 dark:text-forest-900 dark:text-forest-50">
                      {sampleReport.scope3} tCO2e
                    </span>
                  </div>
                </div>

                {/* Verification Badge */}
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-forest-900 dark:text-forest-50" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-forest-900 dark:text-forest-50">Verified on Hedera</div>
                      <div className="text-sm text-gray-600 dark:text-sage-600 dark:text-sage-400">
                        Blockchain Transaction: 0x1234...5678
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Coins className="w-5 h-5 mr-2 text-purple-600" />
                  Blockchain Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <Coins className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-forest-900 dark:text-forest-50">NFT Generation</div>
                      <div className="text-sm text-gray-600 dark:text-sage-600 dark:text-sage-400">
                        Mint carbon receipts as verifiable NFTs
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-forest-900 dark:text-forest-50">Traceable Offsets</div>
                      <div className="text-sm text-gray-600 dark:text-sage-600 dark:text-sage-400">
                        End-to-end verification and tracking
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-forest-900 dark:text-forest-50">DAO Ready</div>
                      <div className="text-sm text-gray-600 dark:text-sage-600 dark:text-sage-400">
                        Governance token integration
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                      <LinkIcon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-forest-900 dark:text-forest-50">Verra Integration</div>
                      <div className="text-sm text-gray-600 dark:text-sage-600 dark:text-sage-400">
                        Connected to major carbon standards
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Learn About Hedera Guardian
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Previous Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                  Recent Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "GHG Protocol Report Q4 2024", date: "2024-01-15", verified: true },
                    { name: "Carbon Receipt #CR-001", date: "2024-01-10", verified: true },
                    { name: "Data Export 2024", date: "2024-01-05", verified: false }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-forest-50 dark:bg-forest-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-gray-600 dark:text-sage-600 dark:text-sage-400" />
                        <div>
                          <div className="font-medium text-sm text-gray-900 dark:text-forest-900 dark:text-forest-50">
                            {report.name}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-sage-600 dark:text-sage-400">
                            {report.date}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {report.verified && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                        <Button size="sm" variant="ghost">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
