import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import { 
  Shield, 
  LogOut, 
  Users, 
  MessageSquare, 
  Clock,
  RefreshCw,
  Settings,
  Music
} from 'lucide-react';

interface Room {
  id: string;
  room_name: string;
  ip_address: string;
  last_seen: string;
}

interface ChatSession {
  id: string;
  character_name: string;
  started_at: string;
  last_message_at: string;
  profile: {
    room: Room;
  };
}

interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  emotion?: string;
  created_at: string;
  session: ChatSession;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [signupEnabled, setSignupEnabled] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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

      // Check if user is admin
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .single();

      if (!roles) {
        await supabase.auth.signOut();
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
      // Load all messages with room info
      const { data: messagesData } = await supabase
        .from('chat_messages')
        .select(`
          *,
          session:chat_sessions(
            id,
            character_name,
            started_at,
            last_message_at,
            profile:profiles(
              room:rooms(*)
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      setMessages(messagesData || []);

      // Load all rooms
      const { data: roomsData } = await supabase
        .from('rooms')
        .select('*')
        .order('last_seen', { ascending: false });

      setRooms(roomsData || []);

      // Check signup status
      const { data: settings } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'signup_enabled')
        .single();

      setSignupEnabled(settings?.setting_value ?? false);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/auth');
  };

  const toggleSignup = async () => {
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({ setting_value: !signupEnabled })
        .eq('setting_key', 'signup_enabled');

      if (error) throw error;

      setSignupEnabled(!signupEnabled);
      toast({
        title: 'Settings updated',
        description: `Signup is now ${!signupEnabled ? 'enabled' : 'disabled'}.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-peaceful flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-peaceful p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle className="text-2xl font-comfortaa">Admin Dashboard</CardTitle>
                  <CardDescription>Monitor all chat communications</CardDescription>
                </div>
              </div>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Active Rooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rooms.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Total Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Signup Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant={signupEnabled ? 'default' : 'secondary'}>
                  {signupEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
                <Button size="sm" onClick={toggleSignup}>
                  Toggle
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="messages" className="space-y-4">
          <TabsList>
            <TabsTrigger value="messages">All Messages</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Messages</CardTitle>
                  <div className="flex gap-2">
                    <Button onClick={() => navigate('/admin/music')} size="sm" variant="outline">
                      <Music className="w-4 h-4 mr-2" />
                      Manage Music
                    </Button>
                    <Button onClick={loadData} size="sm" variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <Card key={message.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant={message.sender === 'user' ? 'default' : 'secondary'}>
                                {message.sender}
                              </Badge>
                              {message.emotion && (
                                <Badge variant="outline">{message.emotion}</Badge>
                              )}
                              <span className="text-sm text-muted-foreground">
                                {message.session?.profile?.room?.room_name || 'Unknown Room'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {formatTime(message.created_at)}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Character: {message.session?.character_name || 'Unknown'}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{message.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rooms.map((room) => (
                      <Card key={room.id}>
                        <CardHeader>
                          <CardTitle className="text-base">{room.room_name}</CardTitle>
                          <CardDescription className="text-xs">
                            IP: {room.ip_address}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xs text-muted-foreground">
                            Last seen: {formatTime(room.last_seen)}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
