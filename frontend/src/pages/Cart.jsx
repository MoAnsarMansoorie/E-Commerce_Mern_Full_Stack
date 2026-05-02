import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  // This component will display the user's cart items
  // You can fetch cart items from the backend and display them here

  const {products, currency, cartItems, updateQuantity, navigate} = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
/* kkkkkkkkkkkkkkkkkkkkkkkkkkk kkkkkkk */
  // helper to format price
  const formatPrice = (value) => `${currency}${Number(value).toFixed(2)}`;

  useEffect(() => {
    // Fetch cart items from the backend or context
    const tempData = [];

    for (const item in cartItems) {
      for (const size in cartItems[item]) {
        if (cartItems[item][size] > 0) {
          tempData.push({
            _id: item,
            size: size,
            quantity: cartItems[item][size],
            // product: products.find(product => product.id === item)
          });
        }
      }
    }
    setCartData(tempData);
    console.log(tempData);
  },[cartItems])

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3 text-center font-bold'>
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      {cartData.length === 0 ? (
        <div className='text-center py-20 text-gray-600'>
          <img src={assets.empty_cart} alt='empty' className='mx-auto w-40 mb-6' />
          <h3 className='text-lg font-medium'>Your cart is empty</h3>
          <p className='mt-2'>Explore our collection and add items you love.</p>
          <div className='mt-6'>
            <button onClick={() => navigate('/collection')} className='bg-black text-white px-6 py-2 rounded-md'>Shop Collection</button>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2'>
            <div className='space-y-4'>
              {cartData.map((product, index) => {
                const productData = products.find(item => item._id === product._id);
                if (!productData) return null;

                const lineTotal = (productData.price || 0) * product.quantity;

                return (
                  <div key={index} className='flex flex-col sm:flex-row gap-4 items-start bg-white shadow-sm rounded-md p-4'>
                    <img onClick={() => navigate(`/product/${product._id}`)} src={productData.image?.[0]} alt={productData.name} className='w-24 h-24 object-cover rounded-md cursor-pointer' />

                    <div className='flex-1'>
                      <div className='flex justify-between items-start'>
                        <div>
                          <h3 className='text-base font-medium'>{productData.name}</h3>
                          <p className='text-sm text-gray-500 mt-1'>{product.size}</p>
                        </div>

                        <div className='text-right'>
                          <p className='font-medium'>{formatPrice(productData.price)}</p>
                          <p className='text-sm text-gray-500'>Subtotal: {formatPrice(lineTotal)}</p>
                        </div>
                      </div>

                      <div className='mt-3 flex items-center gap-3'>
                        <div className='flex items-center border rounded-md overflow-hidden'>
                          <button aria-label='decrease' onClick={() => updateQuantity(product._id, product.size, Math.max(1, product.quantity - 1))} className='px-3 py-1 bg-gray-50'>-</button>
                          <div className='px-4'>{product.quantity}</div>
                          <button aria-label='increase' onClick={() => updateQuantity(product._id, product.size, product.quantity + 1)} className='px-3 py-1 bg-gray-50'>+</button>
                        </div>

                        <button onClick={() => {
                          const ok = window.confirm('Remove this item from cart?');
                          if (ok) updateQuantity(product._id, product.size, 0);
                        }} className='text-red-600 text-sm flex items-center gap-2'>
                          <img src={assets.bin_icon} alt='remove' className='w-4' /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <aside className='lg:col-span-1 bg-white shadow-sm rounded-md p-6 h-fit'>
            <h4 className='text-lg font-medium mb-4'>Order Summary</h4>
            <CartTotal />
            <div className='mt-6'>
              <button onClick={() => navigate('/place-order')} className='w-full bg-black text-white py-3 rounded-md'>Proceed to Checkout</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

export default Cart