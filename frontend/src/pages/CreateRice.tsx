import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { riceService } from '../services/riceService';
import { imageUploadService } from '../services/imageUploadService';
import type { RiceCreate, ThemeCreate, MediaCreate } from '../types';
import Header from '../components/Header';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Plus, Trash2, Upload, Info } from "lucide-react";

export default function CreateRice() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState<string | null>(null); // "themeIndex-mediaIndex"

  const [riceName, setRiceName] = useState('');
  const [dotfileUrl, setDotfileUrl] = useState('');
  const [themes, setThemes] = useState<ThemeCreate[]>([
    {
      name: '',
      description: '',
      tags: '',
      display_order: 0,
      media: [{ url: '', media_type: 'IMAGE', display_order: 0 }]
    }
  ]);

  const addTheme = () => {
    setThemes([
      ...themes,
      {
        name: '',
        description: '',
        tags: '',
        display_order: themes.length,
        media: [{ url: '', media_type: 'IMAGE', display_order: 0 }]
      }
    ]);
  };

  const removeTheme = (index: number) => {
    setThemes(themes.filter((_, i) => i !== index));
  };

  const updateTheme = (index: number, field: keyof ThemeCreate, value: any) => {
    const updated = [...themes];
    updated[index] = { ...updated[index], [field]: value };
    setThemes(updated);
  };

  const addMedia = (themeIndex: number) => {
    const updated = [...themes];
    const currentMedia = updated[themeIndex].media || [];
    updated[themeIndex].media = [
      ...currentMedia,
      { url: '', media_type: 'IMAGE', display_order: currentMedia.length }
    ];
    setThemes(updated);
  };

  const removeMedia = (themeIndex: number, mediaIndex: number) => {
    const updated = [...themes];
    const currentMedia = updated[themeIndex].media || [];
    updated[themeIndex].media = currentMedia.filter((_, i) => i !== mediaIndex);
    setThemes(updated);
  };

  const updateMedia = (themeIndex: number, mediaIndex: number, field: keyof MediaCreate, value: any) => {
    const updated = [...themes];
    const media = updated[themeIndex].media;
    if (media && media[mediaIndex]) {
      media[mediaIndex] = {
        ...media[mediaIndex],
        [field]: value
      };
      setThemes(updated);
    }
  };

  const handleFileUpload = async (themeIndex: number, mediaIndex: number, file: File) => {
    const uploadKey = `${themeIndex}-${mediaIndex}`;
    setUploadingMedia(uploadKey);
    setError('');

    try {
      const result = await imageUploadService.uploadImage(file);
      updateMedia(themeIndex, mediaIndex, 'url', result.url);
      updateMedia(themeIndex, mediaIndex, 'thumbnail_url', result.thumbnailUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingMedia(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!riceName.trim()) {
      setError('Rice name is required');
      return;
    }

    if (!dotfileUrl.trim()) {
      setError('Dotfile URL is required');
      return;
    }

    setLoading(true);

    try {
      const riceData: RiceCreate = {
        name: riceName,
        dotfile_url: dotfileUrl,
        themes: themes
      };

      await riceService.createRice(riceData);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create rice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Create New Rice</h1>
            <Button variant="outline" onClick={() => navigate('/')}>Cancel</Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Enter the core details of your rice setup.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="riceName">
                    Rice Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="riceName"
                    type="text"
                    value={riceName}
                    onChange={(e) => setRiceName(e.target.value)}
                    required
                    placeholder="My Awesome Rice"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dotfileUrl">
                    Dotfile URL <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="dotfileUrl"
                    type="url"
                    value={dotfileUrl}
                    onChange={(e) => setDotfileUrl(e.target.value)}
                    required
                    placeholder="https://github.com/user/dotfiles"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Themes */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">Themes</h2>
                  <p className="text-sm text-muted-foreground">Add different variations of your setup (e.g., Light, Dark).</p>
                </div>
                <Button
                  type="button"
                  onClick={addTheme}
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Theme
                </Button>
              </div>

              {themes.map((theme, themeIndex) => (
                <Card key={themeIndex} className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="h-6 w-6 rounded-full flex items-center justify-center p-0">
                        {themeIndex + 1}
                      </Badge>
                      <CardTitle className="text-xl">Theme Details</CardTitle>
                    </div>
                    {themes.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTheme(themeIndex)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Remove Theme
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Theme Name</Label>
                        <Input
                          type="text"
                          value={theme.name}
                          onChange={(e) => updateTheme(themeIndex, 'name', e.target.value)}
                          placeholder="e.g. Dark Mode, Minimalist"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tags</Label>
                        <Input
                          type="text"
                          value={theme.tags}
                          onChange={(e) => updateTheme(themeIndex, 'tags', e.target.value)}
                          placeholder="dark, minimal, nord"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={theme.description}
                        onChange={(e) => updateTheme(themeIndex, 'description', e.target.value)}
                        rows={2}
                        placeholder="A short description of this theme..."
                      />
                    </div>

                    {/* Media */}
                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Media Assets</h4>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => addMedia(themeIndex)}
                          className="gap-2"
                        >
                          <Plus className="w-3 h-3" /> Add Media
                        </Button>
                      </div>

                      <div className="grid gap-4">
                        {(theme.media || []).map((media, mediaIndex) => (
                          <div key={mediaIndex} className="relative p-4 rounded-xl border bg-muted/30 space-y-4 group">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase text-muted-foreground/70">Asset {mediaIndex + 1}</span>
                              {(theme.media?.length || 0) > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeMedia(themeIndex, mediaIndex)}
                                  className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>

                            <div className="space-y-4">
                              <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 space-y-2">
                                  <Label className="text-xs">Media URL or Upload</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      type="url"
                                      value={media.url}
                                      onChange={(e) => updateMedia(themeIndex, mediaIndex, 'url', e.target.value)}
                                      className="h-9"
                                      placeholder="https://example.com/image.png"
                                    />
                                    <div className="relative">
                                      <Button
                                        type="button"
                                        size="sm"
                                        disabled={uploadingMedia === `${themeIndex}-${mediaIndex}`}
                                        className="h-9 gap-2 relative"
                                        asChild
                                      >
                                        <label className="cursor-pointer">
                                          {uploadingMedia === `${themeIndex}-${mediaIndex}` ? (
                                            <span className="animate-spin mr-1">⌛</span>
                                          ) : (
                                            <Upload className="w-4 h-4" />
                                          )}
                                          {uploadingMedia === `${themeIndex}-${mediaIndex}` ? '...' : 'Upload'}
                                          <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            disabled={uploadingMedia === `${themeIndex}-${mediaIndex}`}
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) handleFileUpload(themeIndex, mediaIndex, file);
                                            }}
                                          />
                                        </label>
                                      </Button>
                                    </div>
                                  </div>
                                </div>

                                <div className="w-full sm:w-32 space-y-2">
                                  <Label className="text-xs">Type</Label>
                                  <Select
                                    value={media.media_type}
                                    onValueChange={(val) => updateMedia(themeIndex, mediaIndex, 'media_type', val)}
                                  >
                                    <SelectTrigger className="h-9">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="IMAGE">Image</SelectItem>
                                      <SelectItem value="VIDEO">Video</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-xs">Thumbnail URL (optional)</Label>
                                <Input
                                  type="url"
                                  value={media.thumbnail_url || ''}
                                  onChange={(e) => updateMedia(themeIndex, mediaIndex, 'thumbnail_url', e.target.value)}
                                  className="h-9"
                                  placeholder="https://example.com/thumb.png"
                                />
                              </div>

                              {media.url && (
                                <div className="mt-2 relative aspect-video rounded-lg overflow-hidden border bg-background">
                                  <img
                                    src={media.url}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.currentTarget.parentElement!.style.display = 'none')}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>


            {/* Submit */}
            <div className="space-y-4 pt-4">
              <Separator />
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-12 text-base font-semibold"
                >
                  {loading ? 'Creating...' : 'Create Rice'}
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="h-12 px-8"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}