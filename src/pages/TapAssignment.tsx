import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowLeft, Droplets, Coffee, Wine, Beer } from 'lucide-react';
import { useTaplistData } from '@/hooks/useTaplistData';
import { useToast } from '@/hooks/use-toast';
import { Beverage } from '@/types/taplist';

const TapAssignment = () => {
  const { beverages, taps, assignToTap } = useTaplistData();
  const { toast } = useToast();

  const handleTapAssignment = (tapId: number, beverageId: string | 'empty') => {
    const beverage = beverageId === 'empty' ? undefined : beverages.find(b => b.id === beverageId);
    assignToTap(tapId, beverageId === 'empty' ? undefined : beverageId);
    
    toast({
      title: "Tap updated",
      description: beverage 
        ? `Tap ${tapId} now serving ${beverage.name}`
        : `Tap ${tapId} is now empty`,
    });
  };

  const getTypeIcon = (type: Beverage['type']) => {
    switch (type) {
      case 'beer': return <Beer className="h-4 w-4" />;
      case 'wine': return <Wine className="h-4 w-4" />;
      case 'coffee': return <Coffee className="h-4 w-4" />;
      default: return <Droplets className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Beverage['type']) => {
    switch (type) {
      case 'beer': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'wine': return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'coffee': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/management" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Management
          </Link>
          <h1 className="text-4xl font-bold text-gold mb-2">Tap Assignment</h1>
          <p className="text-muted-foreground">Assign beverages to your 4 taps</p>
        </div>

        {beverages.length === 0 && (
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                You need to add beverages to your library before assigning them to taps.
              </p>
              <Link to="/management/beverages">
                <Button>Add Beverages</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {taps.map((tap) => (
            <Card key={tap.id} className={`${tap.isActive ? 'ring-2 ring-primary/50' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Droplets className="h-5 w-5" />
                    <span>Tap {tap.id}</span>
                  </span>
                  {tap.isActive && (
                    <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/40">
                      Active
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {tap.beverage ? `Currently serving ${tap.beverage.name}` : 'No beverage assigned'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tap.beverage && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      {tap.beverage.label && (
                        <img
                          src={tap.beverage.label}
                          alt={`${tap.beverage.name} label`}
                          className="w-12 h-12 object-contain rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gold">{tap.beverage.name}</h4>
                        {tap.beverage.brewery && (
                          <p className="text-sm text-muted-foreground">{tap.beverage.brewery}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getTypeColor(tap.beverage.type)}>
                            {getTypeIcon(tap.beverage.type)}
                            <span className="ml-1">{tap.beverage.type}</span>
                          </Badge>
                          {tap.beverage.abv && (
                            <Badge variant="outline">{tap.beverage.abv}% ABV</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium mb-2 block">Assign Beverage</label>
                  <Select
                    value={tap.beverage?.id || 'empty'}
                    onValueChange={(value) => handleTapAssignment(tap.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a beverage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="empty">Empty Tap</SelectItem>
                      {beverages.map((beverage) => (
                        <SelectItem key={beverage.id} value={beverage.id}>
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(beverage.type)}
                            <span>{beverage.name}</span>
                            {beverage.brewery && (
                              <span className="text-muted-foreground">- {beverage.brewery}</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex space-x-4">
              <Link to="/" target="_blank">
                <Button variant="outline">View Live Display</Button>
              </Link>
              <Link to="/management/beverages">
                <Button variant="outline">Manage Beverages</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TapAssignment;