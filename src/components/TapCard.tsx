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
    <Card className="tap-card-active">
      <div className="p-6">
        <div className="mb-4 flex justify-between items-start">
          <Badge variant="outline" className="tap-number">
            Tap {id}
          </Badge>
          {beverage.abv && (
            <Badge variant="secondary" className="abv-badge">
              {beverage.abv}% ABV
            </Badge>
          )}
        </div>
        
        {beverage.label && (
          <div className="mb-4">
            <img
              src={beverage.label}
              alt={`${beverage.name} label`}
              className="w-full h-32 object-contain rounded"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gold">{beverage.name}</h3>
          {beverage.brewery && (
            <p className="text-sm text-muted-foreground">{beverage.brewery}</p>
          )}
          {beverage.style && (
            <Badge variant="outline" className="style-badge">
              {beverage.style}
            </Badge>
          )}
          {beverage.description && (
            <p className="text-sm text-foreground/80 mt-3 leading-relaxed">
              {beverage.description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}