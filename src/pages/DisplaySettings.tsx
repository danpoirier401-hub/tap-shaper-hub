import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, Monitor } from 'lucide-react';
import { useTaplistData } from '@/hooks/useTaplistData';
import { useToast } from '@/hooks/use-toast';

const DisplaySettings = () => {
  const { settings, updateSettings } = useTaplistData();
  const { toast } = useToast();
  const [title, setTitle] = useState(settings.title);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateSettings({ backgroundImage: result });
        toast({
          title: "Background updated",
          description: "Your taplist background has been changed successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTitleUpdate = () => {
    updateSettings({ title });
    toast({
      title: "Title updated",
      description: "Your taplist title has been changed successfully.",
    });
  };

  const removeBackground = () => {
    updateSettings({ backgroundImage: undefined });
    toast({
      title: "Background removed",
      description: "The background image has been removed.",
    });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/management" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Management
          </Link>
          <h1 className="text-4xl font-bold text-gold mb-2">Display Settings</h1>
          <p className="text-muted-foreground">Customize the appearance of your taplist display</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Taplist Title</CardTitle>
                <CardDescription>
                  Change the main title displayed on your taplist
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter taplist title"
                  />
                </div>
                <Button onClick={handleTitleUpdate} className="w-full">
                  Update Title
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Background Image</span>
                </CardTitle>
                <CardDescription>
                  Upload a custom background image for your taplist display
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="background">Choose Image</Label>
                  <Input
                    id="background"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                </div>
                {settings.backgroundImage && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Current background:</p>
                    <img
                      src={settings.backgroundImage}
                      alt="Current background"
                      className="w-full h-32 object-cover rounded border"
                    />
                    <Button variant="destructive" onClick={removeBackground} className="w-full">
                      Remove Background
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>Live Preview</span>
              </CardTitle>
              <CardDescription>
                See how your display looks with current settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden bg-background relative">
                {settings.backgroundImage && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                    style={{ backgroundImage: `url(${settings.backgroundImage})` }}
                  />
                )}
                <div className="relative z-10 p-6 text-center">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gold to-copper bg-clip-text text-transparent mb-4">
                    {title || settings.title}
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((tap) => (
                      <div key={tap} className="bg-card/50 rounded p-2">
                        <div className="text-xs text-center text-muted-foreground">
                          Tap {tap}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/" target="_blank">
                  <Button variant="outline" className="w-full">
                    View Full Display
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DisplaySettings;