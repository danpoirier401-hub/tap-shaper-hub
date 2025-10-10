export interface Beverage {
  id: string;
  name: string;
  type: 'beer' | 'wine' | 'coffee' | 'other';
  brewery?: string;
  abv?: number;
  style?: string;
  description?: string;
  label?: string; // base64 encoded image
}

export interface Tap {
  id: number;
  beverage?: Beverage;
  isActive: boolean;
}

export interface TaplistSettings {
  backgroundImage?: string; // base64 encoded image
  title: string;
  fontFamily?: string;
  titleColor?: string;
  beverageNameColor?: string;
  breweryColor?: string;
  styleColor?: string;
  abvColor?: string;
  descriptionColor?: string;
}