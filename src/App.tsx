import React, { useEffect, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load components
const Hero = React.lazy(() => import('./components/Hero'));
const Services = React.lazy(() => import('./components/Services'));
const About = React.lazy(() => import('./components/About'));
const Gallery = React.lazy(() => import('./components/Gallery'));
const Blog = React.lazy(() => import('./components/Blog'));
const BlogList = React.lazy(() => import('./components/BlogList'));
const Testimonials = React.lazy(() => import('./components/Testimonials'));
const Contact = React.lazy(() => import('./components/Contact'));
const Footer = React.lazy(() => import('./components/Footer'));
const BlogEditor = React.lazy(() => import('./components/BlogEditor'));
const BlogPost = React.lazy(() => import('./components/BlogPost'));
const Login = React.lazy(() => import('./components/Login'));
const Dashboard = React.lazy(() => import('./components/CustomerPortal/Dashboard'));

// Page transition wrapper
function PageTransition({ children }: { children: React.ReactNode }) {
  const [isExiting, setIsExiting] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsExiting(false);
  }, [location]);

  return (
    <div className={`min-h-screen bg-white ${isExiting ? 'fade-exit' : 'fade-enter'}`}>
      {children}
    </div>
  );
}

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    const body = document.body;

    const handleScroll = () => {
      body.classList.add('is-scrolling');
      body.classList.remove('not-scrolling');

      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      scrollTimeout = setTimeout(() => {
        body.classList.remove('is-scrolling');
        body.classList.add('not-scrolling');
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    body.classList.add('not-scrolling');

    // Handle scroll to section if coming from another page
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [location]);

  return (
    <PageTransition>
      <Suspense fallback={<LoadingScreen />}>
        <Hero />
        <Services />
        <About />
        <Gallery />
        <Blog />
        <Testimonials />
        <Contact />
      </Suspense>
    </PageTransition>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen isExiting={isExiting} />;
  }

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-white">
          <Navbar />
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/login"
                element={
                  <PageTransition>
                    <Login redirectPath="/portal" />
                  </PageTransition>
                }
              />
              <Route
                path="/blog"
                element={
                  <PageTransition>
                    <BlogList />
                  </PageTransition>
                }
              />
              <Route
                path="/blog/:slug"
                element={
                  <PageTransition>
                    <BlogPost />
                  </PageTransition>
                }
              />
              <Route
                path="/blog/editor"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <BlogEditor />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/blog/editor/:id"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <BlogEditor />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <Dashboard />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;