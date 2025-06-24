/*
  # Create truly_circles_messages table

  1. New Tables
    - `truly_circles_messages`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users, nullable for anonymous)
      - `circle_id` (text, identifies which circle the message belongs to)
      - `message` (text, the message content)
      - `display_name` (text, anonymous display name)
      - `reactions` (jsonb, array of reaction emojis)
      - `replies` (jsonb, array of reply objects)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `truly_circles_messages` table
    - Add policies for authenticated users to read all messages
    - Add policies for authenticated users to insert messages (own or anonymous)
    - Add policies for users to update/delete only their own messages

  3. Performance
    - Add indexes on circle_id and created_at for efficient querying
*/

-- Create the table if it doesn't exist
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

-- Enable RLS
ALTER TABLE truly_circles_messages ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_truly_circles_messages_circle_id 
  ON truly_circles_messages(circle_id);

CREATE INDEX IF NOT EXISTS idx_truly_circles_messages_created_at 
  ON truly_circles_messages(created_at DESC);

-- Drop existing policies if they exist, then recreate them
DO $$ 
BEGIN
  -- Drop policies if they exist
  DROP POLICY IF EXISTS "Anyone can read circle messages" ON truly_circles_messages;
  DROP POLICY IF EXISTS "Authenticated users can insert circle messages" ON truly_circles_messages;
  DROP POLICY IF EXISTS "Users can update own circle messages" ON truly_circles_messages;
  DROP POLICY IF EXISTS "Users can delete own circle messages" ON truly_circles_messages;
  
  -- Create new policies
  CREATE POLICY "Anyone can read circle messages"
    ON truly_circles_messages
    FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Authenticated users can insert circle messages"
    ON truly_circles_messages
    FOR INSERT
    TO authenticated
    WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL));

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
END $$;