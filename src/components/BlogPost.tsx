import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { supabase, type BlogPost } from '../lib/supabase';

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
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

        // Fetch related posts from the same category
        if (data) {
          const { data: related, error: relatedError } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('published', true)
            .eq('category', data.category)
            .neq('id', data.id)
            .order('created_at', { ascending: false })
            .limit(2);

          if (relatedError) throw relatedError;
          setRelatedPosts(related || []);
        }
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-secondary-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-red-600">{error || 'Blog post not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className={`min-h-screen bg-secondary-50 pt-32 pb-12 ${isExiting ? 'fade-exit' : 'fade-enter'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => handleNavigation('/blog')}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8 group transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
          Terug naar alle artikelen
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-64 sm:h-96">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-primary-600 text-white text-sm px-3 py-1 rounded-full">
              {post.category}
            </div>
          </div>
          
          <div className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <div className="flex items-center text-sm text-secondary-500">
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
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
              {post.title}
            </h1>
            
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">
              Gerelateerde artikelen
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {relatedPosts.map((relatedPost) => (
                <article
                  key={relatedPost.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <img
                      src={relatedPost.image_url}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-primary-600 text-white text-sm px-3 py-1 rounded-full">
                      {relatedPost.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center text-xs text-secondary-500 mb-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(relatedPost.created_at).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                    <h3 className="text-lg font-bold text-secondary-900 mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-secondary-600 mb-4 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <button
                      onClick={() => {
                        setIsExiting(true);
                        setTimeout(() => {
                          navigate(`/blog/${relatedPost.slug}`);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          setIsExiting(false);
                        }, 300);
                      }}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Lees meer
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default BlogPostPage;