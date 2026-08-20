-- Add homepage video support  
ALTER TABLE public.business_settings ADD COLUMN IF NOT EXISTS homepage_video_url text; 
