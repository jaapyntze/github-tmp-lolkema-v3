import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Edit } from 'lucide-react';
import { supabase, type BlogPost } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Could not load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleNavigation = (path: string) => {
    setIsExiting(true);
    setTimeout(() => {
      navigate(path);
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-red-600">{error || 'Blog post not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className={`min-h-screen bg-gray-50 pt-32 pb-12 ${isExiting ? 'fade-exit' : 'fade-enter'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-64 sm:h-96">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-green-600 text-white text-sm px-3 py-1 rounded-full">
              {post.category}
            </div>
          </div>
          
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(post.created_at).toLocaleDateString('nl-NL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
                <span className="mx-2">•</span>
                <Clock className="h-4 w-4 mr-2" />
                {post.read_time}
              </div>
              
              {user && user.id === post.author_id && (
                <button
                  onClick={() => handleNavigation(`/blog/editor/${post.id}`)}
                  className="inline-flex items-center text-green-600 hover:text-green-700"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Bewerken
                </button>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            <div className="prose max-w-none">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-600 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPostPage;