import { supabase } from './supabase';

const TWITTER_CLIENT_ID = import.meta.env.VITE_TWITTER_CLIENT_ID;
const TWITTER_REDIRECT_URI = `${window.location.origin}/settings/twitter/callback`;

if (!TWITTER_CLIENT_ID) {
  throw new Error('Missing Twitter client ID');
}

export async function initiateTwitterAuth() {
  // Generate and store state for CSRF protection
  const state = crypto.randomUUID();
  const challenge = crypto.randomUUID();
  
  // Store state and challenge in session storage for verification
  sessionStorage.setItem('twitter_oauth_state', state);
  sessionStorage.setItem('twitter_oauth_challenge', challenge);

  // Construct Twitter OAuth URL
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: TWITTER_CLIENT_ID,
    redirect_uri: TWITTER_REDIRECT_URI,
    scope: 'tweet.read tweet.write users.read offline.access',
    state: state,
    code_challenge: challenge,
    code_challenge_method: 'plain'
  });

  // Redirect to Twitter OAuth page
  window.location.href = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
}

export async function handleTwitterCallback(code: string, state: string) {
  // Verify state to prevent CSRF attacks
  const storedState = sessionStorage.getItem('twitter_oauth_state');
  const storedChallenge = sessionStorage.getItem('twitter_oauth_challenge');
  
  if (!storedState || !storedChallenge || state !== storedState) {
    throw new Error('Invalid state parameter');
  }

  // Clear stored state and challenge
  sessionStorage.removeItem('twitter_oauth_state');
  sessionStorage.removeItem('twitter_oauth_challenge');

  // Exchange code for tokens using your backend endpoint
  const response = await fetch('/api/twitter/callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      code,
      code_verifier: storedChallenge,
      redirect_uri: TWITTER_REDIRECT_URI
    })
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for tokens');
  }

  const data = await response.json();
  
  // Store tokens in database
  const { error } = await supabase
    .from('profiles')
    .update({
      twitter_user_id: data.user_id,
      twitter_username: data.username,
      twitter_access_token: data.access_token,
      twitter_refresh_token: data.refresh_token,
      twitter_token_expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString()
    })
    .eq('id', supabase.auth.user()?.id);

  if (error) throw error;

  return data;
}