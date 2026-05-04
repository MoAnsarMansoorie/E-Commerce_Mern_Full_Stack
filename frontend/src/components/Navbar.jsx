import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets.js';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';
import SearchBar from './SearchBar.jsx';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  const { setShowSearchModal, getCartCount, navigate, token, setToken, setCartItems } =
    useContext(ShopContext);

  const logoutHandler = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 sm:px-8">
          <Link to="/" className="flex items-center gap-3 text-sm font-semibold text-slate-900" aria-label="Go to home">
            <img src={assets.logo} alt="Quick logo" className="w-14" />
            <span className="hidden sm:inline">Quick Shop</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6 text-sm" aria-label="Primary navigation">
            <NavLink to='/' className={({ isActive }) => `rounded-md px-2 py-1 transition ${isActive ? 'font-semibold text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}>
              Home
            </NavLink>
            <NavLink to='/collection' className={({ isActive }) => `rounded-md px-2 py-1 transition ${isActive ? 'font-semibold text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}>
              Collection
            </NavLink>
            <NavLink to='/about' className={({ isActive }) => `rounded-md px-2 py-1 transition ${isActive ? 'font-semibold text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}>
              About
            </NavLink>
            <NavLink to='/contact' className={({ isActive }) => `rounded-md px-2 py-1 transition ${isActive ? 'font-semibold text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}>
              Contact
            </NavLink>
          </nav>

          <div className='hidden sm:flex flex-1 justify-center px-4'>
            <SearchBar inline />
          </div>

          <div className='flex items-center gap-3'>
            <button
              type='button'
              onClick={() => setShowSearchModal(true)}
              className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-black sm:hidden'
              aria-label='Open search'
            >
              <img src={assets.search_icon} alt="Search icon" className="w-4" />
            </button>

            <div className='relative' onMouseLeave={() => setProfileOpen(false)}>
              <button
                type='button'
                onClick={() => {
                  if (!token) {
                    navigate('/login');
                    return;
                  }
                  setProfileOpen((open) => !open);
                }}
                aria-expanded={profileOpen}
                className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-black'
                aria-label={token ? 'Open account menu' : 'Go to login'}
              >
                <img src={assets.profile_icon} alt='Profile icon' className='w-5' />
              </button>

              {token && (
                <div className={`absolute right-0 top-full mt-2 min-w-[180px] rounded-xl border border-slate-200 bg-white p-3 shadow-lg ${profileOpen ? 'block' : 'hidden'}`}>
                  <button
                    type='button'
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/orders');
                    }}
                    className='w-full text-left rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50'
                  >
                    Orders
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setProfileOpen(false);
                      logoutHandler();
                    }}
                    className='w-full text-left rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50'
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            <button
              type='button'
              onClick={() => (token ? navigate('/cart') : navigate('/login'))}
              aria-label='Open cart'
              className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-black ${location.pathname === '/cart' ? 'ring-2 ring-slate-900' : ''}`}
            >
              <img src={assets.cart_icon} alt='Cart icon' className='w-5' />
              <span className='absolute -right-1 -bottom-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-slate-900 px-1.5 text-[10px] font-semibold text-white'>
                {getCartCount()}
              </span>
            </button>

            <button
              type='button'
              onClick={() => setVisible((v) => !v)}
              className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-black sm:hidden'
              aria-label='Toggle menu'
              aria-expanded={visible}
            >
              <img src={assets.menu_icon} alt='Menu icon' className='w-5' />
            </button>
          </div>
        </div>

        <div
          className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          aria-hidden={!visible}
          onClick={() => setVisible(false)}
        />

        <div
          className={`fixed right-0 top-0 z-50 h-full w-full max-w-xs overflow-auto bg-white px-4 py-6 shadow-2xl transition-transform duration-300 sm:hidden ${visible ? 'translate-x-0' : 'translate-x-full'}`}
          role='dialog'
          aria-modal='true'
          aria-label='Mobile navigation'
        >
          <div className='mb-6 flex items-center justify-between'>
            <p className='text-lg font-semibold text-slate-900'>Menu</p>
            <button type='button' onClick={() => setVisible(false)} className='rounded-full p-2 text-slate-700 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-black'>
              <span className='sr-only'>Close menu</span>
              <img src={assets.dropdown_icon} alt='Close icon' className='h-4 w-4 rotate-180' />
            </button>
          </div>

          <nav className='flex flex-col gap-3 text-slate-800'>
            <NavLink onClick={() => setVisible(false)} to='/' className={({ isActive }) => `rounded-xl px-4 py-3 transition ${isActive ? 'bg-slate-100 font-semibold' : 'hover:bg-slate-50'}`}>
              Home
            </NavLink>
            <NavLink onClick={() => setVisible(false)} to='/collection' className={({ isActive }) => `rounded-xl px-4 py-3 transition ${isActive ? 'bg-slate-100 font-semibold' : 'hover:bg-slate-50'}`}>
              Collection
            </NavLink>
            <NavLink onClick={() => setVisible(false)} to='/about' className={({ isActive }) => `rounded-xl px-4 py-3 transition ${isActive ? 'bg-slate-100 font-semibold' : 'hover:bg-slate-50'}`}>
              About
            </NavLink>
            <NavLink onClick={() => setVisible(false)} to='/contact' className={({ isActive }) => `rounded-xl px-4 py-3 transition ${isActive ? 'bg-slate-100 font-semibold' : 'hover:bg-slate-50'}`}>
              Contact
            </NavLink>
          </nav>
        </div>
      </div>

      <div className='h-[72px] sm:h-[88px]' />
    </>
  );
};

export default Navbar;
