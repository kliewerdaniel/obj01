// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Summaries from './pages/Summaries';
import ManageFeeds from './pages/ManageFeeds'; // Import the new component

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Summaries />} />
        <Route path="manage-feeds" element={<ManageFeeds />} /> {/* Add the new route */}
      </Route>
    </Routes>
  );
}

export default App;
