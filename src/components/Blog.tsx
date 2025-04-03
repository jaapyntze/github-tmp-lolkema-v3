import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase, type BlogPost } from '../lib/supabase';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();
  const postsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(3);

        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const postElements = document.querySelectorAll('.blog-post');
    postElements.forEach((post) => observer.observe(post));

    return () => {
      postElements.forEach((post) => observer.unobserve(post));
    };
  }, [posts]);

  const handleNavigation = (path: string) => {
    setIsExiting(true);
    setTimeout(() => {
      navigate(path);
    }, 500);
  };

  if (loading) {
    return (
      <section id="blog" className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-secondary-900 sm:text-4xl">
              Laatste Nieuws & Inzichten
            </h2>
            <div className="mt-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section id="blog" className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-secondary-900 sm:text-4xl">
              Laatste Nieuws & Inzichten
            </h2>
            <p className="mt-4 text-secondary-500">
              Er zijn nog geen blog posts beschikbaar.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className={`py-20 bg-secondary-50 ${isExiting ? 'fade-exit' : 'fade-enter'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-secondary-900 sm:text-4xl">
            Laatste Nieuws & Inzichten
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-secondary-500">
            Blijf op de hoogte van de laatste ontwikkelingen en expertise in de agrarische sector.
          </p>
        </div>

        <div ref={postsRef} className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="blog-post bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative h-48 bg-secondary-200">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/hero-poster.jpg';
                  }}
                />
                <div className="absolute top-4 right-4 bg-primary-600 text-white text-sm px-3 py-1 rounded-full">
                  {post.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-secondary-500 mb-4">
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
                <h3 className="text-xl font-bold text-secondary-900 mb-2">
                  {post.title}
                </h3>
                <p className="text-secondary-600 mb-4">
                  {post.excerpt}
                </p>
                <button
                  onClick={() => handleNavigation(`/blog/${post.slug}`)}
                  className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors"
                >
                  Lees meer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => handleNavigation('/blog')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            Bekijk alle artikelen
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Blog;