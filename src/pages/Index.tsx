import { useTaplistData } from '@/hooks/useTaplistData';
import { TapCard } from '@/components/TapCard';

const Index = () => {
  const { taps, settings } = useTaplistData();

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
          <div className="text-center mb-12">
            <h1 className="hero-title mb-4">{settings.title}</h1>
            <p className="text-xl text-muted-foreground">
              Featuring {taps.filter(tap => tap.isActive).length} of 4 taps flowing
            </p>
          </div>
          
          {/* Tap Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {taps.map((tap) => (
              <TapCard key={tap.id} tap={tap} />
            ))}
          </div>
          
          {/* Footer */}
          <div className="text-center mt-16 text-muted-foreground">
            <p>Last updated: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
