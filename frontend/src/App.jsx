// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Summaries from './pages/Summaries';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Summaries />} />
      </Route>
    </Routes>
  );
}

export default App;
