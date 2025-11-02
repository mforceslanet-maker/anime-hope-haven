import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { RefreshCw, Users, MessageSquare } from 'lucide-react';

interface Room {
  id: string;
  room_name: string;
  ip_address: string;
  first_seen: string;
  last_seen: string;
  session_count: number;
}

interface RoomWithProfile extends Room {
  profile_count: number;
  message_count: number;
  last_character: string;
}

export const SupportDashboard = () => {
  const [rooms, setRooms] = useState<RoomWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRooms = async () => {
    setLoading(true);
    try {
      // Get all rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .order('last_seen', { ascending: false });

      if (roomsError) throw roomsError;

      // Get profile and message counts for each room
      const roomsWithStats = await Promise.all(
        (roomsData || []).map(async (room) => {
          // Get profiles for this room
          const { data: profiles, count: profileCount } = await supabase
            .from('profiles')
            .select('id', { count: 'exact' })
            .eq('room_id', room.id);

          const profileIds = profiles?.map(p => p.id) || [];

          // Get sessions for these profiles
          const { data: sessions } = await supabase
            .from('chat_sessions')
            .select('id, character_name, profile_id')
            .in('profile_id', profileIds);

          const sessionIds = sessions?.map(s => s.id) || [];
          
          // Get message count
          let messageCount = 0;
          if (sessionIds.length > 0) {
            const { count } = await supabase
              .from('chat_messages')
              .select('*', { count: 'exact', head: true })
              .in('session_id', sessionIds);
            messageCount = count || 0;
          }

          const lastCharacter = sessions && sessions.length > 0 
            ? sessions[sessions.length - 1].character_name 
            : 'None';

          return {
            ...room,
            profile_count: profileCount || 0,
            message_count: messageCount,
            last_character: lastCharacter
          };
        })
      );

      setRooms(roomsWithStats);
    } catch (error) {
      console.error('Error loading rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  const getActivityStatus = (lastSeen: string) => {
    const diffMs = new Date().getTime() - new Date(lastSeen).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 5) return { label: 'Active', variant: 'default' as const };
    if (diffMins < 30) return { label: 'Recent', variant: 'secondary' as const };
    return { label: 'Inactive', variant: 'outline' as const };
  };

  return (
    <div className="min-h-screen bg-gradient-peaceful p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-comfortaa flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Support Dashboard
                </CardTitle>
                <CardDescription>
                  Monitor active rooms and provide quick support
                </CardDescription>
              </div>
              <Button onClick={loadRooms} disabled={loading} variant="outline">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
        </Card>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => {
              const status = getActivityStatus(room.last_seen);
              
              return (
                <Card key={room.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-comfortaa">
                        {room.room_name}
                      </CardTitle>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <CardDescription className="text-xs">
                      IP: {room.ip_address}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{room.profile_count} profiles</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <span>{room.message_count} messages</span>
                      </div>
                    </div>
                    
                    {room.last_character !== 'None' && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Last chatted with: </span>
                        <span className="font-medium">{room.last_character}</span>
                      </div>
                    )}
                    
                    <div className="pt-2 border-t text-xs text-muted-foreground space-y-1">
                      <div>First seen: {getTimeSince(room.first_seen)}</div>
                      <div>Last activity: {getTimeSince(room.last_seen)}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>

        {rooms.length === 0 && !loading && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No rooms found. Rooms will appear as users start conversations.</p>
          </Card>
        )}
      </div>
    </div>
  );
};
