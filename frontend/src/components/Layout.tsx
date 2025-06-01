import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Moon, Sun, ChartPieIcon, Globe } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'News', icon: ChartPieIcon },
  { path: '/manage-feeds', label: 'Sources', icon: Globe }
];

export default function Layout() {
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <nav className="max-w-5xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="font-bold text-xl text-gray-900 dark:text-white">
              Objective Newsfeed
            </Link>

            <div className="flex items-center gap-6">
              {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-md
                    ${location.pathname === path
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
