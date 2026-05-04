import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../config';
import { toast } from 'react-toastify';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/v1/product/list`);
      if (response.data.success) {
        setList(response.data.products || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching list:', error);
      toast.error(error.response?.data?.message || error.message || 'Unable to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(`${backendUrl}/api/v1/product/remove/${id}`, { id }, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || error.message || 'Unable to remove product');
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <section className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Inventory</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">All products</h2>
          </div>
          <p className="text-sm text-slate-600">{list.length} product{list.length === 1 ? '' : 's'} currently listed</p>
        </div>
      </header>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm shadow-slate-200">
        <div className="hidden grid-cols-[1fr_3fr_1fr_1fr_1fr] gap-4 border-b border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600 md:grid">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span className="text-center">Action</span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading products…</div>
        ) : list.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No products found yet.</div>
        ) : (
          <div className="divide-y divide-slate-200">
            {list.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-[1fr_3fr_1fr] items-center gap-4 px-4 py-4 text-sm text-slate-700 md:grid-cols-[1fr_3fr_1fr_1fr_1fr]"
              >
                <img src={item.image?.[0]} alt={item.name} className="h-16 w-16 rounded-2xl object-cover" />
                <div>
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="mt-1 text-slate-500">{item.category}</p>
                </div>
                <p className="hidden md:block">{item.category}</p>
                <p className="text-slate-900">{currency}{item.price}</p>
                <button
                  type="button"
                  onClick={() => removeProduct(item._id)}
                  className="mx-auto rounded-full bg-red-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                  aria-label={`Remove ${item.name}`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default List;
