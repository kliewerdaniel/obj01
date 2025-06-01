import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export default function Layout() {
  const [isDark, setIsDark] = useState(() => {
    // Initialize from localStorage or system preference
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 10;
    if (scrolled !== isScrolled) {
      setIsScrolled(scrolled);
    }
  }, [isScrolled]);

  // Setup scroll listener with throttling
  useEffect(() => {
    let timeoutId;
    const throttledHandler = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = null;
      }, 16); // ~60fps
    };

    window.addEventListener('scroll', throttledHandler, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledHandler);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Update meta theme-color for mobile browsers
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', isDark ? '#111827' : '#ffffff');
    }
  }, [isDark]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleTheme = useCallback(() => setIsDark(prev => !prev), []);
  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen(prev => !prev), []);

  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

  // Memoized navigation items
  const navItems = useMemo(() => [
    { path: '/', label: 'Summaries', icon: '📰' },
    { path: '/manage-feeds', label: 'Manage Feeds', icon: '⚙️' }
  ], []);

  const headerClasses = useMemo(() => 
    `sticky top-0 z-50 w-full backdrop-blur-xl border-b transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 dark:bg-gray-900/90 border-gray-200/60 dark:border-gray-700/60 shadow-lg shadow-black/[0.03]' 
        : 'bg-white/80 dark:bg-gray-900/80 border-gray-200/40 dark:border-gray-700/40 shadow-md shadow-black/[0.02]'
    }`, [isScrolled]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 transition-colors duration-500">
      
      {/* Header */}
      <header className={headerClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo/Brand */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative w-9 h-9 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
                <div className="w-5 h-5 bg-white/90 rounded-md flex items-center justify-center">

                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent">
                  Objective Newsfeed
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1 hidden sm:block">
                  Unbiased • Concise • Current
                </p>
              </div>
            </Link>

            {/* Desktop Navigation & Controls */}
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-1">
                {navItems.map(({ path, label, icon }) => (
                  <Link 
                    key={path}
                    to={path} 
                    className={`group flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                      isActive(path) 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm ring-1 ring-blue-200/50 dark:ring-blue-800/50' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/30 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="text-sm opacity-70 group-hover:opacity-100 transition-opacity">
                      {icon}
                    </span>
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>

       

            </div>
          </div>

        
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-gradient-to-r from-white/60 via-white/80 to-white/60 dark:from-gray-900/60 dark:via-gray-900/80 dark:to-gray-900/60 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/30">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 to-purple-50/20 dark:from-blue-900/5 dark:to-purple-900/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span>Stay informed with objective news summaries</span>
            </div>
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-400 dark:text-gray-500">
              <span>Unbiased reporting</span>
              <span>•</span>
              <span>Real-time updates</span>
              <span>•</span>
              <span>Multiple sources</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}