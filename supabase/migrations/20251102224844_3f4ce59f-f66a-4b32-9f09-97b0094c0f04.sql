-- Create rooms table to track IPs and assign room names
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_name TEXT UNIQUE NOT NULL,
  ip_address TEXT NOT NULL,
  first_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_count INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read and create rooms (for anonymous users)
CREATE POLICY "Anyone can view rooms"
ON public.rooms FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert rooms"
ON public.rooms FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update rooms"
ON public.rooms FOR UPDATE
USING (true);

-- Add room reference to profiles
ALTER TABLE public.profiles ADD COLUMN room_id UUID REFERENCES public.rooms(id);

-- Add index for performance
CREATE INDEX idx_rooms_ip_address ON public.rooms(ip_address);
CREATE INDEX idx_profiles_room_id ON public.profiles(room_id);

-- Function to get or create room for an IP
CREATE OR REPLACE FUNCTION public.get_or_create_room(p_ip_address TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room_id UUID;
  v_room_count INTEGER;
  v_room_name TEXT;
BEGIN
  -- Check if room exists for this IP
  SELECT id INTO v_room_id
  FROM public.rooms
  WHERE ip_address = p_ip_address;

  IF v_room_id IS NOT NULL THEN
    -- Update last seen
    UPDATE public.rooms
    SET last_seen = now()
    WHERE id = v_room_id;
    
    RETURN v_room_id;
  END IF;

  -- Create new room with next available number
  SELECT COUNT(*) + 1 INTO v_room_count
  FROM public.rooms;

  v_room_name := 'room' || v_room_count::TEXT;

  -- Insert new room
  INSERT INTO public.rooms (room_name, ip_address)
  VALUES (v_room_name, p_ip_address)
  RETURNING id INTO v_room_id;

  RETURN v_room_id;
END;
$$;