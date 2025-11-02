-- Drop the restrictive policy
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;

-- Create a new policy that allows first-time admin creation
CREATE POLICY "Allow first admin creation or admin inserts"
ON public.user_roles FOR INSERT
WITH CHECK (
  -- Allow if no admins exist yet (first admin)
  NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
  OR 
  -- Or if user is already an admin
  public.is_admin(auth.uid())
);

-- Also update the admin signup setting to be more controlled
-- Create a function to safely create first admin
CREATE OR REPLACE FUNCTION public.create_first_admin(
  p_user_id UUID,
  p_role app_role
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow if no admins exist yet
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (p_user_id, p_role);
  ELSE
    RAISE EXCEPTION 'Admin already exists. Use admin dashboard to create additional admins.';
  END IF;
END;
$$;