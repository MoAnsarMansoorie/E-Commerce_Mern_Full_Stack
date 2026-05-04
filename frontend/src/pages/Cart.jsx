import React, { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext)

  const cartData = useMemo(() => {
    const items = []
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        const quantity = cartItems[itemId][size]
        if (quantity > 0) {
          items.push({ _id: itemId, size, quantity })
        }
      }
    }
    return items
  }, [cartItems])

  const formatPrice = (value) => `${currency}${Number(value).toFixed(2)}`

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-6 text-center font-bold'>
        <Title text1='Your' text2='Cart' />
      </div>

      {cartData.length === 0 ? (
        <div className='rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm'>
          <img src={assets.empty_cart} alt='Empty cart illustration' className='mx-auto w-36 mb-6' />
          <h3 className='text-lg font-semibold text-slate-900'>Your cart is empty</h3>
          <p className='mt-2 text-sm text-slate-600'>Explore our collection and add items you love.</p>
          <button
            type='button'
            onClick={() => navigate('/collection')}
            className='mt-6 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800'
          >
            Shop Collection
          </button>
        </div>
      ) : (
        <div className='grid gap-8 lg:grid-cols-[2fr_1fr]'>
          <div className='space-y-4'>
            {cartData.map((product) => {
              const productData = products.find((item) => item._id === product._id)
              if (!productData) return null

              const lineTotal = (productData.price || 0) * product.quantity

              return (
                <div key={`${product._id}-${product.size}`} className='flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row'>
                  <button
                    type='button'
                    onClick={() => navigate(`/product/${product._id}`)}
                    className='h-28 w-28 shrink-0 overflow-hidden rounded-3xl border border-slate-200'
                  >
                    <img src={productData.image?.[0]} alt={productData.name} className='h-full w-full object-cover' loading='lazy' />
                  </button>

                  <div className='flex-1 space-y-4'>
                    <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-start'>
                      <div>
                        <h3 className='text-base font-semibold text-slate-900'>{productData.name}</h3>
                        <p className='mt-1 text-sm text-slate-500'>Size: {product.size}</p>
                      </div>
                      <div className='text-right'>
                        <p className='font-semibold text-slate-900'>{formatPrice(productData.price)}</p>
                        <p className='text-sm text-slate-500'>Subtotal: {formatPrice(lineTotal)}</p>
                      </div>
                    </div>

                    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                      <div className='flex items-center rounded-2xl border border-slate-200 bg-slate-50'>
                        <button
                          type='button'
                          aria-label='Decrease quantity'
                          onClick={() => updateQuantity(product._id, product.size, Math.max(1, product.quantity - 1))}
                          className='h-10 w-10 text-slate-700 transition hover:bg-slate-100'
                        >
                          −
                        </button>
                        <div className='min-w-[2.5rem] text-center text-sm font-medium'>{product.quantity}</div>
                        <button
                          type='button'
                          aria-label='Increase quantity'
                          onClick={() => updateQuantity(product._id, product.size, product.quantity + 1)}
                          className='h-10 w-10 text-slate-700 transition hover:bg-slate-100'
                        >
                          +
                        </button>
                      </div>

                      <button
                        type='button'
                        onClick={() => {
                          if (window.confirm('Remove this item from cart?')) {
                            updateQuantity(product._id, product.size, 0)
                          }
                        }}
                        className='inline-flex items-center gap-2 text-sm font-medium text-red-600 transition hover:text-red-700'
                      >
                        <img src={assets.bin_icon} alt='' className='h-4 w-4' aria-hidden='true' />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <aside className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <h4 className='text-lg font-semibold text-slate-900'>Order Summary</h4>
            <CartTotal />
            <button
              type='button'
              onClick={() => navigate('/place-order')}
              className='mt-6 w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800'
            >
              Proceed to Checkout
            </button>
          </aside>
        </div>
      )}
    </div>
  )
}

export default Cart