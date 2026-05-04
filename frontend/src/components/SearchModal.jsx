import React, { useContext, useEffect, useRef } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const SearchModal = () => {
  const { showSearchModal, setShowSearchModal, search, setSearch, setShowSearch, products, currency } = useContext(ShopContext)
  const navigate = useNavigate()
  const inputRef = useRef(null)

  useEffect(() => {
    if (showSearchModal) {
      const timeout = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(timeout)
    }
  }, [showSearchModal])

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') setShowSearchModal(false)
    }
    if (showSearchModal) {
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [showSearchModal, setShowSearchModal])

  const handleSubmit = () => {
    if (!search || search.trim().length === 0) return
    const q = `?search=${encodeURIComponent(search.trim())}`
    setShowSearch(true)
    setShowSearchModal(false)
    navigate(`/collection${q}`)
  }

  const filteredProducts = search && search.trim().length > 0
    ? (Array.isArray(products) ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) : [])
    : [];

  const handleSelectProduct = (id, name) => {
    setSearch(name)
    setShowSearchModal(false)
    navigate(`/product/${id}`)
  }

  if (!showSearchModal) return null

  return (
    <div className="fixed inset-0 z-50 sm:hidden flex items-start justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        style={{ backdropFilter: 'blur(6px)' }}
        onClick={() => setShowSearchModal(false)}
        aria-hidden='true'
      />

      <div
        role='dialog'
        aria-modal='true'
        aria-label='Search for products'
        className='relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white p-5 shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center gap-3'>
          <img src={assets.search_icon} alt='' className='w-4 opacity-70' aria-hidden='true' />
          <label htmlFor='mobile-search' className='sr-only'>Search for products</label>
          <input
            id='mobile-search'
            ref={inputRef}
            type='text'
            placeholder='Search for products...'
            className='flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button
            type='button'
            onClick={handleSubmit}
            className='rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-black'
          >
            Search
          </button>
        </div>

        <div className='mt-4 max-h-60 space-y-3 overflow-y-auto'>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <button
                key={p._id}
                type='button'
                onClick={() => handleSelectProduct(p._id, p.name)}
                className='flex w-full items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-slate-300 hover:bg-slate-100'
              >
                <img src={p.image} alt={p.name} className='h-12 w-12 rounded-xl object-cover' />
                <div>
                  <p className='font-medium text-slate-900'>{p.name}</p>
                  <p className='text-xs text-slate-500'>{currency}{p.price}</p>
                </div>
              </button>
            ))
          ) : (
            search && search.trim().length > 0 ? (
              <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500'>No products found</div>
            ) : (
              <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500'>Start typing to search products</div>
            )
          )}
        </div>

        <button
          type='button'
          onClick={() => setShowSearchModal(false)}
          className='absolute right-4 top-4 text-xl text-slate-500 transition hover:text-slate-900'
          aria-label='Close search dialog'
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default SearchModal
