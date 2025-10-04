/*
  # Add LinkedIn credentials to user profiles

  1. Changes to existing tables
    - Add LinkedIn-related columns to profiles table:
      - linkedin_user_id (text)
      - linkedin_username (text)
      - linkedin_access_token (text)
      - linkedin_refresh_token (text)
      - linkedin_token_expires_at (timestamptz)

  2. Security
    - Update RLS policies to protect sensitive LinkedIn data
*/

ALTER TABLE profiles
ADD COLUMN linkedin_user_id text,
ADD COLUMN linkedin_username text,
ADD COLUMN linkedin_access_token text,
ADD COLUMN linkedin_refresh_token text,
ADD COLUMN linkedin_token_expires_at timestamptz;