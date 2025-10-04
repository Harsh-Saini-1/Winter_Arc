-- Add profile picture support and notes feature

-- Add conceptual_difficulty to questions table
ALTER TABLE public.questions 
ADD COLUMN IF NOT EXISTS conceptual_difficulty TEXT CHECK (conceptual_difficulty IN ('beginner', 'intermediate', 'advanced'));

-- Create question_notes table for user notes
CREATE TABLE IF NOT EXISTS public.question_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  note_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Enable RLS for question_notes
ALTER TABLE public.question_notes ENABLE ROW LEVEL SECURITY;

-- Question notes policies
CREATE POLICY "Users can view their own notes" ON public.question_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" ON public.question_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON public.question_notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON public.question_notes
  FOR DELETE USING (auth.uid() = user_id);

-- Add achievements table for gamification
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_type)
);

-- Enable RLS for achievements
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Achievements policies
CREATE POLICY "Users can view their own achievements" ON public.achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" ON public.achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update existing questions with conceptual difficulty
UPDATE public.questions 
SET conceptual_difficulty = CASE 
  WHEN difficulty = 'easy' THEN 'beginner'
  WHEN difficulty = 'medium' THEN 'intermediate'
  WHEN difficulty = 'hard' THEN 'advanced'
  ELSE 'intermediate'
END
WHERE conceptual_difficulty IS NULL;
