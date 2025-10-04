import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader, AlertCircle } from 'lucide-react';
import { handleLinkedInCallback } from '../lib/linkedin';

export function LinkedInCallback() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function handleCallback() {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error || errorDescription) {
          console.error('LinkedIn OAuth error:', { error, errorDescription });
          throw new Error(errorDescription || 'LinkedIn authentication failed');
        }

        if (!code || !state) {
          throw new Error('Missing required authentication parameters');
        }

        await handleLinkedInCallback(code, state);
        navigate('/settings', { 
          state: { message: 'LinkedIn account connected successfully' },
          replace: true 
        });
      } catch (err) {
        console.error('LinkedIn callback error:', err);
        setError(err instanceof Error ? err.message : 'Failed to complete LinkedIn authentication');
      }
    }

    handleCallback();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
        <div style={{ marginBottom: '20px', color: 'red' }}>
          <AlertCircle style={{ display: 'inline-block', marginRight: '8px' }} />
          <span>{error}</span>
        </div>
        <button 
          onClick={() => navigate('/settings')}
          style={{ 
            padding: '8px 16px',
            background: '#0073b1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Return to Settings
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '600px',
      margin: '40px auto',
      textAlign: 'center'
    }}>
      <Loader style={{ 
        animation: 'spin 1s linear infinite',
        display: 'inline-block',
        marginBottom: '16px'
      }} />
      <p>Completing LinkedIn authentication...</p>
    </div>
  );
}