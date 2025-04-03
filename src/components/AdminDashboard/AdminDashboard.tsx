import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PenSquare, List, LogOut, Menu, X } from 'lucide-react';
import BlogPostList from './BlogPostList';
import BlogPostEditor from './BlogPostEditor';
import { Toaster } from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'list' | 'editor'>('list');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = () => {
      if (!user) return;

      try {
        // Check if user has admin role in app_metadata
        const metadata = user.app_metadata;
        setIsAdmin(metadata?.role === 'admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">Toegang geweigerd</h2>
          <p className="text-secondary-600 mb-6">
            U heeft geen toegang tot het admin dashboard.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Terug naar home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <Toaster position="top-right" />
      
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-secondary-200 fixed top-0 left-0 right-0 z-50">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/logo-black.png"
              alt="Logo"
              className="h-8 w-auto"
            />
            <span className="ml-3 text-lg font-semibold text-secondary-900">
              Admin Dashboard
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-secondary-600 hover:bg-secondary-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-secondary-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              <button
                onClick={() => {
                  setActiveView('list');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeView === 'list'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-secondary-600 hover:bg-secondary-50'
                }`}
              >
                <List className="h-5 w-5 mr-2" />
                Blog Posts
              </button>
              <button
                onClick={() => {
                  setActiveView('editor');
                  setSelectedPostId(null);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeView === 'editor' && !selectedPostId
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-secondary-600 hover:bg-secondary-50'
                }`}
              >
                <PenSquare className="h-5 w-5 mr-2" />
                Nieuwe Post
              </button>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Uitloggen
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="lg:flex min-h-screen">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-secondary-200">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-secondary-200">
              <img
                src="https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/logo-black.png"
                alt="Logo"
                className="h-8 w-auto"
              />
              <span className="ml-3 text-lg font-semibold text-secondary-900">
                Admin Dashboard
              </span>
            </div>
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-4 space-y-1">
                <button
                  onClick={() => setActiveView('list')}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    activeView === 'list'
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-secondary-600 hover:bg-secondary-50'
                  }`}
                >
                  <List className="h-5 w-5 mr-2" />
                  Blog Posts
                </button>
                <button
                  onClick={() => {
                    setActiveView('editor');
                    setSelectedPostId(null);
                  }}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    activeView === 'editor' && !selectedPostId
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-secondary-600 hover:bg-secondary-50'
                  }`}
                >
                  <PenSquare className="h-5 w-5 mr-2" />
                  Nieuwe Post
                </button>
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-secondary-200 p-4">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Uitloggen
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          <main className="flex-1 bg-secondary-50">
            {/* Add padding-top for mobile header */}
            <div className="py-6 lg:py-6 mt-[72px] lg:mt-0 min-h-screen">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {activeView === 'list' ? (
                  <BlogPostList
                    onEditPost={(id) => {
                      setSelectedPostId(id);
                      setActiveView('editor');
                    }}
                  />
                ) : (
                  <BlogPostEditor
                    postId={selectedPostId}
                    onBack={() => {
                      setSelectedPostId(null);
                      setActiveView('list');
                    }}
                  />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;