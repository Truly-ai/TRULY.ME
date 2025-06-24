/*
  # Create TRULY application tables

  1. New Tables
    - `heartprint_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `mood` (text)
      - `energy_level` (integer)
      - `reflection` (text)
      - `created_at` (timestamp)
    
    - `sacred_journal_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `content` (text)
      - `emotion` (text)
      - `emotion_icon` (text)
      - `created_at` (timestamp)
    
    - `truly_circles_messages`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users, nullable for anonymous)
      - `circle_id` (text)
      - `message` (text)
      - `display_name` (text)
      - `reactions` (jsonb)
      - `replies` (jsonb)
      - `created_at` (timestamp)
    
    - `truly_origin_feedback`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users, nullable for anonymous)
      - `message` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Allow anonymous submissions for circles and feedback where appropriate
*/

-- Heartprint entries table
CREATE TABLE IF NOT EXISTS heartprint_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  mood text,
  energy_level integer DEFAULT 3,
  reflection text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Sacred journal entries table
CREATE TABLE IF NOT EXISTS sacred_journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  emotion text,
  emotion_icon text,
  created_at timestamptz DEFAULT now()
);

-- Truly circles messages table
CREATE TABLE IF NOT EXISTS truly_circles_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  circle_id text NOT NULL,
  message text NOT NULL,
  display_name text NOT NULL,
  reactions jsonb DEFAULT '[]'::jsonb,
  replies jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Truly origin feedback table
CREATE TABLE IF NOT EXISTS truly_origin_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE heartprint_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sacred_journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE truly_circles_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE truly_origin_feedback ENABLE ROW LEVEL SECURITY;

-- Policies for heartprint_entries
CREATE POLICY "Users can read own heartprint entries"
  ON heartprint_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own heartprint entries"
  ON heartprint_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own heartprint entries"
  ON heartprint_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own heartprint entries"
  ON heartprint_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for sacred_journal_entries
CREATE POLICY "Users can read own journal entries"
  ON sacred_journal_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries"
  ON sacred_journal_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries"
  ON sacred_journal_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries"
  ON sacred_journal_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for truly_circles_messages (allow reading all, but users can only manage their own)
CREATE POLICY "Anyone can read circle messages"
  ON truly_circles_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert circle messages"
  ON truly_circles_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own circle messages"
  ON truly_circles_messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own circle messages"
  ON truly_circles_messages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for truly_origin_feedback (allow reading all for community feel)
CREATE POLICY "Anyone can read feedback"
  ON truly_origin_feedback
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert feedback"
  ON truly_origin_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_heartprint_entries_user_id ON heartprint_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_heartprint_entries_created_at ON heartprint_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sacred_journal_entries_user_id ON sacred_journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_sacred_journal_entries_created_at ON sacred_journal_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_truly_circles_messages_circle_id ON truly_circles_messages(circle_id);
CREATE INDEX IF NOT EXISTS idx_truly_circles_messages_created_at ON truly_circles_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_truly_origin_feedback_created_at ON truly_origin_feedback(created_at DESC);