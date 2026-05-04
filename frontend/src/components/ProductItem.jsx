import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link to={`/product/${id}`} className='group overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg'>
      <div className='overflow-hidden bg-slate-100'>
        <img src={image[0]} alt={name} loading='lazy' className='h-64 w-full object-cover transition duration-300 group-hover:scale-105' />
      </div>
      <div className='px-4 py-4'>
        <p className='text-sm font-medium text-slate-900'>{name}</p>
        <p className='mt-1 text-sm text-slate-600'>{currency}{price}</p>
      </div>
    </Link>
  );
}

export default ProductItem;
