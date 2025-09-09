import { useState, useEffect } from 'react';
import { Beverage, Tap, TaplistSettings } from '@/types/taplist';

// Configure your IIS server URL here
const API_BASE_URL = 'http://localhost:8080'; // Change this to your IIS server URL

interface TaplistData {
  beverages: Beverage[];
  taps: Tap[];
  settings: TaplistSettings;
}

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

  // Load data from API on mount
  useEffect(() => {
    loadFromAPI();
  }, []);

  const loadFromAPI = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/taplist`);
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
      }
    } catch (error) {
      console.error('Failed to load from API:', error);
      // Fallback to localStorage if API fails
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const savedBeverages = localStorage.getItem('taplist_beverages');
      const savedTaps = localStorage.getItem('taplist_taps');
      const savedSettings = localStorage.getItem('taplist_settings');

      if (savedBeverages) setBeverages(JSON.parse(savedBeverages));
      if (savedTaps) setTaps(JSON.parse(savedTaps));
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  };

  const saveToAPI = async (data: TaplistData) => {
    try {
      await fetch(`${API_BASE_URL}/api/taplist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Failed to save to API:', error);
      // Fallback to localStorage if API fails
      try {
        localStorage.setItem('taplist_beverages', JSON.stringify(data.beverages));
        localStorage.setItem('taplist_taps', JSON.stringify(data.taps));
        localStorage.setItem('taplist_settings', JSON.stringify(data.settings));
      } catch (localError) {
        console.error('Failed to save to localStorage:', localError);
      }
    }
  };

  // Save to API whenever data changes (with debouncing)
  useEffect(() => {
    if (isLoading) return;
    const timeoutId = setTimeout(() => {
      saveToAPI({ beverages, taps, settings });
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