import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { 
  CalculationResult, 
  CarbonCalculation, 
  OrganizationProfile,
  Scope1Data,
  Scope2Data,
  Scope3Data,
  CalculationStep,
  ProgressState
} from '@/types/carbon';

export function useCarbonCalculation() {
  const queryClient = useQueryClient();
  const [currentCalculation, setCurrentCalculation] = useState<CarbonCalculation | null>(null);
  const [progress, setProgress] = useState<ProgressState>({
    currentStep: 'organization_setup',
    completedSteps: [],
    progress: 0,
    organizationSetup: false,
    scope1Complete: false,
    scope2Complete: false,
    scope3Complete: false,
    calculationComplete: false,
  });

  // Estimate emissions based on basic organization data
  const estimateMutation = useMutation({
    mutationFn: async (data: {
      organizationType: string;
      organizationSize: string;
      industry: string;
      annualRevenue?: number;
    }) => {
      const response = await apiRequest('POST', '/api/calculate/estimate', data);
      return response.json();
    },
    onSuccess: (result: CalculationResult) => {
      updateProgress('scope1_calculation', { scope1Complete: true });
    },
  });

  // Detailed emissions calculation
  const calculateMutation = useMutation({
    mutationFn: async (data: {
      scope1Data?: Scope1Data;
      scope2Data?: Scope2Data;
      scope3Data?: Scope3Data;
      organizationSize: string;
      industry: string;
    }) => {
      const response = await apiRequest('POST', '/api/calculate/detailed', data);
      return response.json();
    },
    onSuccess: (result: CalculationResult) => {
      updateProgress('report_generation', { calculationComplete: true });
    },
  });

  // Save calculation to database
  const saveMutation = useMutation({
    mutationFn: async (data: {
      userId: number;
      organizationId: number;
      calculationData: any;
      result: CalculationResult;
    }) => {
      const response = await apiRequest('POST', '/api/calculate/save', data);
      return response.json();
    },
    onSuccess: (savedCalculation: CarbonCalculation) => {
      setCurrentCalculation(savedCalculation);
      queryClient.invalidateQueries({ queryKey: ['/api/calculations'] });
    },
  });

  // Get user's calculations
  const { data: userCalculations, isLoading: calculationsLoading } = useQuery({
    queryKey: ['/api/calculations/user', 1], // Replace with actual userId
    enabled: true,
  });

  // Get organization calculations
  const { data: orgCalculations } = useQuery({
    queryKey: ['/api/calculations/organization', currentCalculation?.organizationId],
    enabled: !!currentCalculation?.organizationId,
  });

  // Helper functions
  const updateProgress = useCallback((
    step: CalculationStep, 
    updates: Partial<ProgressState>
  ) => {
    setProgress(prev => {
      const newCompletedSteps = [...prev.completedSteps];
      if (!newCompletedSteps.includes(prev.currentStep)) {
        newCompletedSteps.push(prev.currentStep);
      }

      const stepOrder: CalculationStep[] = [
        'organization_setup',
        'scope1_calculation',
        'scope2_calculation',
        'scope3_calculation',
        'report_generation',
        'completed'
      ];

      const newProgress = (newCompletedSteps.length / (stepOrder.length - 1)) * 100;

      return {
        ...prev,
        ...updates,
        currentStep: step,
        completedSteps: newCompletedSteps,
        progress: Math.min(newProgress, 100),
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({
      currentStep: 'organization_setup',
      completedSteps: [],
      progress: 0,
      organizationSetup: false,
      scope1Complete: false,
      scope2Complete: false,
      scope3Complete: false,
      calculationComplete: false,
    });
    setCurrentCalculation(null);
  }, []);

  const startNewCalculation = useCallback((organizationData: OrganizationProfile) => {
    resetProgress();
    updateProgress('scope1_calculation', { organizationSetup: true });
  }, [resetProgress, updateProgress]);

  const getStepTitle = (step: CalculationStep): string => {
    const titles: Record<CalculationStep, string> = {
      organization_setup: 'Organization Setup',
      scope1_calculation: 'Scope 1 - Direct Emissions',
      scope2_calculation: 'Scope 2 - Energy Indirect',
      scope3_calculation: 'Scope 3 - Value Chain',
      report_generation: 'Generate Reports',
      completed: 'Completed',
    };
    return titles[step];
  };

  const getStepDescription = (step: CalculationStep): string => {
    const descriptions: Record<CalculationStep, string> = {
      organization_setup: 'Basic organization information and preferences',
      scope1_calculation: 'Direct emissions from owned or controlled sources',
      scope2_calculation: 'Indirect emissions from purchased energy',
      scope3_calculation: 'All other indirect emissions in value chain',
      report_generation: 'Create compliance reports and carbon receipts',
      completed: 'Calculation completed successfully',
    };
    return descriptions[step];
  };

  const isStepComplete = (step: CalculationStep): boolean => {
    return progress.completedSteps.includes(step);
  };

  const canAccessStep = (step: CalculationStep): boolean => {
    const stepOrder: CalculationStep[] = [
      'organization_setup',
      'scope1_calculation',
      'scope2_calculation',
      'scope3_calculation',
      'report_generation',
      'completed'
    ];

    const currentIndex = stepOrder.indexOf(progress.currentStep);
    const targetIndex = stepOrder.indexOf(step);
    
    return targetIndex <= currentIndex || isStepComplete(step);
  };

  return {
    // State
    currentCalculation,
    progress,
    
    // Queries
    userCalculations,
    orgCalculations,
    calculationsLoading,
    
    // Mutations
    estimateEmissions: estimateMutation.mutateAsync,
    calculateEmissions: calculateMutation.mutateAsync,
    saveCalculation: saveMutation.mutateAsync,
    
    // Loading states
    isEstimating: estimateMutation.isPending,
    isCalculating: calculateMutation.isPending,
    isSaving: saveMutation.isPending,
    
    // Results
    estimationResult: estimateMutation.data,
    calculationResult: calculateMutation.data,
    
    // Errors
    estimationError: estimateMutation.error,
    calculationError: calculateMutation.error,
    saveError: saveMutation.error,
    
    // Progress management
    updateProgress,
    resetProgress,
    startNewCalculation,
    
    // Step utilities
    getStepTitle,
    getStepDescription,
    isStepComplete,
    canAccessStep,
    
    // Reset functions
    resetEstimation: estimateMutation.reset,
    resetCalculation: calculateMutation.reset,
    resetSave: saveMutation.reset,
  };
}
