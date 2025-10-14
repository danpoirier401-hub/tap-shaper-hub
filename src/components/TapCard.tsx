import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tap, TaplistSettings } from '@/types/taplist';

interface TapCardProps {
  tap: Tap;
  settings?: TaplistSettings;
}

export function TapCard({ tap, settings }: TapCardProps) {
  const { beverage, id } = tap;
  
  const fontStyle = settings?.fontFamily ? { fontFamily: settings.fontFamily } : {};

  if (!beverage) {
    return (
      <Card className="tap-card-empty">
        <div className="p-8 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <span className="text-2xl font-bold text-muted-foreground">{id}</span>
            </div>
          </div>
          <p className="text-muted-foreground">Tap Empty</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-transparent border-transparent shadow-none">
      <div className="flex items-start gap-8 p-6">
        {beverage.label && (
          <div className="flex-shrink-0">
            <img
              src={beverage.label}
              alt={`${beverage.name} label`}
              className="w-32 h-32 object-contain rounded"
            />
          </div>
        )}
        
        <div className="flex-1 space-y-2" style={fontStyle}>
          <h3 
            className="text-3xl font-bold text-gold" 
            style={{ 
              fontFamily: settings?.beverageNameFont || settings?.fontFamily,
              color: settings?.beverageNameColor 
            }}
          >
            {beverage.name}
          </h3>
          {beverage.brewery && (
            <p 
              className="text-lg text-muted-foreground" 
              style={{ 
                fontFamily: settings?.breweryFont || settings?.fontFamily,
                color: settings?.breweryColor 
              }}
            >
              {beverage.brewery}
            </p>
          )}
          <div className="flex items-center gap-4 text-base text-muted-foreground">
            {beverage.style && (
              <span style={{ 
                fontFamily: settings?.styleFont || settings?.fontFamily,
                color: settings?.styleColor 
              }}>
                {beverage.style}
              </span>
            )}
            {beverage.abv && (
              <span style={{ 
                fontFamily: settings?.abvFont || settings?.fontFamily,
                color: settings?.abvColor 
              }}>
                {beverage.abv}% ABV
              </span>
            )}
          </div>
          {beverage.description && (
            <p 
              className="text-base text-foreground/80 mt-4 leading-relaxed" 
              style={{ 
                fontFamily: settings?.descriptionFont || settings?.fontFamily,
                color: settings?.descriptionColor 
              }}
            >
              {beverage.description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}