import React, { useContext, useMemo, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'
import { useLocation } from 'react-router-dom'

const CATEGORY_OPTIONS = ['Men', 'Women', 'Kids']
const SUBCATEGORY_OPTIONS = ['Topwear', 'Bottomwear', 'Winterwear']

const Collection = () => {
  const { products = [], search, setSearch } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(true)
  const location = useLocation()
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState('relevant')

  const filteredProducts = useMemo(() => {
    const searchTerm = search?.trim().toLowerCase() || ''
    return products
      .filter((item) => {
        const matchesSearch = searchTerm ? item.name.toLowerCase().includes(searchTerm) : true
        const matchesCategory = category.length ? category.includes(item.category) : true
        const matchesSubCategory = subCategory.length ? subCategory.includes(item.subCategory) : true
        return matchesSearch && matchesCategory && matchesSubCategory
      })
      .sort((a, b) => {
        if (sortType === 'low-high') return a.price - b.price
        if (sortType === 'high-low') return b.price - a.price
        return 0
      })
  }, [products, search, category, subCategory, sortType])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('search') || ''
    if (q !== (search || '')) {
      setSearch(q)
    }
  }, [location.search, search, setSearch])

  const toggleCategory = (value) => {
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    )
  }

  const toggleSubCategory = (value) => {
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    )
  }

  return (
    <div className='grid gap-8 pt-10 border-t border-slate-200 lg:grid-cols-[280px_1fr]'>
      <aside className='space-y-6'>
        <button
          type='button'
          onClick={() => setShowFilter((previous) => !previous)}
          className='flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left font-semibold text-slate-900 shadow-sm transition hover:border-slate-300'
          aria-expanded={showFilter}
        >
          Filters
          <img src={assets.dropdown_icon} alt='Toggle filters' className={`h-3 transition-transform ${showFilter ? 'rotate-90' : ''}`} />
        </button>

        <div className={`${showFilter ? 'block' : 'hidden'} space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm`}
             aria-hidden={!showFilter}>
          <section>
            <h2 className='mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500'>Categories</h2>
            <div className='space-y-3 text-sm text-slate-700'>
              {CATEGORY_OPTIONS.map((option) => (
                <label key={option} className='flex items-center gap-3'>
                  <input
                    type='checkbox'
                    value={option}
                    checked={category.includes(option)}
                    onChange={() => toggleCategory(option)}
                    className='h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900'
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2 className='mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500'>Type</h2>
            <div className='space-y-3 text-sm text-slate-700'>
              {SUBCATEGORY_OPTIONS.map((option) => (
                <label key={option} className='flex items-center gap-3'>
                  <input
                    type='checkbox'
                    value={option}
                    checked={subCategory.includes(option)}
                    onChange={() => toggleSubCategory(option)}
                    className='h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900'
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </section>
        </div>
      </aside>

      <main className='space-y-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <Title text1='All' text2='Collections' />
          <div className='flex items-center gap-3'>
            <label htmlFor='sortType' className='text-sm font-medium text-slate-600'>Sort</label>
            <select
              id='sortType'
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className='rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200'
            >
              <option value='relevant'>Relevant</option>
              <option value='low-high'>Price: Low to High</option>
              <option value='high-low'>Price: High to Low</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className='rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-600 shadow-sm'>
            No products matched your filters. Try adjusting search terms or categories.
          </div>
        ) : (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {filteredProducts.map((item) => (
              <ProductItem key={item._id} name={item.name} id={item._id} price={item.price} image={item.image} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Collection