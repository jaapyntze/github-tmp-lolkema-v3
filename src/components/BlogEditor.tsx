import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import slugify from 'slugify';
import type { BlogPost } from '../lib/supabase';
import ImageUpload from './ImageUpload';

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    category: '',
    read_time: '',
    published: false,
  });

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          if (data) {
            setFormData({
              title: data.title,
              excerpt: data.excerpt,
              content: data.content,
              image_url: data.image_url,
              category: data.category,
              read_time: data.read_time,
              published: data.published,
            });
          }
        } catch (err) {
          console.error('Error fetching post:', err);
          setError('Could not load post');
        }
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUploaded = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      image_url: url,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const slug = slugify(formData.title, { lower: true, strict: true });
      const postData = {
        ...formData,
        slug,
        author_id: user.id,
      };

      let result;
      if (id) {
        result = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id)
          .select()
          .single();
      } else {
        result = await supabase.from('blog_posts').insert([postData]).select().single();
      }

      if (result.error) throw result.error;
      navigate('/blog/' + slug);
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Could not save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {id ? 'Bewerk Blog Post' : 'Nieuwe Blog Post'}
          </h1>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Titel
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                Samenvatting
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                value={formData.excerpt}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                rows={10}
                value={formData.content}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Afbeelding
              </label>
              <ImageUpload
                onImageUploaded={handleImageUploaded}
                currentImageUrl={formData.image_url}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Categorie
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="">Selecteer een categorie</option>
                <option value="Agrarisch">Agrarisch</option>
                <option value="Techniek">Techniek</option>
                <option value="Innovatie">Innovatie</option>
                <option value="Duurzaamheid">Duurzaamheid</option>
              </select>
            </div>

            <div>
              <label htmlFor="read_time" className="block text-sm font-medium text-gray-700">
                Leestijd
              </label>
              <input
                type="text"
                id="read_time"
                name="read_time"
                value={formData.read_time}
                onChange={handleChange}
                placeholder="bijv. 5 min"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                Publiceren
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Annuleren
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'Bezig met opslaan...' : 'Opslaan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;