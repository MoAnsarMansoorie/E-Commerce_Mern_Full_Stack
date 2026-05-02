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
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [showSearchModal])

  const handleSubmit = () => {
    if (!search || search.trim().length === 0) return
    const q = `?search=${encodeURIComponent(search)}`
    setShowSearch(true)
    setShowSearchModal(false)
    navigate(`/collection${q}`)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const filteredProducts = search && search.trim().length > 0
    ? (Array.isArray(products) ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) : [])
    : [];

  const handleSelectProduct = (id, name) => {
    setSearch(name);
    setShowSearchModal(false);
    navigate(`/product/${id}`);
  }

  if (!showSearchModal) return null

  return (
    <div className="fixed inset-0 z-50 sm:hidden flex items-start justify-center p-4">
      {/* Background overlay (click to close) */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        style={{backdropFilter: 'blur(6px)'}}
        onClick={() => setShowSearchModal(false)}
      ></div>

      {/* Modal box */}
      <div
        className="relative w-full max-w-md bg-white rounded-lg p-4 z-10 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <img src={assets.search_icon} className="w-4 opacity-70" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for products..."
            className="flex-1 outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-black text-white rounded text-sm"
          >
            Search
          </button>
        </div>

        <div className="mt-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
              {filteredProducts.map((p) => (
                <div
                  key={p._id}
                  onClick={() => handleSelectProduct(p._id, p.name)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" />
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-gray-500">{currency}{p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            search && search.trim().length > 0 && (
              <div className="p-3 text-sm text-gray-500">No products found</div>
            )
          )}
        </div>

        <button
          onClick={() => setShowSearchModal(false)}
          className="absolute top-2 right-2 text-gray-500 text-xl"
          aria-label="Close search"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default SearchModal
