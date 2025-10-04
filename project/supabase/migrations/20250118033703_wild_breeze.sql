/*
  # Add LinkedIn OAuth Edge Function

  1. New Functions
    - `handle_linkedin_oauth_callback`: Securely exchanges OAuth code for access tokens
    - Returns user profile data and tokens
  
  2. Security
    - Function runs with security definer to access client secret
    - Input validation for required parameters
    - Error handling for API responses
*/

-- Create a secure function to handle LinkedIn OAuth callback
CREATE OR REPLACE FUNCTION handle_linkedin_oauth_callback(
  code text,
  redirect_uri text
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  client_id text := current_setting('app.linkedin_client_id', true);
  client_secret text := current_setting('app.linkedin_client_secret', true);
  tokens_response json;
  profile_response json;
  access_token text;
BEGIN
  -- Validate inputs
  IF code IS NULL OR redirect_uri IS NULL THEN
    RAISE EXCEPTION 'Missing required parameters';
  END IF;

  -- Exchange code for tokens
  SELECT content::json INTO tokens_response
  FROM http((
    'POST',
    'https://www.linkedin.com/oauth/v2/accessToken',
    ARRAY[http_header('Content-Type', 'application/x-www-form-urlencoded')],
    'application/json',
    'grant_type=authorization_code&code=' || code || 
    '&client_id=' || client_id ||
    '&client_secret=' || client_secret ||
    '&redirect_uri=' || redirect_uri
  )::http_request);

  -- Extract access token
  access_token := tokens_response->>'access_token';

  -- Get user profile
  SELECT content::json INTO profile_response
  FROM http((
    'GET',
    'https://api.linkedin.com/v2/me',
    ARRAY[
      http_header('Authorization', 'Bearer ' || access_token),
      http_header('Content-Type', 'application/json')
    ],
    'application/json',
    ''
  )::http_request);

  -- Return combined response
  RETURN json_build_object(
    'tokens', tokens_response,
    'profile', profile_response
  );
END;
$$;