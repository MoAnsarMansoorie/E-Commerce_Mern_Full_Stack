import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from "../components/Title"
import { toast } from 'react-toastify'
import axios from 'axios'

const Orders = () => {
  const { backendUrl, token, currency, addToCart, navigate } = useContext(ShopContext)

  const [orderData, setOrderData] = useState([])
  const [expandedOrders, setExpandedOrders] = useState({});

  const loadUserOrderData = async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.post(`${backendUrl}/api/v1/order/userorders`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      if(response.data.success) {
        // keep orders grouped for better UI
        const orders = response.data.orders || [];
        setOrderData(orders);
      }

    } catch (error) {
      console.error("Error fetching user orders:", error);
      toast.error("Failed to fetch orders. Please try again later.");

    }
  }

  useEffect(() => {
    loadUserOrderData()
  }, [token])


  const formatPrice = (v) => `${currency}${Number(v || 0).toFixed(2)}`;

  const toggleDetails = (orderId) => {
    setExpandedOrders((s) => ({ ...s, [orderId]: !s[orderId] }));
  }

  const handleReorder = async (order) => {
    if (!order || !order.items) return;
    try {
      for (const it of order.items) {
        for (let i = 0; i < (it.quantity || 1); i++) {
          // best-effort: ignore await to speed up, but we await each to keep order
          // when addToCart is available it will show toast or require login
          // assume addToCart handles auth checks
          // eslint-disable-next-line no-await-in-loop
          await addToCart(it._id || it.id, it.size);
        }
      }
      toast.success('Items added to cart.');
      navigate('/cart');
    } catch (error) {
      console.error('Reorder failed', error);
      toast.error('Could not add items to cart.');
    }
  }

  return (
    <div className="border-t pt-16">

      <div className='text-2xl'>
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div className='mt-6 space-y-4'>
        {orderData.length === 0 ? (
          <div className='text-center text-gray-500 py-8'>No orders found.</div>
        ) : (
          orderData.map((order) => {
            const orderId = order._id || order.id || Math.random().toString(36).slice(2, 9);
            const total = order.totalAmount || order.total || order.items?.reduce((s, it) => s + ((it.price || 0) * (it.quantity || 1)), 0);

            const status = (order.status || '').toLowerCase();
            const statusColor = status.includes('delivered') ? 'bg-green-100 text-green-700' : status.includes('shipped') ? 'bg-blue-100 text-blue-700' : status.includes('cancel') ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700';

            return (
              <div key={orderId} className='bg-white rounded-md shadow-sm p-4'>
                <div className='flex items-start justify-between gap-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Order ID: <span className='font-medium text-gray-700'>{orderId}</span></p>
                    <p className='text-base font-semibold mt-1'>{order.items?.[0]?.name || 'Order items'}</p>
                    <p className='text-sm text-gray-500 mt-1'>Placed on {new Date(order.date || Date.now()).toLocaleDateString()}</p>
                  </div>

                  <div className='flex items-center gap-4'>
                    <div className={`px-3 py-1 rounded-full text-sm ${statusColor}`}>{order.status || 'Pending'}</div>
                    <div className='text-right'>
                      <p className='text-sm text-gray-500'>Total</p>
                      <p className='font-semibold'>{formatPrice(total)}</p>
                    </div>
                  </div>
                </div>

                <div className='mt-4 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <button onClick={() => toggleDetails(orderId)} className='text-sm px-3 py-1 border rounded-md'>
                      {expandedOrders[orderId] ? 'Hide details' : `View details (${order.items?.length || 0})`}
                    </button>
                    <button onClick={() => handleReorder(order)} className='text-sm px-3 py-1 bg-black text-white rounded-md'>Reorder</button>
                    <button onClick={() => toast.info('Tracking details will appear here soon.')} className='text-sm px-3 py-1 border rounded-md'>Track order</button>
                  </div>

                  <div className='text-sm text-gray-500'>Payment: <span className='text-gray-700 font-medium'>{order.paymentMethod || order.payment || '—'}</span></div>
                </div>

                {expandedOrders[orderId] && (
                  <div className='mt-4 border-t pt-4 space-y-3'>
                    {order.items?.map((it, idx) => (
                      <div key={idx} className='flex items-center gap-4'>
                        <img src={it.image?.[0]} alt={it.name} className='w-16 h-16 object-cover rounded-md' />
                        <div className='flex-1'>
                          <p className='font-medium'>{it.name}</p>
                          <p className='text-sm text-gray-500'>Size: {it.size} • Qty: {it.quantity}</p>
                        </div>
                        <div className='text-right'>
                          <p className='font-medium'>{formatPrice((it.price || 0) * (it.quantity || 1))}</p>
                          <p className='text-sm text-gray-500'>{formatPrice(it.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Orders
