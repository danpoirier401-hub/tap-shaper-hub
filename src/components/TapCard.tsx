import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tap } from '@/types/taplist';

interface TapCardProps {
  tap: Tap;
}

export function TapCard({ tap }: TapCardProps) {
  const { beverage, id } = tap;

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
    <div className="flex items-start gap-6 p-4 bg-transparent">
      {beverage.label && (
        <div className="flex-shrink-0">
          <img
            src={beverage.label}
            alt={`${beverage.name} label`}
            className="w-16 h-16 object-contain rounded"
          />
        </div>
      )}
      
      <div className="flex-1 space-y-1">
        <h3 className="text-xl font-bold text-gold">{beverage.name}</h3>
        {beverage.brewery && (
          <p className="text-sm text-muted-foreground">{beverage.brewery}</p>
        )}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {beverage.style && <span>{beverage.style}</span>}
          {beverage.abv && <span>{beverage.abv}% ABV</span>}
        </div>
        {beverage.description && (
          <p className="text-sm text-foreground/80 mt-3 leading-relaxed">
            {beverage.description}
          </p>
        )}
      </div>
    </div>
  );
}