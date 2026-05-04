import React, { useContext, useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts'
import { toast } from 'react-toastify'

const Product = () => {
  const { productId } = useParams()
  const { products, currency, addToCart, navigate, token } = useContext(ShopContext)
  const [productData, setProductData] = useState(null)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  const selectedProduct = useMemo(
    () => products.find((item) => item._id === productId) || null,
    [products, productId]
  )

  useEffect(() => {
    if (selectedProduct) {
      setProductData(selectedProduct)
      setImage(selectedProduct.image?.[0] || '')
    }
  }, [selectedProduct])

  const handleAddToCart = async () => {
    if (!size) {
      toast.error('Please select a size before adding to cart.')
      return
    }

    for (let i = 0; i < quantity; i += 1) {
      await addToCart(productData._id, size)
    }
  }

  const handleBuyNow = async () => {
    if (!size) {
      toast.error('Please select a size before purchasing.')
      return
    }

    if (!token) {
      toast.info('Please login to continue to checkout.')
      navigate('/login')
      return
    }

    await handleAddToCart()
    navigate('/place-order')
  }

  if (!productData) {
    return (
      <div className='border-t-2 pt-10'>
        <div className='space-y-4'>
          <div className='h-10 w-3/5 rounded-full bg-slate-200' />
          <div className='grid gap-4 md:grid-cols-[1.2fr_0.8fr]'>
            <div className='space-y-4'>
              <div className='h-[420px] rounded-3xl bg-slate-200' />
              <div className='grid grid-cols-3 gap-4'>
                <div className='h-24 rounded-3xl bg-slate-200' />
                <div className='h-24 rounded-3xl bg-slate-200' />
                <div className='h-24 rounded-3xl bg-slate-200' />
              </div>
            </div>
            <div className='space-y-4'>
              <div className='h-8 rounded-full bg-slate-200' />
              <div className='h-5 w-24 rounded-full bg-slate-200' />
              <div className='h-4 w-1/2 rounded-full bg-slate-200' />
              <div className='h-12 rounded-3xl bg-slate-200' />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='border-t-2 pt-10'>
      <div className='grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start'>
        <section className='space-y-6'>
          <div className='grid gap-4 lg:grid-cols-[80px_1fr]'>
            <div className='hidden flex-col gap-3 lg:flex'>
              {productData.image.map((item, index) => (
                <button
                  key={index}
                  type='button'
                  onClick={() => setImage(item)}
                  className={`overflow-hidden rounded-3xl border ${image === item ? 'border-orange-400 ring-2 ring-orange-100' : 'border-slate-200'} focus-visible:outline-none`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img src={item} alt={`Product thumbnail ${index + 1}`} className='h-20 w-full object-cover' loading='lazy' />
                </button>
              ))}
            </div>
            <div className='rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'>
              <img src={image} alt={productData.name} className='h-[420px] w-full rounded-3xl object-contain' loading='lazy' />
            </div>
          </div>
        </section>

        <section className='space-y-6'>
          <div className='flex flex-col gap-4'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <h1 className='text-3xl font-semibold text-slate-900'>{productData.name}</h1>
                <p className='mt-2 text-sm text-slate-500'>{productData.category} • {productData.subCategory}</p>
              </div>
              <button
                type='button'
                onClick={() => setWishlisted((current) => !current)}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border px-3 text-sm transition ${wishlisted ? 'border-red-200 bg-red-50 text-red-600' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
                aria-pressed={wishlisted}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill={wishlisted ? 'currentColor' : 'none'} stroke='currentColor' className='h-5 w-5'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M12 21s-7-4.35-9-7.5A5.5 5.5 0 0112 6.5a5.5 5.5 0 019 7c-2 3.15-9 7.5-9 7.5z' />
                </svg>
              </button>
            </div>

            <p className='text-2xl font-semibold text-slate-900'>{currency}{productData.price}</p>
            <p className='max-w-2xl text-sm leading-6 text-slate-600'>{productData.shortDescription || `${productData.description?.slice(0, 140)}...`}</p>
          </div>

          <div className='space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'>
            <div className='space-y-3'>
              <p className='text-sm font-medium text-slate-700'>Select size</p>
              <div className='flex flex-wrap gap-3'>
                {productData.sizes.map((item) => (
                  <button
                    key={item}
                    type='button'
                    onClick={() => setSize(item)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${item === size ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'}`}
                    aria-pressed={item === size}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
              <div className='flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2'>
                <button type='button' aria-label='Decrease quantity' onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} className='h-10 w-10 rounded-2xl bg-white text-slate-800 transition hover:bg-slate-100'>−</button>
                <span className='min-w-[2rem] text-center text-sm font-medium'>{quantity}</span>
                <button type='button' aria-label='Increase quantity' onClick={() => setQuantity((prev) => prev + 1)} className='h-10 w-10 rounded-2xl bg-white text-slate-800 transition hover:bg-slate-100'>+</button>
              </div>

              <div className='flex flex-1 flex-wrap gap-3'>
                <button type='button' onClick={handleAddToCart} className='rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800'>Add to cart</button>
                <button type='button' onClick={handleBuyNow} className='rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50'>Buy now</button>
              </div>
            </div>

            <div className='grid gap-3 text-sm text-slate-600 sm:grid-cols-3'>
              <span>100% original</span>
              <span>Cash on delivery</span>
              <span>Easy returns within 7 days</span>
            </div>
          </div>

          <div className='rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'>
            <div className='flex gap-2 border-b border-slate-200 pb-3'>
              <button type='button' onClick={() => setActiveTab('description')} className={`px-4 py-2 ${activeTab === 'description' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-slate-600'}`}>Description</button>
              <button type='button' onClick={() => setActiveTab('reviews')} className={`px-4 py-2 ${activeTab === 'reviews' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-slate-600'}`}>Reviews</button>
            </div>

            {activeTab === 'description' ? (
              <div className='mt-4 space-y-3 text-sm leading-6 text-slate-700'>
                <p>{productData.description}</p>
                <ul className='list-disc space-y-2 pl-5 text-slate-600'>
                  <li>Material: {productData.material || 'N/A'}</li>
                  <li>Fit: {productData.fit || 'Regular'}</li>
                  <li>Care: {productData.care || 'Machine wash'}</li>
                </ul>
              </div>
            ) : (
              <div className='mt-4 space-y-4 text-sm text-slate-700'>
                <p className='text-slate-600'>Average rating 4.2 • 122 reviews</p>
                <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4'>
                  <p className='font-medium text-slate-900'>Jane D.</p>
                  <p className='text-slate-600 text-sm'>&quot;Great quality and fast delivery.&quot;</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  )
}

export default Product