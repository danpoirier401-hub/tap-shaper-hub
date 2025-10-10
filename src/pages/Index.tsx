import { useTaplistData } from '@/hooks/useTaplistData';
import { TapCard } from '@/components/TapCard';

const Index = () => {
  const { taps, settings } = useTaplistData();
  const activeTaps = taps.filter(tap => tap.isActive && tap.beverage);

  return (
    <div className="min-h-screen relative">
      {/* Custom Background */}
      {settings.backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${settings.backgroundImage})` }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 py-4">
            <h1 
              className="hero-title mb-4" 
              style={{ 
                fontFamily: settings.fontFamily,
                color: settings.titleColor 
              }}
            >
              {settings.title}
            </h1>
          </div>
          
          {/* Tap Grid */}
          {activeTaps.length > 0 ? (
            <div className={`grid gap-6 ${
              activeTaps.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
              activeTaps.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
              activeTaps.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            }`}>
              {activeTaps.map((tap) => (
                <TapCard key={tap.id} tap={tap} settings={settings} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <span className="text-4xl">🍺</span>
              </div>
              <h3 className="text-2xl font-semibold text-muted-foreground mb-2">No Active Taps</h3>
              <p className="text-muted-foreground">
                Visit the management panel to assign beverages to your taps
              </p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Index;
