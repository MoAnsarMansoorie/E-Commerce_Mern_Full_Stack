import React, { useContext, useState, useRef, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchBar = ({ inline = false }) => {
  const { search, setSearch, setShowSearch, products, currency } = useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const blurTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  const handleSearchSubmit = () => {
    const query = search?.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
    if (location.pathname !== '/collection' || location.search !== query) {
      navigate(`/collection${query}`);
    }
    setShowSearch(true);
    setShowDropdown(false);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const filteredProducts = React.useMemo(() => {
    if (!search?.trim() || !Array.isArray(products)) return [];
    return products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [products, search]);

  const handleSelectProduct = (id, name) => {
    setSearch(name);
    setShowDropdown(false);
    navigate(`/product/${id}`);
  };

  const commonInput = (
    <div className='relative w-full'>
      <label htmlFor='global-search' className='sr-only'>Search products</label>
      <div className='flex items-center gap-3 border border-slate-200 rounded-full bg-white px-4 py-2 shadow-sm'>
        <img src={assets.search_icon} alt='' className='w-4 text-slate-400' aria-hidden='true' />
        <input
          id='global-search'
          aria-label='Search products'
          type='text'
          placeholder='Search products...'
          value={search}
          onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
          onKeyDown={onKeyDown}
          onFocus={() => setShowDropdown(Boolean(search?.trim()))}
          onBlur={() => { blurTimeoutRef.current = setTimeout(() => setShowDropdown(false), 150); }}
          className='w-full bg-transparent text-sm outline-none placeholder:text-slate-400 sm:text-base'
        />
        <button
          type='button'
          onClick={handleSearchSubmit}
          className='rounded-full bg-slate-900 px-3 py-2 text-white transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-black'
        >
          Search
        </button>
      </div>
    </div>
  );

  return (
    <div className={`relative ${inline ? 'w-full max-w-[480px]' : 'w-full'}`}>
      {inline ? (
        <div className='relative'>
          <div className='flex items-center gap-3 border border-slate-200 rounded-full bg-white px-4 py-2 shadow-sm'>
            <img src={assets.search_icon} alt='' className='w-4 text-slate-400' aria-hidden='true' />
            <input
              id='global-search-inline'
              aria-label='Search products'
              type='text'
              placeholder='Search products...'
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
              onKeyDown={onKeyDown}
              onFocus={() => setShowDropdown(Boolean(search?.trim()))}
              onBlur={() => { blurTimeoutRef.current = setTimeout(() => setShowDropdown(false), 150); }}
              className='w-full bg-transparent text-sm outline-none placeholder:text-slate-400'
            />
          </div>
          {showDropdown && (
            <div className='absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg'>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <button
                    type='button'
                    key={p._id}
                    onMouseDown={() => handleSelectProduct(p._id, p.name)}
                    className='flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50'
                  >
                    <img src={p.image} alt={p.name} className='h-10 w-10 rounded-md object-cover' />
                    <div>
                      <p>{p.name}</p>
                      <p className='text-xs text-slate-500'>{currency}{p.price}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className='px-4 py-3 text-sm text-slate-500'>No products found</div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className='space-y-2'>
          <div className='flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3'>
            <label htmlFor='global-search' className='sr-only'>Search products</label>
            <input
              id='global-search'
              aria-label='Search products'
              type='text'
              placeholder='Search for products...'
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
              onKeyDown={onKeyDown}
              onFocus={() => setShowDropdown(Boolean(search?.trim()))}
              onBlur={() => { blurTimeoutRef.current = setTimeout(() => setShowDropdown(false), 150); }}
              className='w-full bg-transparent text-sm outline-none placeholder:text-slate-500 sm:text-base'
            />
            <button
              type='button'
              onClick={handleSearchSubmit}
              className='rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-black'
            >
              Search
            </button>
          </div>

          {showDropdown && (
            <div className='absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg'>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <button
                    type='button'
                    key={p._id}
                    onMouseDown={() => handleSelectProduct(p._id, p.name)}
                    className='flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50'
                  >
                    <img src={p.image} alt={p.name} className='h-10 w-10 rounded-md object-cover' />
                    <div>
                      <p>{p.name}</p>
                      <p className='text-xs text-slate-500'>{currency}{p.price}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className='px-4 py-3 text-sm text-slate-500'>No products found</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
