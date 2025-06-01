// components/Layout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* Header */}
      <header className="w-full bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Objective Newsfeed</h1>
          <nav>
            <Link to="/manage-feeds" className="text-blue-600 dark:text-blue-400 hover:underline">
              Manage Feeds
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8">
        <Outlet />
      </main>

    

    </div>
  );
}
