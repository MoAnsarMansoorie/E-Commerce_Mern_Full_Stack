import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Login from './components/Login';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const isLoggedIn = Boolean(token);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900">
      {isLoggedIn ? (
        <>
          <Navbar setToken={setToken} />
          <div className="flex flex-col xl:flex-row">
            <aside className="w-full xl:w-64 border-t border-slate-200 bg-white xl:border-r xl:border-t-0">
              <Sidebar />
            </aside>
            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-6xl">
                <Routes>
                  <Route path="/" element={<Navigate to="/list" replace />} />
                  <Route path="/add" element={<Add token={token} />} />
                  <Route path="/list" element={<List token={token} />} />
                  <Route path="/orders" element={<Orders token={token} />} />
                  <Route path="*" element={<Navigate to="/list" replace />} />
                </Routes>
              </div>
            </main>
          </div>
        </>
      ) : (
        <Login setToken={setToken} />
      )}
    </div>
  );
}
