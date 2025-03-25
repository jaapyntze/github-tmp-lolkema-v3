import React, { useEffect, useState } from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase, type BlogPost } from '../lib/supabase';

const BlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Could not load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleNavigation = (path: string) => {
    setIsExiting(true);
    setTimeout(() => {
      navigate(path);
    }, 500); // Match the fadeOut animation duration
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Blog</h2>
            <p className="mt-4 text-xl text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isExiting ? 'fade-exit' : 'fade-enter'}`}>
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[400px] bg-green-800">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Agricultural landscape"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
            Onze Blog
          </h1>
          <p className="text-xl sm:text-2xl text-white opacity-90 max-w-3xl">
            Ontdek de laatste ontwikkelingen, innovaties en expertise in de agrarische sector
          </p>
        </div>
      </div>

      {/* Blog Posts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative h-48">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-green-600 text-white text-sm px-3 py-1 rounded-full">
                  {post.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(post.created_at).toLocaleDateString('nl-NL', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-2" />
                  {post.read_time}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                <button
                  onClick={() => handleNavigation(`/blog/${post.slug}`)}
                  className="inline-flex items-center text-green-600 font-medium hover:text-green-700 transition-colors"
                >
                  Lees meer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-500">Er zijn nog geen blog posts beschikbaar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;