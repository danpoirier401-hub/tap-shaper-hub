-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'viewer');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policy for user_roles (users can view their own roles)
CREATE POLICY "Users can view own roles" ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Create security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'admin'
  )
$$;

-- Update beverages table policies
DROP POLICY "Public can insert beverages" ON public.beverages;
DROP POLICY "Public can update beverages" ON public.beverages;
DROP POLICY "Public can delete beverages" ON public.beverages;

CREATE POLICY "Only admins can insert beverages" ON public.beverages
FOR INSERT TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update beverages" ON public.beverages
FOR UPDATE TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete beverages" ON public.beverages
FOR DELETE TO authenticated
USING (public.is_admin(auth.uid()));

-- Update taps table policies
DROP POLICY "Public can update taps" ON public.taps;

CREATE POLICY "Only admins can update taps" ON public.taps
FOR UPDATE TO authenticated
USING (public.is_admin(auth.uid()));

-- Update taplist_settings table policies
DROP POLICY "Public can update settings" ON public.taplist_settings;

CREATE POLICY "Only admins can update settings" ON public.taplist_settings
FOR UPDATE TO authenticated
USING (public.is_admin(auth.uid()));