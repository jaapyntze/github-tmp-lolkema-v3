import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import slugify from 'slugify';
import ImageUpload from '../ImageUpload';
import toast from 'react-hot-toast';
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
  ArrowLeft,
  Eye
} from 'lucide-react';

interface BlogPostEditorProps {
  postId: string | null;
  onBack: () => void;
}

const BlogPostEditor: React.FC<BlogPostEditorProps> = ({ postId, onBack }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', postId)
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
        toast.error('Kon post niet laden');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, editor]);

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

    setSaving(true);
    try {
      const slug = slugify(formData.title, { lower: true, strict: true });
      const postData = {
        ...formData,
        content: editor.getHTML(),
        slug,
        author_id: user.id,
      };

      let result;
      if (postId) {
        result = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', postId)
          .select()
          .single();
      } else {
        result = await supabase
          .from('blog_posts')
          .insert([postData])
          .select()
          .single();
      }

      if (result.error) throw result.error;
      
      toast.success(postId ? 'Post bijgewerkt' : 'Post aangemaakt');
      onBack();
    } catch (err) {
      console.error('Error saving post:', err);
      toast.error('Kon post niet opslaan');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 text-secondary-600 hover:text-secondary-900"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-secondary-900">
            {postId ? 'Blog Post Bewerken' : 'Nieuwe Blog Post'}
          </h1>
        </div>
        {postId && (
          <a
            href={`/blog/${slugify(formData.title, { lower: true, strict: true })}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-secondary-300 rounded-md shadow-sm text-sm font-medium text-secondary-700 bg-white hover:bg-secondary-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </a>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
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
              className="mt-1 block w-full border-secondary-300 rounded-m shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  disabled={!editor?.can().chain().focus().toggleBold().run()}
                  className={`p-2 rounded-lg transition-colors ${
                    editor?.isActive('bold')
                      ? 'bg-primary-100 text-primary-800'
                      : 'text-secondary-600 hover:bg-secondary-100'
                  }`}
                >
                  <Bold className="h-5 w-5" />
                </button>
                
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  disabled={!editor?.can().chain().focus().toggleItalic().run()}
                  className={`p-2 rounded-lg transition-colors ${
                    editor?.isActive('italic')
                      ? 'bg-primary-100 text-primary-800'
                      : 'text-secondary-600 hover:bg-secondary-100'
                  }`}
                >
                  <Italic className="h-5 w-5" />
                </button>

                <div className="w-px h-6 bg-secondary-200 mx-1 self-center" />

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={`p-2 rounded-lg transition-colors ${
                    editor?.isActive('heading', { level: 1 })
                      ? 'bg-primary-100 text-primary-800'
                      : 'text-secondary-600 hover:bg-secondary-100'
                  }`}
                >
                  <Heading1 className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`p-2 rounded-lg transition-colors ${
                    editor?.isActive('heading', { level: 2 })
                      ? 'bg-primary-100 text-primary-800'
                      : 'text-secondary-600 hover:bg-secondary-100'
                  }`}
                >
                  <Heading2 className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={`p-2 rounded-lg transition-colors ${
                    editor?.isActive('heading', { level: 3 })
                      ? 'bg-primary-100 text-primary-800'
                      : 'text-secondary-600 hover:bg-secondary-100'
                  }`}
                >
                  <Heading3 className="h-5 w-5" />
                </button>

                <div className="w-px h-6 bg-secondary-200 mx-1 self-center" />

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded-lg transition-colors ${
                    editor?.isActive('bulletList')
                      ? 'bg-primary-100 text-primary-800'
                      : 'text-secondary-600 hover:bg-secondary-100'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  className={`p-2 rounded-lg transition-colors ${
                    editor?.isActive('orderedList')
                      ? 'bg-primary-100 text-primary-800'
                      : 'text-secondary-600 hover:bg-secondary-100'
                  }`}
                >
                  <ListOrdered className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                  className={`p-2 rounded-lg transition-colors ${
                    editor?.isActive('blockquote')
                      ? 'bg-primary-100 text-primary-800'
                      : 'text-secondary-600 hover:bg-secondary-100'
                  }`}
                >
                  <Quote className="h-5 w-5" />
                </button>

                <div className="w-px h-6 bg-secondary-200 mx-1 self-center" />

                <button
                  type="button"
                  onClick={addLink}
                  className={`p-2 rounded-lg transition-colors ${
                    editor?.isActive('link')
                      ? 'bg-primary-100 text-primary-800'
                      : 'text-secondary-600 hover:bg-secondary-100'
                  }`}
                >
                  <LinkIcon className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={addImage}
                  className="p-2 rounded-lg text-secondary-600 hover:bg-secondary-100"
                >
                  <ImageIcon className="h-5 w-5" />
                </button>

                <div className="w-px h-6 bg-secondary-200 mx-1 self-center" />

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().undo().run()}
                  disabled={!editor?.can().chain().focus().undo().run()}
                  className="p-2 rounded-lg text-secondary-600 hover:bg-secondary-100 disabled:opacity-50"
                >
                  <Undo className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().redo().run()}
                  disabled={!editor?.can().chain().focus().redo().run()}
                  className="p-2 rounded-lg text-secondary-600 hover:bg-secondary-100 disabled:opacity-50"
                >
                  <Redo className="h-5 w-5" />
                </button>
              </div>

              <EditorContent editor={editor} className="min-h-[400px]" />
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
              onClick={onBack}
              className="px-4 py-2 border border-secondary-300 rounded-md shadow-sm text-sm font-medium text-secondary-700 bg-white hover:bg-secondary-50"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {saving ? (
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
  );
};

export default BlogPostEditor;