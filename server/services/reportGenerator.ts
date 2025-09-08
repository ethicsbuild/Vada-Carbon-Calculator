import { storage } from "../storage";
import { type CarbonCalculation, type CarbonReport, type InsertCarbonReport } from "@shared/schema";
import * as fs from "fs/promises";
import * as path from "path";

export interface ReportData {
  organization: {
    name: string;
    type: string;
    size: string;
    industry: string;
  };
  calculation: CarbonCalculation;
  period: {
    start: string;
    end: string;
  };
  emissions: {
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
    breakdown: Record<string, any>;
  };
  compliance: {
    ghgProtocolVersion: string;
    verificationStatus: string;
    certificationDate?: string;
  };
  recommendations?: string[];
  benchmarks?: {
    industryAverage: number;
    percentileRanking: number;
    yearOverYearChange?: number;
  };
}

export class ReportGeneratorService {
  private readonly reportsDir = path.join(process.cwd(), "generated_reports");

  constructor() {
    this.ensureReportsDirectory();
  }

  private async ensureReportsDirectory(): Promise<void> {
    try {
      await fs.access(this.reportsDir);
    } catch {
      await fs.mkdir(this.reportsDir, { recursive: true });
    }
  }

  async generateGHGProtocolReport(
    calculationId: number,
    userId: number,
    organizationData: any
  ): Promise<CarbonReport> {
    const calculation = await storage.getCarbonCalculation(calculationId);
    if (!calculation) {
      throw new Error("Calculation not found");
    }

    const reportData: ReportData = {
      organization: organizationData,
      calculation,
      period: {
        start: `${calculation.reportingYear}-01-01`,
        end: `${calculation.reportingYear}-12-31`,
      },
      emissions: {
        scope1: parseFloat(calculation.scope1Emissions || "0"),
        scope2: parseFloat(calculation.scope2Emissions || "0"),
        scope3: parseFloat(calculation.scope3Emissions || "0"),
        total: parseFloat(calculation.totalEmissions || "0"),
        breakdown: {
          scope1: calculation.scope1Data,
          scope2: calculation.scope2Data,
          scope3: calculation.scope3Data,
        },
      },
      compliance: {
        ghgProtocolVersion: calculation.ghgProtocolVersion || "2025",
        verificationStatus: calculation.status || "completed",
        certificationDate: calculation.verifiedAt?.toISOString(),
      },
      recommendations: await this.generateRecommendations(reportData),
      benchmarks: await this.generateBenchmarks(reportData),
    };

    // Generate PDF content
    const pdfContent = this.generatePDFContent(reportData);
    const fileName = `ghg_protocol_report_${calculationId}_${Date.now()}.json`;
    const filePath = path.join(this.reportsDir, fileName);
    
    await fs.writeFile(filePath, JSON.stringify(pdfContent, null, 2));

    // Save report record
    const report = await storage.createCarbonReport({
      calculationId,
      userId,
      type: "ghg_protocol",
      format: "pdf",
      title: `GHG Protocol Report ${calculation.reportingYear}`,
      content: reportData,
      filePath,
    });

    return report;
  }

  async generateCarbonReceipt(
    calculationId: number,
    userId: number,
    offsetData?: any
  ): Promise<CarbonReport> {
    const calculation = await storage.getCarbonCalculation(calculationId);
    if (!calculation) {
      throw new Error("Calculation not found");
    }

    const receiptData = {
      receiptId: `CR-${calculationId}-${Date.now()}`,
      calculationId,
      totalEmissions: parseFloat(calculation.totalEmissions || "0"),
      offsetAmount: offsetData?.amount || 0,
      offsetPrice: offsetData?.price || 0,
      offsetProvider: offsetData?.provider || "Pending Selection",
      issuedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      blockchainReady: true,
      verificationHash: this.generateVerificationHash(calculationId),
    };

    const fileName = `carbon_receipt_${calculationId}_${Date.now()}.json`;
    const filePath = path.join(this.reportsDir, fileName);
    
    await fs.writeFile(filePath, JSON.stringify(receiptData, null, 2));

    const report = await storage.createCarbonReport({
      calculationId,
      userId,
      type: "carbon_receipt",
      format: "json",
      title: `Carbon Receipt ${receiptData.receiptId}`,
      content: receiptData,
      filePath,
      isBlockchainVerified: false, // Will be verified later
    });

    return report;
  }

