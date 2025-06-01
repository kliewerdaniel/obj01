// components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="p-4 bg-white shadow">Header Content</header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}