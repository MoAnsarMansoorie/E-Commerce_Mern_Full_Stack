import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../config';
import { toast } from 'react-toastify';

const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Men');
  const [subCategory, setSubCategory] = useState('Topwear');
  const [sizes, setSizes] = useState([]);
  const [bestseller, setBestseller] = useState(false);

  const toggleSize = (size) => {
    setSizes((prev) => (prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size]));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      image1 && formData.append('image1', image1);
      image2 && formData.append('image2', image2);
      image3 && formData.append('image3', image3);
      image4 && formData.append('image4', image4);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('sizes', JSON.stringify(sizes));
      formData.append('bestseller', bestseller);

      const response = await axios.post(`${backendUrl}/api/v1/product/add`, formData, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        setName('');
        setDescription('');
        setPrice('');
        setSizes([]);
        setBestseller(false);
      } else {
        toast.error(response.data.message || 'Unable to add product');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
      <header className="mb-6">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Create product</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">New product details</h2>
      </header>

      <form onSubmit={onSubmitHandler} className="space-y-6">
        <div>
          <p className="mb-3 text-sm font-medium text-slate-700">Upload product images</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { file: image1, setter: setImage1, id: 'image1' },
              { file: image2, setter: setImage2, id: 'image2' },
              { file: image3, setter: setImage3, id: 'image3' },
              { file: image4, setter: setImage4, id: 'image4' },
            ].map((item) => (
              <label
                key={item.id}
                htmlFor={item.id}
                className="group flex h-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-slate-50 transition hover:border-slate-500"
              >
                <img
                  src={item.file ? URL.createObjectURL(item.file) : assets.upload_area}
                  alt={item.file ? 'Selected product image preview' : 'Upload product image'}
                  className="h-full w-full object-cover"
                />
                <input
                  id={item.id}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => item.setter(e.target.files?.[0] || null)}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <label htmlFor="product-name" className="mb-2 block text-sm font-medium text-slate-700">
              Product name
            </label>
            <input
              id="product-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              required
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label htmlFor="product-price" className="mb-2 block text-sm font-medium text-slate-700">
              Price
            </label>
            <input
              id="product-price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="25.00"
              required
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        <div>
          <label htmlFor="product-description" className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the product features"
            required
            className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Sub category</span>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={bestseller}
              onChange={() => setBestseller((prev) => !prev)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
            />
            Bestseller
          </label>
        </div>

        <fieldset className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <legend className="px-2 text-sm font-medium text-slate-700">Sizes</legend>
          <div className="mt-3 flex flex-wrap gap-3">
            {sizeOptions.map((size) => {
              const active = sizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                    active ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Add product
          </button>
        </div>
      </form>
    </section>
  );
};

export default Add;