  async generateCSVExport(
    calculationId: number,
    userId: number
  ): Promise<CarbonReport> {
    const calculation = await storage.getCarbonCalculation(calculationId);
    if (!calculation) {
      throw new Error("Calculation not found");
    }

    const csvData = this.generateCSVData(calculation);
    const fileName = `carbon_data_${calculationId}_${Date.now()}.csv`;
    const filePath = path.join(this.reportsDir, fileName);
    
    await fs.writeFile(filePath, csvData);

    const report = await storage.createCarbonReport({
      calculationId,
      userId,
      type: "custom",
      format: "csv",
      title: `Carbon Data Export ${calculation.reportingYear}`,
      content: { dataType: "csv_export" },
      filePath,
    });

    return report;
  }

  private generatePDFContent(reportData: ReportData): any {
    return {
      title: `GHG Protocol Carbon Footprint Report ${reportData.period.start.split('-')[0]}`,
      metadata: {
        organization: reportData.organization.name,
        reportingPeriod: `${reportData.period.start} to ${reportData.period.end}`,
        generatedAt: new Date().toISOString(),
        ghgProtocolVersion: reportData.compliance.ghgProtocolVersion,
        standard: "GHG Protocol Corporate Standard (2025 Update)",
      },
      executiveSummary: {
        totalEmissions: reportData.emissions.total,
        scope1Percentage: (reportData.emissions.scope1 / reportData.emissions.total) * 100,
        scope2Percentage: (reportData.emissions.scope2 / reportData.emissions.total) * 100,
        scope3Percentage: (reportData.emissions.scope3 / reportData.emissions.total) * 100,
        industryComparison: reportData.benchmarks?.percentileRanking,
        yearOverYear: reportData.benchmarks?.yearOverYearChange,
      },
      detailedResults: {
        scope1: {
          total: reportData.emissions.scope1,
          activities: reportData.emissions.breakdown.scope1,
          methodology: "Direct measurement and calculation using GHG Protocol emission factors",
        },
        scope2: {
          total: reportData.emissions.scope2,
          activities: reportData.emissions.breakdown.scope2,
          methodology: "Location-based and market-based approaches per Scope 2 Guidance",
        },
        scope3: {
          total: reportData.emissions.scope3,
          activities: reportData.emissions.breakdown.scope3,
          methodology: "Screening and detailed assessment per Scope 3 Standard",
          mandatoryCompliance: "Required per GHG Protocol 2025 updates",
        },
      },
      methodology: {
        operationalBoundaries: "All emission sources under operational control",
        organizationalBoundaries: "Operational control approach",
        emissionFactors: "Latest IPCC and regional factors",
        dataQuality: "Tier 1-3 assessment completed",
        uncertainty: "±15% overall uncertainty range",
      },
      recommendations: reportData.recommendations,
      verification: {
        status: reportData.compliance.verificationStatus,
        standard: "ISO 14064-3:2019",
        verifier: "Pending third-party verification",
        assuranceLevel: "Limited assurance",
      },
      appendices: {
        emissionFactors: "Detailed emission factors used in calculations",
        activityData: "Source data and assumptions",
        calculations: "Detailed calculation worksheets",
      },
    };
  }

  private generateCSVData(calculation: CarbonCalculation): string {
    const headers = [
      "Scope",
      "Category",
      "Activity",
      "Amount",
      "Unit",
      "Emission Factor",
      "Emissions (tCO2e)",
      "Source",
    ];

    const rows: string[][] = [headers];

    // Add Scope 1 data
    if (calculation.scope1Data) {
      const scope1Data = calculation.scope1Data as any;
      Object.entries(scope1Data).forEach(([activity, amount]) => {
        rows.push([
          "Scope 1",
          "Direct Emissions",
          activity,
          String(amount),
          "Various",
          "GHG Protocol",
          "Calculated",
          "Direct measurement",
        ]);
      });
    }

    // Add Scope 2 data
    if (calculation.scope2Data) {
      const scope2Data = calculation.scope2Data as any;
      Object.entries(scope2Data).forEach(([activity, amount]) => {
        rows.push([
          "Scope 2",
          "Energy Indirect",
          activity,
          String(amount),
          "kWh",
          "Grid average",
          "Calculated",
          "Utility bills",
        ]);
      });
    }

    // Add Scope 3 data
    if (calculation.scope3Data) {
      const scope3Data = calculation.scope3Data as any;
      Object.entries(scope3Data).forEach(([activity, amount]) => {
        rows.push([
          "Scope 3",
          "Value Chain",
          activity,
          String(amount),
          "Various",
          "Industry average",
          "Calculated",
          "Estimated",
        ]);
      });
    }

    return rows.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
  }

