import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets.js';

const navItems = [
  { to: '/list', label: 'Products', icon: assets.order_icon },
  { to: '/add', label: 'Add Product', icon: assets.add_icon },
  { to: '/orders', label: 'Orders', icon: assets.order_icon },
];

const Sidebar = () => {
  return (
    <nav aria-label="Admin navigation" className="px-4 py-6">
      <div className="mb-8 hidden xl:block">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Admin menu</p>
      </div>

      <div className="flex flex-col gap-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`
            }
          >
            <img className="h-5 w-5" src={item.icon} alt="" aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
