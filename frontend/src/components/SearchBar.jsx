import React, { useContext, useState, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchBar = ({ inline = false }) => {
    // This component will handle the search functionality and should work from any page
    const { search, setSearch, setShowSearch, products, currency } = useContext(ShopContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);
    const blurTimeoutRef = useRef(null);

    // Navigate to collection page and include search query so UI can react to URL
    const handleSearchSubmit = () => {
        const q = search ? `?search=${encodeURIComponent(search)}` : '';
        if (location.pathname !== '/collection' || location.search !== q) {
            navigate(`/collection${q}`);
        }
        setShowSearch(true);
        setShowDropdown(false);
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    const filteredProducts = search && search.trim().length > 0
        ? (Array.isArray(products) ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) : [])
        : []; 

    const handleSelectProduct = (id, name) => {
        setSearch(name);
        setShowDropdown(false);
        navigate(`/product/${id}`);
    };

    // Inline (desktop) variant: compact, rounded search field to fit in navbar
    if (inline) {
        return (
            <div className='relative w-full max-w-[480px]'>
                <div className='flex items-center gap-3 border border-gray-200 rounded-full px-6 py-1 bg-white shadow-sm'>
                    <img src={assets.search_icon} className='w-4 opacity-70' />
                    <input
                        aria-label='Search products'
                        type='text'
                        placeholder='Search products...'
                        className='flex-1 outline-none text-sm'
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
                        onKeyDown={onKeyDown}
                        onFocus={() => setShowDropdown(search.trim().length > 0)}
                        onBlur={() => { blurTimeoutRef.current = setTimeout(() => setShowDropdown(false), 150); }}
                    />
                </div>

                {showDropdown && (
                    <div className='absolute left-0 right-0 mt-2 bg-white border rounded shadow max-h-60 overflow-y-auto z-50'>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((p) => (
                                <div
                                    key={p._id}
                                    onMouseDown={() => handleSelectProduct(p._id, p.name)}
                                    className='flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100'
                                >
                                    <img src={p.image} alt={p.name} className='w-10 h-10 object-cover rounded' />
                                    <div>
                                        <p className='text-sm'>{p.name}</p>
                                        <p className='text-xs text-gray-500'>{currency}{p.price}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='p-3 text-sm text-gray-500'>No products found</div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // Default (block) variant used in collection page or standalone placement
    return (
        <div className='relative border-t border-b w-full bg-gray-100'>
            <div className='inline-flex items-center justify-center border border-gray-400 px-6 py-1 rounded-lg'>
                <input
                    type='text'
                    placeholder='Search for products...'
                    className='flex-1 outline-none bg-transparent text-sm sm:text-base'
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
                    onKeyDown={onKeyDown}
                    onFocus={() => setShowDropdown(search.trim().length > 0)}
                    onBlur={() => { blurTimeoutRef.current = setTimeout(() => setShowDropdown(false), 150); }}
                />
                <img
                    className='w-4 cursor-pointer'
                    src={assets.search_icon}
                    alt='Search Icon'
                    onClick={handleSearchSubmit}
                />
            </div>

            {showDropdown && (
                <div className='absolute left-0 right-0 mt-1 bg-white border rounded shadow max-h-60 overflow-y-auto z-50'>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((p) => (
                            <div
                                key={p._id}
                                onMouseDown={() => handleSelectProduct(p._id, p.name)}
                                className='flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100'
                            >
                                <img src={p.image} alt={p.name} className='w-10 h-10 object-cover rounded' />
                                <div>
                                    <p className='text-sm'>{p.name}</p>
                                    <p className='text-xs text-gray-500'>{currency}{p.price}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='p-3 text-sm text-gray-500'>No products found</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchBar;
