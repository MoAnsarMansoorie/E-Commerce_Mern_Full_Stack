import React, { useContext, useEffect, useState, useCallback } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from "../components/Title"
import ProductItem from '../components/ProductItem'
import { useLocation } from 'react-router-dom'

const Collection = () => {

  const { products, search, setSearch } = useContext(ShopContext)
  const [showFilter, setShowFilter ] = useState(true);
  const location = useLocation();
  const [filterProducts, setFilterProducts] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState("relavent");

  const toggleCategory = (e) => {
    if(category.includes(e.target.value)) {
        setCategory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
        setCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleSubCategory = (e) => {
    if(subCategory.includes(e.target.value)) {
        setSubCategory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
        setSubCategory(prev => [...prev, e.target.value])
    }
  }

  // Filter Products based on category and subCategory
  const applyFilter = useCallback(() => {

    let productCopy = products.slice()

    if(search && search.trim().length > 0) {
      productCopy = productCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if(category.length > 0) {
      productCopy = productCopy.filter(item => category.includes(item.category))
    }

    if(subCategory.length > 0) {
      productCopy = productCopy.filter(item => subCategory.includes(item.subCategory));
    }

    setFilterProducts(productCopy);
    
  }, [products, search, category, subCategory])

  const sortProduct = useCallback(() => {
    switch (sortType) {
      case "low-high":
        setFilterProducts(prev => prev.slice().sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(prev => prev.slice().sort((a, b) => b.price - a.price));
        break;
      default:
        // Restore filtered order from applyFilter (no direct dependency on filterProducts to avoid loop)
        applyFilter();
        break;
    }
  }, [sortType, applyFilter])

  // Sort products when sortType changes
  useEffect(() => {
    sortProduct();
  },[sortProduct])

  // Apply filter on initial load and when dependencies inside `applyFilter` change
  useEffect(() => {
    applyFilter()
  },[applyFilter])

  // Keep search in sync with the URL query parameter `search`
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search') || '';

    // If URL query differs from context search, update context so UI reacts
    if ((q || '') !== (search || '')) {
      setSearch(q);
    }
    // No direct call to applyFilter() here — applyFilter runs via its own effect when `search` changes
  }, [location.search, search, setSearch]);

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t border-gray-200'>
      {/* Left side */}
      {/* Filter Products */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='py-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`} src={assets.dropdown_icon} />
        </p>
        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input type="checkbox" className='w-3' value={"Men"} onChange={toggleCategory} /> Men
            </p>

            <p className='flex gap-2'>
              <input type="checkbox" className='w-3' value={"Women"} onChange={toggleCategory} /> Women
            </p>

            <p className='flex gap-2'>
              <input type="checkbox" className='w-3' value={"Kids"} onChange={toggleCategory} /> Kids
            </p>
          </div>
        </div>

        {/* SubCategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input type="checkbox" className='w-3' value={"Topwear"} onChange={toggleSubCategory} /> Topwear
            </p>

            <p className='flex gap-2'>
              <input type="checkbox" className='w-3' value={"Bottomwear"} onChange={toggleSubCategory} /> Bottemwear
            </p>

            <p className='flex gap-2'>
              <input type="checkbox" className='w-3' value={"Winterwear"} onChange={toggleSubCategory} /> Winterwear
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      {/* <div className='flex-1'>
        <p className='text-2xl font-semibold mb-5'>All Products</p>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5'>
          {products.map((product) => (
            <div key={product.id} className='border border-gray-300 p-4 rounded-lg hover:shadow-lg transition-shadow duration-200'>
              <img src={product.image} alt={product.name} className='w-full h-48 object-cover mb-3' />
              <h3 className='text-lg font-medium'>{product.name}</h3>
              <p className='text-gray-600 mt-1'>${product.price}</p>
            </div>
          ))}
        </div>
      </div>  AI code */}

      <div className='flex-1'>

        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          {/* Product Sort */}
          <select onClick={(e) => setSortType(e.target.value)} className='border border-gray-300 text-sm px-2'>
            <option value="relavent">Sort By - Relavent</option>
            <option value="low-high">Sort By - Low to High</option>
            <option value="high-low">Sort By - High to Low</option>
          </select>
        </div>

        {/* Map Products */}
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterProducts.map((item, index) => (
            <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image} />
          ))}
        </div>  

      </div>

    </div>
  )
}

export default Collection