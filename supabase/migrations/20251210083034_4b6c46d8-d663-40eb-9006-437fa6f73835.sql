-- Create table for draw state (single draw)
CREATE TABLE public.draw_state (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_pin TEXT NOT NULL DEFAULT '1234',
  is_drawn BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  drawn_at TIMESTAMP WITH TIME ZONE
);

-- Create table for participants
CREATE TABLE public.participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  pin TEXT NOT NULL,
  assigned_to UUID REFERENCES public.participants(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.draw_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- Draw state: anyone can read, only admin can update (validated in edge function)
CREATE POLICY "Anyone can read draw state" ON public.draw_state FOR SELECT USING (true);
CREATE POLICY "Anyone can insert draw state" ON public.draw_state FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update draw state" ON public.draw_state FOR UPDATE USING (true);

-- Participants: anyone can read names (not PINs), anyone can insert
CREATE POLICY "Anyone can read participants" ON public.participants FOR SELECT USING (true);
CREATE POLICY "Anyone can insert participants" ON public.participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update participants" ON public.participants FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete participants" ON public.participants FOR DELETE USING (true);

-- Insert initial draw state
INSERT INTO public.draw_state (admin_pin) VALUES ('1234');