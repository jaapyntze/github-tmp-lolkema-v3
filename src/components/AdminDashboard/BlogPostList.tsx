import React, { useEffect, useState, useRef } from 'react';
import { supabase, type BlogPost } from '../../lib/supabase';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { 
  Download, 
  FileText, 
  Loader2, 
  Search, 
  X, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  ChevronDown,
  ArrowUpDown,
  Calendar,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

interface BlogPostListProps {
  onEditPost: (id: string) => void;
}

type SortField = 'title' | 'created_at' | 'status';
type SortOrder = 'asc' | 'desc';

const BlogPostList: React.FC<BlogPostListProps> = ({ onEditPost }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const POSTS_PER_PAGE = 12;

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loadingMore) {
        loadMorePosts();
      }
    }, options);

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order(sortField, { ascending: sortOrder === 'asc' })
        .range(0, POSTS_PER_PAGE - 1);

      if (error) throw error;
      setPosts(data || []);

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data?.map(post => post.category) || []));
      setCategories(uniqueCategories);
      
      // Check if there are more posts
      const { count } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });
      
      setHasMore((count || 0) > POSTS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Er is een fout opgetreden bij het ophalen van de posts');
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order(sortField, { ascending: sortOrder === 'asc' })
        .range(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE - 1);

      if (error) throw error;

      if (data.length < POSTS_PER_PAGE) {
        setHasMore(false);
      }

      setPosts(prev => [...prev, ...data]);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more posts:', error);
      toast.error('Er is een fout opgetreden bij het laden van meer posts');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    
    // Reset pagination
    setPage(1);
    setHasMore(true);
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPosts(posts.filter(post => post.id !== id));
      toast.success('Post succesvol verwijderd');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Er is een fout opgetreden bij het verwijderen van de post');
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const SortButton = ({ field, label }: { field: SortField, label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-secondary-500 hover:text-secondary-700"
    >
      <span>{label}</span>
      <ArrowUpDown className={`h-4 w-4 ${sortField === field ? 'text-primary-600' : ''}`} />
    </button>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-secondary-400" />
        <h3 className="mt-2 text-sm font-medium text-secondary-900">Geen blog posts</h3>
        <p className="mt-1 text-sm text-secondary-500">Er zijn nog geen blog posts beschikbaar.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-secondary-900">Blog Posts</h2>
        <p className="mt-1 text-sm text-secondary-500">
          Beheer en bewerk je blog posts
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Filters */}
        <div className="p-4 border-b border-secondary-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Zoek posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">Alle categorieën</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="p-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg border border-secondary-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        post.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {post.published ? 'Gepubliceerd' : 'Concept'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-sm text-secondary-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center text-sm text-secondary-500 mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {format(new Date(post.created_at), 'd MMMM yyyy', { locale: nl })}
                    </span>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{post.read_time}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                    
                    <div className="flex space-x-2">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-secondary-600 hover:text-secondary-900 transition-colors"
                      >
                        <Eye className="h-5 w-5" />
                      </a>
                      <button
                        onClick={() => onEditPost(post.id)}
                        className="p-2 text-primary-600 hover:text-primary-900 transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(post.id)}
                        className="p-2 text-red-600 hover:text-red-900 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Trigger */}
          {hasMore && (
            <div
              ref={loadMoreRef}
              className="flex justify-center mt-8"
            >
              {loadingMore ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              ) : (
                <ChevronDown className="h-8 w-8 text-secondary-400 animate-bounce" />
              )}
            </div>
          )}

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-secondary-500">
                {searchTerm
                  ? 'Geen posts gevonden die aan uw zoekcriteria voldoen.'
                  : 'Er zijn nog geen blog posts.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-secondary-900 mb-4">
              Post verwijderen
            </h3>
            <p className="text-secondary-500 mb-6">
              Weet u zeker dat u deze post wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-secondary-300 rounded-md text-secondary-700 hover:bg-secondary-50"
              >
                Annuleren
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Verwijderen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPostList;