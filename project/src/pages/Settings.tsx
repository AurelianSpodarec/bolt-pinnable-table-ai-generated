import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader, Linkedin } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { initiateLinkedInAuth } from '../lib/linkedin';

interface Profile {
  username: string | null;
  linkedin_username: string | null;
  linkedin_access_token: string | null;
}

interface LocationState {
  message?: string;
}

export function Settings() {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { updateProfile, updatePassword, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, linkedin_username, linkedin_access_token')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
      if (data.username) setUsername(data.username);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setMessage('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.message) {
      setMessage(state.message);
      navigate(location.pathname, { replace: true });
      fetchProfile();
    }
  }, [location, navigate]);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ username });
      setMessage('Profile updated successfully');
    } catch (error) {
      setMessage('Failed to update profile');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePassword(newPassword);
      setMessage('Password updated successfully');
      setNewPassword('');
    } catch (error) {
      setMessage('Failed to update password');
    }
  };

  const handleConnectLinkedIn = async () => {
    try {
      await initiateLinkedInAuth();
    } catch (error) {
      setMessage('Failed to connect to LinkedIn');
    }
  };

  if (loading) {
    return <div><Loader /></div>;
  }

  const isLinkedInConnected = Boolean(profile?.linkedin_access_token);

  return (
    <div>
      <div>
        <button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <h3>Settings</h3>
      </div>
      
      {message && <div>{message}</div>}

      <div>
        <div>
          <h3>Social Media Connections</h3>
          <div>
            <div>
              <Linkedin />
              <div>
                <p>LinkedIn</p>
                {profile?.linkedin_username ? (
                  <p>Connected as {profile.linkedin_username}</p>
                ) : (
                  <p>Not connected</p>
                )}
              </div>
            </div>
            <button onClick={handleConnectLinkedIn}>
              {isLinkedInConnected ? 'Reconnect' : 'Connect'}
            </button>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <button type="submit">Update Profile</button>
        </form>

        <form onSubmit={handleUpdatePassword}>
          <div>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button type="submit">Update Password</button>
        </form>
      </div>
    </div>
  );
}