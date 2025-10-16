import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useTaplistData } from '@/hooks/useTaplistData';
import { Settings, Beer, Monitor } from 'lucide-react';

const Management = () => {
  const { beverages, taps } = useTaplistData();
  
  const activeTaps = taps.filter(tap => tap.beverage).length;
  
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold mb-2">Taplist Management</h1>
          <p className="text-muted-foreground">Manage your digital bar sign</p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Monitor className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{activeTaps}/{taps.length}</p>
                  <p className="text-sm text-muted-foreground">Active Taps</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Beer className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{beverages.length}</p>
                  <p className="text-sm text-muted-foreground">Total Beverages</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Settings className="h-8 w-8 text-gold" />
                <div>
                  <p className="text-sm font-medium">System</p>
                  <p className="text-sm text-muted-foreground">Ready</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Management Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>Display Settings</span>
              </CardTitle>
              <CardDescription>
                Customize the background and appearance of your taplist display
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/management/display">
                <Button className="w-full">Manage Display</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Beer className="h-5 w-5" />
                <span>Beverage Library</span>
              </CardTitle>
              <CardDescription>
                Add, edit, and organize your beer, wine, and coffee collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/management/beverages">
                <Button className="w-full">Manage Beverages</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Tap Assignment</span>
              </CardTitle>
              <CardDescription>
                Assign beverages to your {taps.length} taps and control what's currently flowing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/management/taps">
                <Button className="w-full">Assign Taps</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Fast access to common tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/" className="block">
                <Button variant="outline" className="w-full">
                  View Live Display
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Management;