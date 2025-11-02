-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update roles"
ON public.user_roles FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles FOR DELETE
USING (public.is_admin(auth.uid()));

-- Update profiles table policies to allow admins to see all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.is_admin(auth.uid()));

-- Update chat_sessions policies to allow admins to see all sessions
CREATE POLICY "Admins can view all sessions"
ON public.chat_sessions FOR SELECT
USING (public.is_admin(auth.uid()));

-- Update chat_messages policies to allow admins to see all messages
CREATE POLICY "Admins can view all messages"
ON public.chat_messages FOR SELECT
USING (public.is_admin(auth.uid()));

-- Update rooms policies to allow admins to see all rooms
CREATE POLICY "Admins can view all rooms"
ON public.rooms FOR SELECT
USING (public.is_admin(auth.uid()));

-- Create admin settings table
CREATE TABLE public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Insert signup enabled setting (default true for first signup)
INSERT INTO public.admin_settings (setting_key, setting_value)
VALUES ('signup_enabled', true);

-- Policies for admin settings
CREATE POLICY "Anyone can view admin settings"
ON public.admin_settings FOR SELECT
USING (true);

CREATE POLICY "Only admins can update settings"
ON public.admin_settings FOR UPDATE
USING (public.is_admin(auth.uid()));

-- Trigger for admin_settings
CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();