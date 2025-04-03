import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import slugify from 'slugify';
import type { BlogPost } from '../lib/supabase';
import ImageUpload from './ImageUpload';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Save,
  Loader2,
  ArrowLeft
} from 'lucide-react';

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    image_url: '',
    category: '',
    read_time: '',
    published: false,
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Begin hier met het schrijven van uw artikel...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[300px]',
      },
    },
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
              image_url: data.image_url,
              category: data.category,
              read_time: data.read_time,
              published: data.published,
            });
            editor?.commands.setContent(data.content);
          }
        } catch (err) {
          console.error('Error fetching post:', err);
          setError('Could not load post');
        }
      }
    };

    fetchPost();
  }, [id, editor]);

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
    if (!user || !editor) return;

    setLoading(true);
    setError(null);

    try {
      const slug = slugify(formData.title, { lower: true, strict: true });
      const postData = {
        ...formData,
        content: editor.getHTML(),
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

  const addLink = () => {
    const url = window.prompt('URL:');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Image URL:');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  const ToolbarButton = ({ 
    onClick, 
    active = false,
    disabled = false,
    children 
  }: { 
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition-colors ${
        active
          ? 'bg-primary-100 text-primary-800'
          : 'text-secondary-600 hover:bg-secondary-100'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-secondary-50 pt-32 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-secondary-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Terug
            </button>
            <h1 className="text-3xl font-bold text-secondary-900">
              {id ? 'Bewerk Blog Post' : 'Nieuwe Blog Post'}
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-secondary-700">
                Titel
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-secondary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-secondary-700">
                Samenvatting
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                value={formData.excerpt}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-secondary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Content
              </label>
              <div className="border border-secondary-200 rounded-lg overflow-hidden">
                <div className="flex flex-wrap gap-1 p-2 border-b border-secondary-200 bg-secondary-50">
                  <ToolbarButton
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    active={editor?.isActive('bold')}
                    disabled={!editor?.can().chain().focus().toggleBold().run()}
                  >
                    <Bold className="h-5 w-5" />
                  </ToolbarButton>
                  
                  <ToolbarButton
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    active={editor?.isActive('italic')}
                    disabled={!editor?.can().chain().focus().toggleItalic().run()}
                  >
                    <Italic className="h-5 w-5" />
                  </ToolbarButton>

                  <div className="w-px h-6 bg-secondary-200 mx-1 self-center" />

                  <ToolbarButton
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                    active={editor?.isActive('heading', { level: 1 })}
                  >
                    <Heading1 className="h-5 w-5" />
                  </ToolbarButton>

                  <ToolbarButton
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor?.isActive('heading', { level: 2 })}
                  >
                    <Heading2 className="h-5 w-5" />
                  </ToolbarButton>

                  <ToolbarButton
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor?.isActive('heading', { level: 3 })}
                  >
                    <Heading3 className="h-5 w-5" />
                  </ToolbarButton>

                  <div className="w-px h-6 bg-secondary-200 mx-1 self-center" />

                  <ToolbarButton
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    active={editor?.isActive('bulletList')}
                  >
                    <List className="h-5 w-5" />
                  </ToolbarButton>

                  <ToolbarButton
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    active={editor?.isActive('orderedList')}
                  >
                    <ListOrdered className="h-5 w-5" />
                  </ToolbarButton>

                  <ToolbarButton
                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                    active={editor?.isActive('blockquote')}
                  >
                    <Quote className="h-5 w-5" />
                  </ToolbarButton>

                  <div className="w-px h-6 bg-secondary-200 mx-1 self-center" />

                  <ToolbarButton onClick={addLink} active={editor?.isActive('link')}>
                    <LinkIcon className="h-5 w-5" />
                  </ToolbarButton>

                  <ToolbarButton onClick={addImage}>
                    <ImageIcon className="h-5 w-5" />
                  </ToolbarButton>

                  <div className="w-px h-6 bg-secondary-200 mx-1 self-center" />

                  <ToolbarButton
                    onClick={() => editor?.chain().focus().undo().run()}
                    disabled={!editor?.can().chain().focus().undo().run()}
                  >
                    <Undo className="h-5 w-5" />
                  </ToolbarButton>

                  <ToolbarButton
                    onClick={() => editor?.chain().focus().redo().run()}
                    disabled={!editor?.can().chain().focus().redo().run()}
                  >
                    <Redo className="h-5 w-5" />
                  </ToolbarButton>
                </div>

                <EditorContent editor={editor} className="p-4" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Afbeelding
              </label>
              <ImageUpload
                onImageUploaded={handleImageUploaded}
                currentImageUrl={formData.image_url}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-secondary-700">
                Categorie
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-secondary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">Selecteer een categorie</option>
                <option value="Agrarisch">Agrarisch</option>
                <option value="Techniek">Techniek</option>
                <option value="Innovatie">Innovatie</option>
                <option value="Duurzaamheid">Duurzaamheid</option>
              </select>
            </div>

            <div>
              <label htmlFor="read_time" className="block text-sm font-medium text-secondary-700">
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
                className="mt-1 block w-full border-secondary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-secondary-700">
                Publiceren
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-secondary-300 rounded-md shadow-sm text-sm font-medium text-secondary-700 bg-white hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Annuleren
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Opslaan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;