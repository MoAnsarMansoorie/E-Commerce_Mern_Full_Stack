import React from 'react';
import { assets } from '../assets/assets.js';

const Navbar = ({ setToken }) => {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center gap-3">
        <img className="h-11 w-11 rounded-2xl" src={assets.logo} alt="Admin dashboard logo" />
        <div>
          <p className="text-sm font-medium text-slate-500">Admin Dashboard</p>
          <h1 className="text-xl font-semibold text-slate-900">Store management</h1>
        </div>
      </div>

      <button
        onClick={() => setToken('')}
        className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;
