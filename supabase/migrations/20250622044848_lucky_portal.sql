/*
  # Create circle memberships table

  1. New Tables
    - `truly_circle_memberships`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `circle_id` (text, identifies which circle)
      - `joined_at` (timestamp)
      - Unique constraint on user_id + circle_id

  2. Security
    - Enable RLS on `truly_circle_memberships` table
    - Add policies for users to manage their own memberships

  3. Performance
    - Add indexes for efficient querying
*/

-- Create the circle memberships table
CREATE TABLE IF NOT EXISTS truly_circle_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  circle_id text NOT NULL,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(user_id, circle_id)
);

-- Enable RLS
ALTER TABLE truly_circle_memberships ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_truly_circle_memberships_user_id 
  ON truly_circle_memberships(user_id);

CREATE INDEX IF NOT EXISTS idx_truly_circle_memberships_circle_id 
  ON truly_circle_memberships(circle_id);

-- Create policies
CREATE POLICY "Users can read own circle memberships"
  ON truly_circle_memberships
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own circle memberships"
  ON truly_circle_memberships
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own circle memberships"
  ON truly_circle_memberships
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);