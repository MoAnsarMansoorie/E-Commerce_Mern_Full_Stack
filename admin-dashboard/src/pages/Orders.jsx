import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../config';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllOrders = async () => {
    if (!token) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/order/list`,
        {},
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        toast.error(response.data.message || 'Unable to load orders');
      }
    } catch (error) {
      console.error('Error while fetching orders', error);
      toast.error(error.response?.data?.message || error.message || 'Unable to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const statusHandler = async (e, orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/order/status`,
        { orderId, status: e.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.error('Error while updating order status', error);
      toast.error(error.response?.data?.message || error.message || 'Unable to update order status');
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <section className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Orders</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Current orders</h2>
          </div>
          <p className="text-sm text-slate-600">{orders.length} order{orders.length === 1 ? '' : 's'}</p>
        </div>
      </header>

      <div className="space-y-4">
        {isLoading ? (
          <div className="rounded-3xl bg-white p-8 text-center text-slate-500 shadow-sm shadow-slate-200">Loading orders…</div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center text-slate-500 shadow-sm shadow-slate-200">No orders found.</div>
        ) : (
          orders.map((order) => (
            <article
              key={order._id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-100"
            >
              <div className="grid gap-4 lg:grid-cols-[auto_1.5fr_auto] lg:items-start">
                <div className="flex items-center justify-center rounded-3xl bg-slate-50 p-4">
                  <img className="h-12 w-12" src={assets.parcel_icon} alt="Parcel icon" />
                </div>

                <div className="space-y-3 text-sm text-slate-700">
                  <div>
                    <p className="text-base font-semibold text-slate-900">Items</p>
                    <div className="mt-2 text-slate-600">
                      {order.items.map((item, index) => (
                        <span key={`${item._id || item.name}-${index}`}>
                          {item.name} x {item.quantity} <span className="text-slate-500">({item.size})</span>
                          {index < order.items.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {order.address.firstName} {order.address.lastName}
                    </p>
                    <p className="text-slate-600">{order.address.phone}</p>
                    <p className="mt-2 text-slate-600">
                      {order.address.street}, {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-4 text-sm">
                  <p className="font-semibold text-slate-900">Order details</p>
                  <p className="mt-3">Items: {order.items.length}</p>
                  <p>Method: {order.paymentMethod}</p>
                  <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
                  <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900">{currency}{order.amount}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="block text-sm font-medium text-slate-700" htmlFor={`status-${order._id}`}>
                  Order status
                </label>
                <select
                  id={`status-${order._id}`}
                  value={order.status}
                  onChange={(e) => statusHandler(e, order._id)}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default Orders;
