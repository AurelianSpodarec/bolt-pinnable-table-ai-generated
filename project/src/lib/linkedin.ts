import { supabase } from './supabase';

const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
const LINKEDIN_REDIRECT_URI = 'https://sunny-chaja-62d600.netlify.app/settings/linkedin/callback';

if (!LINKEDIN_CLIENT_ID) {
  throw new Error('Missing LinkedIn client ID');
}

export async function initiateLinkedInAuth() {
  // Generate and store state for CSRF protection
  const state = crypto.randomUUID();
  
  // Store state in session storage for verification
  sessionStorage.setItem('linkedin_oauth_state', state);

  // Construct LinkedIn OAuth URL with correct scopes for posting
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: LINKEDIN_REDIRECT_URI,
    state: state,
    scope: 'openid profile email w_member_social r_liteprofile r_emailaddress', // Added required scopes
  });

  // Redirect to LinkedIn OAuth page
  window.location.href = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}

export async function handleLinkedInCallback(code: string, state: string) {
  try {
    // Verify state to prevent CSRF attacks
    const storedState = sessionStorage.getItem('linkedin_oauth_state');
    
    if (!storedState || state !== storedState) {
      throw new Error('Invalid state parameter');
    }

    // Clear stored state
    sessionStorage.removeItem('linkedin_oauth_state');

    console.log('Calling Edge Function...');
    const { data, error } = await supabase.functions.invoke('handle-linkedin-callback', {
      body: {
        code,
        redirect_uri: LINKEDIN_REDIRECT_URI
      }
    });

    if (error) {
      console.error('LinkedIn callback error:', error);
      throw error;
    }

    if (!data?.userInfo) {
      throw new Error('Failed to get LinkedIn profile information');
    }

    console.log('Updating profile...');
    // Store tokens and user info in database
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        linkedin_user_id: data.userInfo.sub,
        linkedin_username: `${data.userInfo.given_name} ${data.userInfo.family_name}`,
        linkedin_access_token: data.tokens.access_token,
        linkedin_token_expires_at: new Date(Date.now() + data.tokens.expires_in * 1000).toISOString()
      })
      .eq('id', (await supabase.auth.getUser()).data.user?.id);

    if (updateError) {
      console.error('Profile update error:', updateError);
      throw updateError;
    }

    console.log('LinkedIn connection completed successfully');
    return data;
  } catch (err) {
    console.error('Error in handleLinkedInCallback:', err);
    throw err;
  }
}