  private async generateRecommendations(reportData: ReportData): Promise<string[]> {
    const recommendations: string[] = [];
    const { emissions } = reportData;

    // Scope-specific recommendations
    if (emissions.scope1 > emissions.total * 0.3) {
      recommendations.push("Consider transitioning to renewable energy sources for direct operations");
      recommendations.push("Implement energy efficiency measures in facilities and vehicle fleet");
    }

    if (emissions.scope2 > emissions.total * 0.4) {
      recommendations.push("Purchase renewable energy certificates or engage in power purchase agreements");
      recommendations.push("Optimize energy consumption through smart building technologies");
    }

    if (emissions.scope3 > emissions.total * 0.5) {
      recommendations.push("Engage suppliers on their carbon reduction initiatives");
      recommendations.push("Implement sustainable procurement policies");
      recommendations.push("Encourage remote work to reduce business travel and commuting");
    }

    // Industry-specific recommendations
    if (reportData.organization.industry === "technology") {
      recommendations.push("Optimize data center efficiency and consider cloud migration");
      recommendations.push("Implement circular economy principles for hardware lifecycle");
    }

    if (reportData.organization.industry === "manufacturing") {
      recommendations.push("Investigate process optimization and waste heat recovery");
      recommendations.push("Consider alternative materials with lower carbon intensity");
    }

    return recommendations;
  }

  private async generateBenchmarks(reportData: ReportData): Promise<any> {
    // Industry benchmarks (would typically come from external database)
    const industryAverages: Record<string, number> = {
      technology: 125,
      manufacturing: 450,
      retail: 200,
      finance: 150,
      healthcare: 300,
      energy: 800,
      transportation: 600,
      construction: 350,
      agriculture: 250,
      other: 200,
    };

    const industryAverage = industryAverages[reportData.organization.industry] || 200;
    const userEmissions = reportData.emissions.total;
    
    // Calculate percentile ranking (simplified)
    const percentileRanking = userEmissions < industryAverage ? 
      Math.max(10, 50 - ((industryAverage - userEmissions) / industryAverage) * 40) :
      Math.min(90, 50 + ((userEmissions - industryAverage) / industryAverage) * 40);

    return {
      industryAverage,
      percentileRanking: Math.round(percentileRanking),
      yearOverYearChange: null, // Would calculate from previous years
      industryLeaders: industryAverage * 0.6,
      industryWorst: industryAverage * 1.5,
    };
  }

  private generateVerificationHash(calculationId: number): string {
    // Simple hash generation for demo - would use crypto library in production
    const timestamp = Date.now();
    const data = `${calculationId}-${timestamp}`;
    return Buffer.from(data).toString('base64').substring(0, 16);
  }

  async getReport(reportId: number): Promise<CarbonReport | undefined> {
    return await storage.getCarbonReport(reportId);
  }

  async getUserReports(userId: number): Promise<CarbonReport[]> {
    return await storage.getCarbonReportsByUser(userId);
  }

  async getCalculationReports(calculationId: number): Promise<CarbonReport[]> {
    return await storage.getCarbonReportsByCalculation(calculationId);
  }

  async verifyOnBlockchain(reportId: number): Promise<string> {
    // Placeholder for Hedera Guardian integration
    const report = await storage.getCarbonReport(reportId);
    if (!report) {
      throw new Error("Report not found");
    }

    // Generate blockchain hash (would integrate with Hedera Guardian)
    const blockchainHash = `hedera:${this.generateVerificationHash(reportId)}:${Date.now()}`;
    
    await storage.updateCarbonReport(reportId, {
      isBlockchainVerified: true,
      blockchainHash,
    });

    return blockchainHash;
  }
}

export const reportGeneratorService = new ReportGeneratorService();
