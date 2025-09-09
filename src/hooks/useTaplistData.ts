import { useState, useEffect } from 'react';
import { Beverage, Tap, TaplistSettings } from '@/types/taplist';

// Configure your IIS server URL here
const API_BASE_URL = 'http://localhost:8080'; // Change this to your IIS server URL

interface TaplistData {
  beverages: Beverage[];
  taps: Tap[];
  settings: TaplistSettings;
}

const STORAGE_KEYS = {
  BEVERAGES: 'taplist_beverages',
  TAPS: 'taplist_taps',
  SETTINGS: 'taplist_settings',
};

export function useTaplistData() {
  const [beverages, setBeverages] = useState<Beverage[]>([]);
  const [taps, setTaps] = useState<Tap[]>([
    { id: 1, isActive: false },
    { id: 2, isActive: false },
    { id: 3, isActive: false },
    { id: 4, isActive: false },
  ]);
  const [settings, setSettings] = useState<TaplistSettings>({
    title: 'Welcome To Two Rotten Brewing',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Try API first
      const response = await fetch(`${API_BASE_URL}/api/taplist`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000), // 3 second timeout
      });
      
      if (response.ok) {
        const data: TaplistData = await response.json();
        setBeverages(data.beverages || []);
        setTaps(data.taps || [
          { id: 1, isActive: false },
          { id: 2, isActive: false },
          { id: 3, isActive: false },
          { id: 4, isActive: false },
        ]);
        setSettings(data.settings || { title: 'Welcome To Two Rotten Brewing' });
      } else {
        throw new Error('API response not ok');
      }
    } catch (error) {
      console.log('API not available, using localStorage');
      // Fallback to localStorage
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const savedBeverages = localStorage.getItem(STORAGE_KEYS.BEVERAGES);
      const savedTaps = localStorage.getItem(STORAGE_KEYS.TAPS);
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);

      if (savedBeverages) {
        setBeverages(JSON.parse(savedBeverages));
      }
      if (savedTaps) {
        setTaps(JSON.parse(savedTaps));
      }
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEYS.BEVERAGES);
      localStorage.removeItem(STORAGE_KEYS.TAPS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    }
  };

  const saveData = async (data: TaplistData) => {
    // Try API first
    try {
      await fetch(`${API_BASE_URL}/api/taplist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(3000), // 3 second timeout
      });
    } catch (error) {
      console.log('API save failed, using localStorage');
    }
    
    // Always save to localStorage as backup
    try {
      localStorage.setItem(STORAGE_KEYS.BEVERAGES, JSON.stringify(data.beverages));
      localStorage.setItem(STORAGE_KEYS.TAPS, JSON.stringify(data.taps));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  // Save data whenever state changes (with debouncing)
  useEffect(() => {
    if (isLoading) return;
    const timeoutId = setTimeout(() => {
      saveData({ beverages, taps, settings });
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [beverages, taps, settings, isLoading]);

  const addBeverage = (beverage: Omit<Beverage, 'id'>) => {
    const newBeverage: Beverage = {
      ...beverage,
      id: Date.now().toString(),
    };
    setBeverages(prev => [...prev, newBeverage]);
  };

  const updateBeverage = (id: string, updates: Partial<Beverage>) => {
    setBeverages(prev =>
      prev.map(beverage =>
        beverage.id === id ? { ...beverage, ...updates } : beverage
      )
    );
  };

  const deleteBeverage = (id: string) => {
    setBeverages(prev => prev.filter(beverage => beverage.id !== id));
    // Remove from taps if assigned
    setTaps(prev =>
      prev.map(tap =>
        tap.beverage?.id === id
          ? { ...tap, beverage: undefined, isActive: false }
          : tap
      )
    );
  };

  const assignToTap = (tapId: number, beverageId?: string) => {
    const beverage = beverageId ? beverages.find(b => b.id === beverageId) : undefined;
    
    setTaps(prev =>
      prev.map(tap =>
        tap.id === tapId
          ? { ...tap, beverage, isActive: !!beverage }
          : tap
      )
    );
  };

  const updateSettings = (newSettings: Partial<TaplistSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return {
    beverages,
    taps,
    settings,
    isLoading,
    addBeverage,
    updateBeverage,
    deleteBeverage,
    assignToTap,
    updateSettings,
  };
}