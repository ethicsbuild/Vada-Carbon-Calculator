import { Router } from 'express';
import { carbonCalculatorService, type EventEmissionData } from '../services/carbonCalculator';

export const calculateRouter = Router();

calculateRouter.post('/calculate-event', async (req, res) => {
  try {
    const eventData: EventEmissionData = req.body;

    console.log('📊 Calculating emissions for event:', {
      type: eventData.eventType,
      attendance: eventData.attendance,
      duration: eventData.duration
    });

    const calculation = await carbonCalculatorService.calculateEventEmissions(eventData);

    console.log('✅ Calculation complete:', {
      total: calculation.total.toFixed(3),
      perAttendee: calculation.emissionsPerAttendee.toFixed(4),
      performance: calculation.benchmarkComparison.performance
    });

    res.json(calculation);
  } catch (error) {
    console.error('❌ Calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate emissions' });
  }
});
