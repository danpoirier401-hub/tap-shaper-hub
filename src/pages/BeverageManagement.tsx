import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Upload } from 'lucide-react';
import { useTaplistData } from '@/hooks/useTaplistData';
import { useToast } from '@/hooks/use-toast';
import { Beverage } from '@/types/taplist';
import { z } from 'zod';

const beverageSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  type: z.enum(['beer', 'wine', 'coffee', 'other']),
  brewery: z.string().max(100, 'Brewery name must be less than 100 characters').optional().or(z.literal('')),
  abv: z.number().min(0, 'ABV cannot be negative').max(100, 'ABV cannot exceed 100%').optional(),
  style: z.string().max(50, 'Style must be less than 50 characters').optional().or(z.literal('')),
  description: z.string().max(500, 'Description must be less than 500 characters').optional().or(z.literal('')),
  label: z.string().optional()
});

const BeverageManagement = () => {
  const { beverages, addBeverage, updateBeverage, deleteBeverage } = useTaplistData();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'beer' as Beverage['type'],
    brewery: '',
    abv: '',
    style: '',
    description: '',
    label: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'beer',
      brewery: '',
      abv: '',
      style: '',
      description: '',
      label: '',
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const beverageData = beverageSchema.parse({
        name: formData.name,
        type: formData.type,
        brewery: formData.brewery,
        abv: formData.abv ? parseFloat(formData.abv) : undefined,
        style: formData.style,
        description: formData.description,
        label: formData.label
      });

      const dataToSubmit = {
        name: beverageData.name,
        type: beverageData.type,
        brewery: beverageData.brewery || undefined,
        abv: beverageData.abv,
        style: beverageData.style || undefined,
        description: beverageData.description || undefined,
        label: beverageData.label || undefined,
      };

      if (editingId) {
        updateBeverage(editingId, dataToSubmit);
        toast({
          title: "Beverage updated",
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        addBeverage(dataToSubmit);
        toast({
          title: "Beverage added",
          description: `${formData.name} has been added to your library.`,
        });
      }
      resetForm();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation Error',
          description: error.errors[0].message,
          variant: 'destructive'
        });
        return;
      }
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (beverage: Beverage) => {
    setFormData({
      name: beverage.name,
      type: beverage.type,
      brewery: beverage.brewery || '',
      abv: beverage.abv?.toString() || '',
      style: beverage.style || '',
      description: beverage.description || '',
      label: beverage.label || '',
    });
    setEditingId(beverage.id);
    setIsAdding(true);
  };

  const handleDelete = (beverage: Beverage) => {
    deleteBeverage(beverage.id);
    toast({
      title: "Beverage deleted",
      description: `${beverage.name} has been removed from your library.`,
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({ 
        title: 'Error', 
        description: 'Image must be less than 5MB',
        variant: 'destructive'
      });
      event.target.value = '';
      return;
    }
    
    // Validate file type (enforced by storage bucket as well)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Error',
        description: 'Please upload a JPG, PNG, WebP, or GIF image',
        variant: 'destructive'
      });
      event.target.value = '';
      return;
    }

    try {
      // Upload to Supabase Storage
      const { supabase } = await import('@/integrations/supabase/client');
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('beverage-labels')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('beverage-labels')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, label: publicUrl }));
      
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive'
      });
      event.target.value = '';
    }
  };

  const getTypeColor = (type: Beverage['type']) => {
    switch (type) {
      case 'beer': return 'bg-amber-500/20 text-amber-400';
      case 'wine': return 'bg-purple-500/20 text-purple-400';
      case 'coffee': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link to="/management" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Management
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gold mb-2">Beverage Library</h1>
              <p className="text-muted-foreground">Manage your collection of beers, wines, and coffees</p>
            </div>
            <Button onClick={() => setIsAdding(true)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Beverage</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Panel */}
          {isAdding && (
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>{editingId ? 'Edit' : 'Add'} Beverage</CardTitle>
                <CardDescription>
                  {editingId ? 'Update' : 'Add a new'} beverage to your library
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Beverage name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value: Beverage['type']) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beer">Beer</SelectItem>
                        <SelectItem value="wine">Wine</SelectItem>
                        <SelectItem value="coffee">Coffee</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="brewery">Brewery/Producer</Label>
                    <Input
                      id="brewery"
                      value={formData.brewery}
                      onChange={(e) => setFormData(prev => ({ ...prev, brewery: e.target.value }))}
                      placeholder="Producer name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="abv">ABV %</Label>
                      <Input
                        id="abv"
                        type="number"
                        step="0.1"
                        value={formData.abv}
                        onChange={(e) => setFormData(prev => ({ ...prev, abv: e.target.value }))}
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="style">Style</Label>
                      <Input
                        id="style"
                        value={formData.style}
                        onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
                        placeholder="IPA, Lager..."
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Tasting notes, description..."
                      rows={3}
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.description.length}/500 characters
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="label">Label Image</Label>
                    <Input
                      id="label"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                    {formData.label && (
                      <img
                        src={formData.label}
                        alt="Label preview"
                        className="mt-2 w-full h-24 object-contain border rounded"
                      />
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" className="flex-1">
                      {editingId ? 'Update' : 'Add'} Beverage
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Beverage List */}
          <div className={`${isAdding ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <div className="space-y-4">
              {beverages.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">No beverages in your library yet.</p>
                    <Button onClick={() => setIsAdding(true)} variant="outline">
                      Add Your First Beverage
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                beverages.map((beverage) => (
                  <Card key={beverage.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {beverage.label && (
                          <img
                            src={beverage.label}
                            alt={`${beverage.name} label`}
                            className="w-16 h-16 object-contain rounded border"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gold">{beverage.name}</h3>
                              {beverage.brewery && (
                                <p className="text-sm text-muted-foreground">{beverage.brewery}</p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getTypeColor(beverage.type)}>
                                {beverage.type}
                              </Badge>
                              {beverage.abv && (
                                <Badge variant="outline">{beverage.abv}% ABV</Badge>
                              )}
                            </div>
                          </div>
                          
                          {beverage.style && (
                            <Badge variant="secondary" className="mt-2 mr-2">
                              {beverage.style}
                            </Badge>
                          )}
                          
                          {beverage.description && (
                            <p className="text-sm text-foreground/80 mt-2">{beverage.description}</p>
                          )}
                          
                          <div className="flex space-x-2 mt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(beverage)}
                              className="flex items-center space-x-1"
                            >
                              <Pencil className="h-3 w-3" />
                              <span>Edit</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(beverage)}
                              className="flex items-center space-x-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Delete</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeverageManagement;