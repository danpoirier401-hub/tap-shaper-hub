import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Beverage, Tap, TaplistSettings } from '@/types/taplist';

export function useTaplistData() {
  const [beverages, setBeverages] = useState<Beverage[]>([]);
  const [taps, setTaps] = useState<Tap[]>([]);
  const [settings, setSettings] = useState<TaplistSettings>({
    title: 'On Tap',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    
    // Subscribe to realtime changes for cross-device sync
    const beveragesChannel = supabase
      .channel('beverages-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'beverages' }, () => {
        loadBeverages();
      })
      .subscribe();

    const tapsChannel = supabase
      .channel('taps-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'taps' }, () => {
        loadTaps();
      })
      .subscribe();

    const settingsChannel = supabase
      .channel('settings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'taplist_settings' }, () => {
        loadSettings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(beveragesChannel);
      supabase.removeChannel(tapsChannel);
      supabase.removeChannel(settingsChannel);
    };
  }, []);

  const loadData = async () => {
    await Promise.all([loadBeverages(), loadTaps(), loadSettings()]);
    setIsLoading(false);
  };

  const loadBeverages = async () => {
    const { data, error } = await supabase
      .from('beverages')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error loading beverages:', error);
      return;
    }

    const formattedBeverages: Beverage[] = (data || []).map(b => ({
      id: b.id,
      name: b.name,
      type: b.type as 'beer' | 'wine' | 'coffee' | 'other',
      brewery: b.brewery || undefined,
      abv: b.abv ? Number(b.abv) : undefined,
      style: b.style || undefined,
      description: b.description || undefined,
      label: b.label || undefined,
    }));

    setBeverages(formattedBeverages);
  };

  const loadTaps = async () => {
    const { data: tapsData, error: tapsError } = await supabase
      .from('taps')
      .select('id, beverage_id, is_active')
      .order('id', { ascending: true });

    if (tapsError) {
      console.error('Error loading taps:', tapsError);
      return;
    }

    const { data: beveragesData, error: beveragesError } = await supabase
      .from('beverages')
      .select('*');

    if (beveragesError) {
      console.error('Error loading beverages for taps:', beveragesError);
      return;
    }

    const formattedTaps: Tap[] = (tapsData || []).map(t => {
      const beverage = beveragesData?.find(b => b.id === t.beverage_id);
      return {
        id: t.id,
        isActive: t.is_active,
        beverage: beverage ? {
          id: beverage.id,
          name: beverage.name,
          type: beverage.type as 'beer' | 'wine' | 'coffee' | 'other',
          brewery: beverage.brewery || undefined,
          abv: beverage.abv ? Number(beverage.abv) : undefined,
          style: beverage.style || undefined,
          description: beverage.description || undefined,
          label: beverage.label || undefined,
        } : undefined,
      };
    });

    setTaps(formattedTaps);
  };

  const loadSettings = async () => {
    const { data, error } = await supabase
      .from('taplist_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error loading settings:', error);
      return;
    }

    if (data) {
      setSettings({
        backgroundImage: data.background_image || undefined,
        title: data.title || 'On Tap',
        fontFamily: data.font_family || undefined,
        titleColor: data.title_color || undefined,
        beverageNameColor: data.beverage_name_color || undefined,
        breweryColor: data.brewery_color || undefined,
        styleColor: data.style_color || undefined,
        abvColor: data.abv_color || undefined,
        descriptionColor: data.description_color || undefined,
      });
    }
  };

  const addBeverage = async (beverage: Omit<Beverage, 'id'>) => {
    const { error } = await supabase
      .from('beverages')
      .insert({
        name: beverage.name,
        type: beverage.type,
        brewery: beverage.brewery,
        abv: beverage.abv,
        style: beverage.style,
        description: beverage.description,
        label: beverage.label,
      });

    if (error) {
      console.error('Error adding beverage:', error);
      return;
    }

    await loadBeverages();
  };

  const updateBeverage = async (id: string, updates: Partial<Beverage>) => {
    const { error } = await supabase
      .from('beverages')
      .update({
        name: updates.name,
        type: updates.type,
        brewery: updates.brewery,
        abv: updates.abv,
        style: updates.style,
        description: updates.description,
        label: updates.label,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating beverage:', error);
      return;
    }

    await loadBeverages();
  };

  const deleteBeverage = async (id: string) => {
    const { error } = await supabase
      .from('beverages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting beverage:', error);
      return;
    }

    await loadBeverages();
    await loadTaps();
  };

  const assignToTap = async (tapId: number, beverageId?: string) => {
    const { error } = await supabase
      .from('taps')
      .update({ 
        beverage_id: beverageId || null,
        is_active: !!beverageId
      })
      .eq('id', tapId);

    if (error) {
      console.error('Error assigning to tap:', error);
      return;
    }

    await loadTaps();
  };

  const updateSettings = async (newSettings: Partial<TaplistSettings>) => {
    const { data: existingSettings } = await supabase
      .from('taplist_settings')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (existingSettings) {
      const { error } = await supabase
        .from('taplist_settings')
        .update({
          background_image: newSettings.backgroundImage,
          title: newSettings.title,
          font_family: newSettings.fontFamily,
          title_color: newSettings.titleColor,
          beverage_name_color: newSettings.beverageNameColor,
          brewery_color: newSettings.breweryColor,
          style_color: newSettings.styleColor,
          abv_color: newSettings.abvColor,
          description_color: newSettings.descriptionColor,
        })
        .eq('id', existingSettings.id);

      if (error) {
        console.error('Error updating settings:', error);
        return;
      }
    }

    await loadSettings();
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
