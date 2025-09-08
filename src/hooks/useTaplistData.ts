import { useState, useEffect } from 'react';
import { Beverage, Tap, TaplistSettings } from '@/types/taplist';

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

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      // Clear potentially corrupted data first
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
  }, []);

  // Save to localStorage whenever data changes
  // Save to localStorage with debouncing to prevent quota exceeded
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEYS.BEVERAGES, JSON.stringify(beverages));
      } catch (error) {
        console.error('Failed to save beverages to localStorage:', error);
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [beverages]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEYS.TAPS, JSON.stringify(taps));
      } catch (error) {
        console.error('Failed to save taps to localStorage:', error);
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [taps]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save settings to localStorage:', error);
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [settings]);

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
    setBeverages(currentBeverages => {
      const beverage = beverageId ? currentBeverages.find(b => b.id === beverageId) : undefined;
      
      setTaps(prev =>
        prev.map(tap =>
          tap.id === tapId
            ? { ...tap, beverage, isActive: !!beverage }
            : tap
        )
      );
      
      return currentBeverages; // Return the same beverages array unchanged
    });
  };

  const updateSettings = (newSettings: Partial<TaplistSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return {
    beverages,
    taps,
    settings,
    addBeverage,
    updateBeverage,
    deleteBeverage,
    assignToTap,
    updateSettings,
  };
}