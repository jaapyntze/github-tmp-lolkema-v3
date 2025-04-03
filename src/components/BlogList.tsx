import React, { useEffect, useState, useRef } from 'react';
import { Calendar, Clock, ArrowRight, Search, X, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase, type BlogPost } from '../lib/supabase';

const BlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const postsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

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

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data?.map(post => post.category) || []));
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Could not load blog posts');
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
  }, [posts, selectedCategory, searchTerm]); // Re-run when posts are filtered

  const handleNavigation = (path: string) => {
    setIsExiting(true);
    setTimeout(() => {
      navigate(path);
    }, 500);
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-secondary-900 sm:text-4xl">Blog</h2>
            <p className="mt-4 text-xl text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-secondary-50 ${mounted ? 'fade-enter' : 'opacity-0'} ${isExiting ? 'fade-exit' : ''}`}>
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] bg-primary-900">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/blog-images/hero-1024w.jpg"
            srcSet="https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/blog-images/hero-480w.jpg 480w,
                    https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/blog-images/hero-768w.jpg 768w,
                    https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/blog-images/hero-1024w.jpg 1024w,
                    https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/blog-images/hero-1600w.jpg 1600w
            "
            sizes="(max-width: 600px) 480px,
                   (max-width: 1600px) 768px,
                   1600px"
            alt="Kraan op bouwgrond"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50"></div>
          
          {/* Animated glow effects */}
          <div 
            className="absolute bottom-0 right-0 w-[40vw] h-[40vh] bg-primary-500/20 blur-[100px] rounded-full mix-blend-soft-light transform translate-x-1/4 translate-y-1/4"
            style={{ animation: 'pulse 4s ease-in-out infinite' }}
          />
          <div 
            className="absolute top-1/4 left-1/4 w-[30vw] h-[30vh] bg-primary-500/30 blur-[80px] rounded-full mix-blend-soft-light transform -translate-x-1/2 -translate-y-1/2"
            style={{ animation: 'pulse 4s ease-in-out infinite reverse' }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-3xl">
            <div className={`inline-block p-3 bg-white/10 backdrop-blur-sm rounded-lg mb-6 transition-all duration-700 delay-200 transform ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}>
              <BookOpen className="h-8 w-8 sm:h-12 sm:w-12 text-primary-600" />
            </div>
            
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 transition-all duration-700 delay-400 transform ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}>
              Nieuws & Inzichten
            </h1>
            
            <p className={`text-lg sm:text-xl text-white/90 max-w-2xl leading-relaxed transition-all duration-700 delay-600 transform ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}>
              Ontdek de laatste ontwikkelingen en innovaties in de agrarische sector. 
              Van praktische tips tot diepgaande technische inzichten - blijf op de hoogte 
              van alles wat er speelt in de wereld van modern loonwerk.
            </p>

            <div className={`mt-8 transition-all duration-700 delay-800 transform ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}>
              <div className="inline-flex items-center text-white/80">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Regelmatig nieuwe artikelen</span>
                <span className="mx-3">•</span>
                <Clock className="h-5 w-5 mr-2" />
                <span>Actuele onderwerpen</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                Alle artikelen
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Zoek artikelen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-full border border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredPosts.length > 0 ? (
          <div ref={postsRef} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="blog-post bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative h-48">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
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
        ) : (
          <div className="text-center py-12">
            <p className="text-secondary-500">
              {searchTerm
                ? 'Geen artikelen gevonden die aan uw zoekcriteria voldoen.'
                : 'Er zijn nog geen blog posts beschikbaar in deze categorie.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;