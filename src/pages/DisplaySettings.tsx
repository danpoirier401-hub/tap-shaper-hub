import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, Monitor, Type, Palette } from 'lucide-react';
import { useTaplistData } from '@/hooks/useTaplistData';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DisplaySettings = () => {
  const { settings, updateSettings } = useTaplistData();
  const { toast } = useToast();
  const [title, setTitle] = useState(settings.title);
  const [fontFamily, setFontFamily] = useState(settings.fontFamily || 'Inter');
  const [titleColor, setTitleColor] = useState(settings.titleColor || '#d4af37');
  const [beverageNameColor, setBeverageNameColor] = useState(settings.beverageNameColor || '#d4af37');
  const [breweryColor, setBreweryColor] = useState(settings.breweryColor || '#9ca3af');
  const [styleColor, setStyleColor] = useState(settings.styleColor || '#9ca3af');
  const [abvColor, setAbvColor] = useState(settings.abvColor || '#9ca3af');
  const [descriptionColor, setDescriptionColor] = useState(settings.descriptionColor || '#e5e7eb');

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

  const handleStyleUpdate = () => {
    updateSettings({ 
      fontFamily,
      titleColor,
      beverageNameColor,
      breweryColor,
      styleColor,
      abvColor,
      descriptionColor
    });
    toast({
      title: "Styles updated",
      description: "Your display styles have been changed successfully.",
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Type className="h-5 w-5" />
                  <span>Font Family</span>
                </CardTitle>
                <CardDescription>
                  Choose the font for your display
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="font">Font Family</Label>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger id="font">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter (Default)</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Courier New">Courier New</SelectItem>
                      <SelectItem value="Verdana">Verdana</SelectItem>
                      <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
                      <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleStyleUpdate} className="w-full">
                  Apply Font
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Colors</span>
                </CardTitle>
                <CardDescription>
                  Customize colors for different elements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="titleColor">Title</Label>
                    <Input
                      id="titleColor"
                      type="color"
                      value={titleColor}
                      onChange={(e) => setTitleColor(e.target.value)}
                      className="h-10 cursor-pointer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="beverageNameColor">Beverage Name</Label>
                    <Input
                      id="beverageNameColor"
                      type="color"
                      value={beverageNameColor}
                      onChange={(e) => setBeverageNameColor(e.target.value)}
                      className="h-10 cursor-pointer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="breweryColor">Brewery/Producer</Label>
                    <Input
                      id="breweryColor"
                      type="color"
                      value={breweryColor}
                      onChange={(e) => setBreweryColor(e.target.value)}
                      className="h-10 cursor-pointer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="styleColor">Style</Label>
                    <Input
                      id="styleColor"
                      type="color"
                      value={styleColor}
                      onChange={(e) => setStyleColor(e.target.value)}
                      className="h-10 cursor-pointer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="abvColor">ABV</Label>
                    <Input
                      id="abvColor"
                      type="color"
                      value={abvColor}
                      onChange={(e) => setAbvColor(e.target.value)}
                      className="h-10 cursor-pointer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="descriptionColor">Description</Label>
                    <Input
                      id="descriptionColor"
                      type="color"
                      value={descriptionColor}
                      onChange={(e) => setDescriptionColor(e.target.value)}
                      className="h-10 cursor-pointer"
                    />
                  </div>
                </div>
                <Button onClick={handleStyleUpdate} className="w-full">
                  Apply Colors
                </Button>
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