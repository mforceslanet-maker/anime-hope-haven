import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { useToast } from '../hooks/use-toast';
import { Music, Plus, Trash2, ArrowLeft, ExternalLink } from 'lucide-react';
import { Badge } from '../components/ui/badge';

interface Category {
  id: string;
  name: string;
}

interface Track {
  id: string;
  title: string;
  youtube_url: string;
  youtube_video_id: string;
  description: string;
  category_id: string;
  is_active: boolean;
  category: { name: string };
}

export default function AdminMusicManager() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    youtube_url: '',
    description: '',
    category_id: '',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/admin/auth');
        return;
      }

      setUser(session.user);

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .single();

      if (!roles) {
        navigate('/admin/auth');
        return;
      }

      setIsAdmin(true);
      await loadData();
    } catch (error) {
      console.error('Auth error:', error);
      navigate('/admin/auth');
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const { data: categoriesData } = await supabase
        .from('relaxation_categories')
        .select('id, name')
        .order('name');

      setCategories(categoriesData || []);

      const { data: tracksData } = await supabase
        .from('relaxation_music')
        .select(`
          *,
          category:relaxation_categories(name)
        `)
        .order('created_at', { ascending: false });

      setTracks(tracksData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const extractVideoId = (url: string): string => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/,
      /youtube\.com\/embed\/([^&\s?]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        // Remove any query parameters or fragments
        return match[1].split('?')[0].split('&')[0].split('#')[0];
      }
    }

    // If no pattern matches, clean the input anyway
    return url.split('?')[0].split('&')[0].split('#')[0];
  };

  const handleAddTrack = async () => {
    try {
      if (!formData.title || !formData.youtube_url || !formData.category_id) {
        toast({
          title: 'Error',
          description: 'Please fill in all required fields',
          variant: 'destructive',
        });
        return;
      }

      const videoId = extractVideoId(formData.youtube_url);

      const { error } = await supabase
        .from('relaxation_music')
        .insert({
          title: formData.title,
          youtube_url: formData.youtube_url,
          youtube_video_id: videoId,
          description: formData.description,
          category_id: formData.category_id,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Track added successfully',
      });

      setIsAddOpen(false);
      setFormData({ title: '', youtube_url: '', description: '', category_id: '' });
      await loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTrack = async (id: string) => {
    try {
      const { error } = await supabase
        .from('relaxation_music')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Track deleted successfully',
      });

      await loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const toggleTrackStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('relaxation_music')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Track ${!currentStatus ? 'activated' : 'deactivated'}`,
      });

      await loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-peaceful p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Music className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle className="text-2xl font-comfortaa">Relaxation Music Manager</CardTitle>
                  <CardDescription>Add and manage YouTube music links</CardDescription>
                </div>
              </div>

              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Track
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Track</DialogTitle>
                    <DialogDescription>
                      Add a YouTube link for relaxation music
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Track Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Peaceful Ocean Sounds"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category_id}
                        onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="youtube_url">YouTube URL *</Label>
                      <Input
                        id="youtube_url"
                        value={formData.youtube_url}
                        onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief description of the track"
                      />
                    </div>
                    <Button onClick={handleAddTrack} className="w-full">
                      Add Track
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-4">
          {tracks.map((track) => (
            <Card key={track.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{track.title}</h3>
                      <Badge variant={track.is_active ? 'default' : 'secondary'}>
                        {track.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{track.category.name}</Badge>
                    </div>
                    {track.description && (
                      <p className="text-sm text-muted-foreground mb-2">{track.description}</p>
                    )}
                    <a
                      href={track.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      View on YouTube <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleTrackStatus(track.id, track.is_active)}
                    >
                      {track.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteTrack(track.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {tracks.length === 0 && (
          <Card className="p-8 text-center">
            <Music className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No tracks added yet. Click "Add Track" to get started.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
