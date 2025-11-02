-- Create relaxation categories table
CREATE TABLE public.relaxation_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.relaxation_categories ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view categories
CREATE POLICY "Anyone can view categories"
ON public.relaxation_categories FOR SELECT
USING (true);

-- Only admins can manage categories
CREATE POLICY "Admins can insert categories"
ON public.relaxation_categories FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update categories"
ON public.relaxation_categories FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete categories"
ON public.relaxation_categories FOR DELETE
USING (public.is_admin(auth.uid()));

-- Create relaxation music table
CREATE TABLE public.relaxation_music (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.relaxation_categories(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  youtube_video_id TEXT NOT NULL,
  duration TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.relaxation_music ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view active music
CREATE POLICY "Anyone can view active music"
ON public.relaxation_music FOR SELECT
USING (is_active = true OR public.is_admin(auth.uid()));

-- Only admins can manage music
CREATE POLICY "Admins can insert music"
ON public.relaxation_music FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update music"
ON public.relaxation_music FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete music"
ON public.relaxation_music FOR DELETE
USING (public.is_admin(auth.uid()));

-- Create indexes
CREATE INDEX idx_relaxation_music_category ON public.relaxation_music(category_id);
CREATE INDEX idx_relaxation_music_active ON public.relaxation_music(is_active);

-- Trigger for updating timestamps
CREATE TRIGGER update_relaxation_music_updated_at
BEFORE UPDATE ON public.relaxation_music
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.relaxation_categories (name, slug, description, icon, color) VALUES
('Military Personnel', 'military', 'Relaxation music for service members and veterans', 'shield', 'blue'),
('Healthcare Workers', 'healthcare', 'Calming sounds for medical professionals', 'heart-pulse', 'red'),
('Teachers', 'teachers', 'Peaceful music for educators', 'graduation-cap', 'green'),
('Community Members', 'community', 'Relaxation for everyone in the community', 'users', 'purple'),
('Staff & Workers', 'staff', 'Stress relief for all workers', 'briefcase', 'orange');