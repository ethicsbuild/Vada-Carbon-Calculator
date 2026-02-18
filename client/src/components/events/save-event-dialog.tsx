import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Loader2 } from 'lucide-react';
import { saveEvent } from '@/lib/local-storage-events';

interface SaveEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calculation: {
    total: number;
    venue: number;
    transportation: number;
    energy: number;
    catering: number;
    waste: number;
    production: number;
    emissionsPerAttendee: number;
    benchmarkComparison: {
      industryAverage: number;
      percentile: number;
      performance: string;
    };
  };
  eventData: {
    attendance?: number;
    eventType?: string;
    location?: string;
    duration?: number;
    [key: string]: any; // Allow additional form data
  };
  onSaveSuccess?: () => void;
}

export function SaveEventDialog({ open, onOpenChange, calculation, eventData, onSaveSuccess }: SaveEventDialogProps) {
  const [eventName, setEventName] = useState('');
  const [eventYear, setEventYear] = useState(new Date().getFullYear());
  const [eventDate, setEventDate] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!eventName.trim()) {
      setError('Event name is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // Prepare event data for localStorage
      const savedEventData = {
        eventName: eventName.trim(),
        eventType: eventData.eventType || 'unknown',
        eventYear,
        eventDate: eventDate || null,
        attendance: eventData.attendance || 0,
        location: eventData.location || null,

        // Store full form data
        formData: eventData,

        // Store full calculation object for future reference
        calculation: calculation,

        // Emissions data
        totalEmissions: calculation.total,
        emissionsPerAttendee: calculation.emissionsPerAttendee,
        performance: calculation.benchmarkComparison.performance,

        // Notes
        notes: notes.trim() || null,
      };

      // Save to localStorage
      const savedEvent = saveEvent(savedEventData);
      console.log('✅ Event saved to localStorage:', savedEvent);

      // Success!
      onOpenChange(false);
      if (onSaveSuccess) {
        onSaveSuccess();
      }

      // Reset form
      setEventName('');
      setEventYear(new Date().getFullYear());
      setEventDate('');
      setNotes('');
    } catch (err) {
      console.error('Save error:', err);
      setError(err instanceof Error ? err.message : 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-forest-50 dark:bg-forest-800 border-forest-200 dark:border-forest-700 text-forest-900 dark:text-forest-50 max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Save className="w-6 h-6 text-emerald-400" />
            Save Your Event
          </DialogTitle>
          <DialogDescription className="text-sage-600 dark:text-sage-400">
            Save this calculation to track your progress over time and compare year-over-year.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Event Name */}
          <div className="space-y-2">
            <Label htmlFor="eventName" className="text-sage-700 dark:text-sage-300">
              Event Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g., Lightning in a Bottle, Symbiosis Gathering"
              className="bg-sage-50 dark:bg-forest-900 border-sage-300 dark:border-sage-600 text-forest-900 dark:text-forest-50"
            />
          </div>

          {/* Event Year and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventYear" className="text-sage-700 dark:text-sage-300">
                Event Year <span className="text-red-400">*</span>
              </Label>
              <Input
                id="eventYear"
                type="number"
                value={eventYear}
                onChange={(e) => setEventYear(parseInt(e.target.value))}
                min={2000}
                max={2100}
                className="bg-sage-50 dark:bg-forest-900 border-sage-300 dark:border-sage-600 text-forest-900 dark:text-forest-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventDate" className="text-sage-700 dark:text-sage-300">
                Event Date (Optional)
              </Label>
              <Input
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="bg-sage-50 dark:bg-forest-900 border-sage-300 dark:border-sage-600 text-forest-900 dark:text-forest-50"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sage-700 dark:text-sage-300">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this calculation, improvements you plan to make, etc."
              className="bg-sage-50 dark:bg-forest-900 border-sage-300 dark:border-sage-600 text-forest-900 dark:text-forest-50 min-h-[100px]"
            />
          </div>

          {/* Summary */}
          <div className="bg-sage-50 dark:bg-forest-900/50 rounded-lg p-4 space-y-2">
            <div className="text-sm text-sage-600 dark:text-sage-400">Summary:</div>
            <div className="text-forest-900 dark:text-forest-50">
              <span className="font-semibold">{calculation.total.toFixed(2)} tCO₂e</span>
              {' '}({calculation.emissionsPerAttendee.toFixed(4)} per attendee)
            </div>
            <div className="text-sm text-emerald-400">
              {calculation.benchmarkComparison.performance === 'excellent' && '🏆 Excellent performance'}
              {calculation.benchmarkComparison.performance === 'good' && '🌟 Good performance'}
              {calculation.benchmarkComparison.performance === 'average' && '📊 Average performance'}
              {calculation.benchmarkComparison.performance === 'needs improvement' && '💪 Room for improvement'}
              {calculation.benchmarkComparison.performance === 'poor' && '⚠️ Needs significant improvement'}
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded p-3">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className="text-sage-600 dark:text-sage-400 hover:text-forest-900 dark:hover:text-forest-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !eventName.trim()}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-forest-900 dark:text-forest-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Event
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
