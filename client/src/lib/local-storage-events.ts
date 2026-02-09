/**
 * Local Storage Event Persistence
 * Simple client-side storage for event calculations (no authentication required)
 */

export interface SavedEventLocal {
  id: string;
  eventName: string;
  eventType: string;
  eventYear: number;
  eventDate: string | null;
  attendance: number;
  location: string | null;
  totalEmissions: number;
  emissionsPerAttendee: number;
  performance: string;
  formData: any;
  calculation: any;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'vada_saved_events';

/**
 * Get all saved events from localStorage
 */
export function getSavedEvents(): SavedEventLocal[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading saved events:', error);
    return [];
  }
}

/**
 * Save a new event to localStorage
 */
export function saveEvent(event: Omit<SavedEventLocal, 'id' | 'createdAt' | 'updatedAt'>): SavedEventLocal {
  try {
    const events = getSavedEvents();
    const newEvent: SavedEventLocal = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    events.push(newEvent);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    return newEvent;
  } catch (error) {
    console.error('Error saving event:', error);
    throw new Error('Failed to save event');
  }
}

/**
 * Get a specific event by ID
 */
export function getEventById(id: string): SavedEventLocal | null {
  const events = getSavedEvents();
  return events.find(e => e.id === id) || null;
}

/**
 * Update an existing event
 */
export function updateEvent(id: string, updates: Partial<SavedEventLocal>): SavedEventLocal | null {
  try {
    const events = getSavedEvents();
    const index = events.findIndex(e => e.id === id);
    
    if (index === -1) return null;
    
    events[index] = {
      ...events[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    return events[index];
  } catch (error) {
    console.error('Error updating event:', error);
    return null;
  }
}

/**
 * Delete an event by ID
 */
export function deleteEvent(id: string): boolean {
  try {
    const events = getSavedEvents();
    const filtered = events.filter(e => e.id !== id);
    
    if (filtered.length === events.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    return false;
  }
}

/**
 * Get events grouped by name for year-over-year comparison
 */
export function getEventsByName(eventName: string): SavedEventLocal[] {
  const events = getSavedEvents();
  return events
    .filter(e => e.eventName.toLowerCase() === eventName.toLowerCase())
    .sort((a, b) => b.eventYear - a.eventYear);
}

/**
 * Clear all saved events (useful for testing)
 */
export function clearAllEvents(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Export events as JSON for backup
 */
export function exportEventsAsJSON(): string {
  const events = getSavedEvents();
  return JSON.stringify(events, null, 2);
}

/**
 * Import events from JSON backup
 */
export function importEventsFromJSON(jsonString: string): boolean {
  try {
    const events = JSON.parse(jsonString);
    if (!Array.isArray(events)) {
      throw new Error('Invalid format: expected array');
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    return true;
  } catch (error) {
    console.error('Error importing events:', error);
    return false;
  }
}