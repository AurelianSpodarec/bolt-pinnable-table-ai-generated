import { createClient } from 'jsr:@supabase/supabase-js@2.45.6'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://sunny-chaja-62d600.netlify.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Credentials': 'true'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { content, access_token } = await req.json();

    if (!content || !access_token) {
      throw new Error('Missing required parameters');
    }

    // Get user's LinkedIn profile using OpenID Connect userinfo endpoint
    const userInfoResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      const error = await userInfoResponse.text();
      console.error('LinkedIn userinfo error:', error);
      throw new Error('Failed to fetch user info');
    }

    const userInfo = await userInfoResponse.json();

    // Create a post using the REST API with the correct structure
    const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify({
        author: `urn:li:person:${userInfo.sub}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      })
    });

    if (!postResponse.ok) {
      const error = await postResponse.text();
      console.error('LinkedIn post error:', error);
      throw new Error('Failed to create post on LinkedIn');
    }

    const result = await postResponse.json();

    return new Response(
      JSON.stringify({ success: true, post: result }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Error in post-to-linkedin:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: error
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
});