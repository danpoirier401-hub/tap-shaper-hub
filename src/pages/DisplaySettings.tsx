import { useState, useEffect } from 'react';
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
  const [title, setTitle] = useState('');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [titleColor, setTitleColor] = useState('#d4af37');
  const [beverageNameColor, setBeverageNameColor] = useState('#d4af37');
  const [breweryColor, setBreweryColor] = useState('#9ca3af');
  const [styleColor, setStyleColor] = useState('#9ca3af');
  const [abvColor, setAbvColor] = useState('#9ca3af');
  const [descriptionColor, setDescriptionColor] = useState('#e5e7eb');
  
  // Individual font selections
  const [titleFont, setTitleFont] = useState('Inter');
  const [beverageNameFont, setBeverageNameFont] = useState('Inter');
  const [breweryFont, setBreweryFont] = useState('Inter');
  const [styleFont, setStyleFont] = useState('Inter');
  const [abvFont, setAbvFont] = useState('Inter');
  const [descriptionFont, setDescriptionFont] = useState('Inter');

  // Update local state when settings load from database
  useEffect(() => {
    if (settings) {
      setTitle(settings.title || 'On Tap');
      setFontFamily(settings.fontFamily || 'Inter');
      setTitleColor(settings.titleColor || '#d4af37');
      setBeverageNameColor(settings.beverageNameColor || '#d4af37');
      setBreweryColor(settings.breweryColor || '#9ca3af');
      setStyleColor(settings.styleColor || '#9ca3af');
      setAbvColor(settings.abvColor || '#9ca3af');
      setDescriptionColor(settings.descriptionColor || '#e5e7eb');
      setTitleFont(settings.titleFont || settings.fontFamily || 'Inter');
      setBeverageNameFont(settings.beverageNameFont || settings.fontFamily || 'Inter');
      setBreweryFont(settings.breweryFont || settings.fontFamily || 'Inter');
      setStyleFont(settings.styleFont || settings.fontFamily || 'Inter');
      setAbvFont(settings.abvFont || settings.fontFamily || 'Inter');
      setDescriptionFont(settings.descriptionFont || settings.fontFamily || 'Inter');
    }
  }, [settings]);

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
      descriptionColor,
      titleFont,
      beverageNameFont,
      breweryFont,
      styleFont,
      abvFont,
      descriptionFont
    });
    toast({
      title: "Styles updated",
      description: "Your display styles have been changed successfully.",
    });
  };

  const fontOptions = [
    { value: 'Inter', label: 'Inter (Default)', emoji: '' },
    { value: 'Arial', label: 'Arial', emoji: '' },
    { value: 'Georgia', label: 'Georgia', emoji: '' },
    { value: 'Times New Roman', label: 'Times New Roman', emoji: '' },
    { value: 'Courier New', label: 'Courier New', emoji: '' },
    { value: 'Verdana', label: 'Verdana', emoji: '' },
    { value: 'Trebuchet MS', label: 'Trebuchet MS', emoji: '' },
    { value: 'Comic Sans MS', label: 'Comic Sans MS', emoji: '' },
    { value: 'Creepster', label: 'Creepster', emoji: '🎃' },
    { value: 'Nosifer', label: 'Nosifer', emoji: '🦇' },
    { value: 'Eater', label: 'Eater', emoji: '🧟' },
    { value: 'Butcherman', label: 'Butcherman', emoji: '🔪' },
    { value: 'Special Elite', label: 'Special Elite', emoji: '👻' },
    { value: 'Cabin Sketch', label: 'Cabin Sketch', emoji: '🕷️' },
    { value: 'Metal Mania', label: 'Metal Mania', emoji: '⚡' },
    { value: 'Lacquer', label: 'Lacquer', emoji: '💀' },
    { value: 'Rubik Wet Paint', label: 'Rubik Wet Paint', emoji: '🩸' },
    { value: 'Finger Paint', label: 'Finger Paint', emoji: '🖐️' },
    { value: 'Rubik Moonrocks', label: 'Rubik Moonrocks', emoji: '🌙' },
    { value: 'Rubik Puddles', label: 'Rubik Puddles', emoji: '💧' },
    { value: 'Henny Penny', label: 'Henny Penny', emoji: '🐔' },
    { value: 'Freckle Face', label: 'Freckle Face', emoji: '👧' },
    { value: 'Jolly Lodger', label: 'Jolly Lodger', emoji: '🏴‍☠️' },
  ];

  const FontSelector = ({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) => (
    <div>
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {fontOptions.map(font => (
            <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
              {font.emoji && `${font.emoji} `}{font.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

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
                  <span>Typography</span>
                </CardTitle>
                <CardDescription>
                  Choose fonts for each element individually
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FontSelector value={titleFont} onChange={setTitleFont} label="Title Font" />
                <FontSelector value={beverageNameFont} onChange={setBeverageNameFont} label="Beverage Name Font" />
                <FontSelector value={breweryFont} onChange={setBreweryFont} label="Brewery Font" />
                <FontSelector value={styleFont} onChange={setStyleFont} label="Style Font" />
                <FontSelector value={abvFont} onChange={setAbvFont} label="ABV Font" />
                <FontSelector value={descriptionFont} onChange={setDescriptionFont} label="Description Font" />
                <Button onClick={handleStyleUpdate} className="w-full">
                  Apply Fonts
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
                  <h2 
                    className="text-2xl font-bold mb-4"
                    style={{ fontFamily: titleFont, color: titleColor }}
                  >
                    {title || settings.title}
                  </h2>
                  <div className="space-y-3 text-left bg-card/50 rounded p-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Beverage Name:</p>
                      <p style={{ fontFamily: beverageNameFont, color: beverageNameColor }} className="font-bold">Sample IPA</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Brewery:</p>
                      <p style={{ fontFamily: breweryFont, color: breweryColor }}>Sample Brewery</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Style:</p>
                      <p style={{ fontFamily: styleFont, color: styleColor }}>American IPA</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">ABV:</p>
                      <p style={{ fontFamily: abvFont, color: abvColor }}>6.5%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Description:</p>
                      <p style={{ fontFamily: descriptionFont, color: descriptionColor }} className="text-sm">A hoppy, citrus-forward IPA with notes of grapefruit.</p>
                    </div>
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