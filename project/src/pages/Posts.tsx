import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Post {
  id: string;
  content: string;
  status: string;
  created_at: string;
}

export function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [postingToLinkedIn, setPostingToLinkedIn] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleShareToLinkedIn = async (postId: string, content: string) => {
    try {
      setPostingToLinkedIn(postId);
      setError('');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('linkedin_access_token')
        .eq('id', user.id)
        .single();

      if (profileError || !profile?.linkedin_access_token) {
        throw new Error('LinkedIn not connected. Please connect your LinkedIn account in Settings.');
      }

      const { error } = await supabase.functions.invoke('post-to-linkedin', {
        body: { 
          content,
          access_token: profile.linkedin_access_token
        }
      });

      if (error) throw error;

      await supabase
        .from('posts')
        .update({ status: 'posted' })
        .eq('id', postId);

      await fetchPosts();
      setError('Post shared to LinkedIn successfully!');
    } catch (err) {
      console.error('Error sharing to LinkedIn:', err);
      setError(err instanceof Error ? err.message : 'Failed to share to LinkedIn');
    } finally {
      setPostingToLinkedIn(null);
    }
  };

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1>Posts</h1>
        <button onClick={() => navigate('/posts/create')}>
          <Plus />
          New Post
        </button>
      </div>

      {error && (
        <div>
          {error}
        </div>
      )}

      <div>
        {posts.length === 0 ? (
          <div>
            No posts yet. Create your first post!
          </div>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <div>
                  <div>
                    <p>{post.content}</p>
                    <div>
                      <span>Created {new Date(post.created_at).toLocaleDateString()}</span>
                      <span>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  {post.status === 'draft' && (
                    <button
                      onClick={() => handleShareToLinkedIn(post.id, post.content)}
                      disabled={postingToLinkedIn === post.id}
                    >
                      {postingToLinkedIn === post.id ? (
                        <Loader />
                      ) : (
                        <Share2 />
                      )}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}