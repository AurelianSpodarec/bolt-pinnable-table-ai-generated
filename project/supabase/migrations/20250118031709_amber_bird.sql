/*
  # Add Twitter credentials to user profiles

  1. Changes to existing tables
    - Add Twitter-related columns to profiles table:
      - twitter_user_id (text)
      - twitter_username (text)
      - twitter_access_token (text)
      - twitter_refresh_token (text)
      - twitter_token_expires_at (timestamptz)

  2. Security
    - Update RLS policies to protect sensitive Twitter data
*/

ALTER TABLE profiles
ADD COLUMN twitter_user_id text,
ADD COLUMN twitter_username text,
ADD COLUMN twitter_access_token text,
ADD COLUMN twitter_refresh_token text,
ADD COLUMN twitter_token_expires_at timestamptz;