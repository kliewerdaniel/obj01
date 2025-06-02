import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', label: 'News', icon: '📰' },
  { path: '/manage-feeds', label: 'Sources', icon: '⚙️' }
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <nav className="max-w-5xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
         

            {/* Navigation */}
            <div className="flex items-center">
              <div className="flex items-center bg-gray-100/50 dark:bg-gray-700/50 rounded-full p-1 backdrop-blur-sm">
                {NAV_ITEMS.map(({ path, label, icon }) => {
                  const isActive = location.pathname === path;
                  return (
                    <Link
                      key={path}
                      to={path}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out
                        ${isActive
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg transform scale-105'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white hover:scale-102'
                        }`}
                    >
                      <span>{label}</span>
                      {isActive && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 -z-10" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="animate-in fade-in duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
}