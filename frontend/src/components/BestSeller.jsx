import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
    const {products, search} = useContext(ShopContext)
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        let bestProduct = products.filter((item) => (item.bestseller));
        if (search && search.trim().length > 0) {
            bestProduct = bestProduct.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
        }
        setBestSeller(bestProduct.slice(0, 5));
    }, [products, search])

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={"Best"} text2={"Seller"} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum nisi doloribus deserunt voluptatibus.
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {/* {bestSeller.map((item) => (
          <div key={item.id} className='border p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300'>
            <img src={item.image} alt={item.name} className='w-full h-48 object-cover mb-4 rounded' />
            <h3 className='text-lg font-semibold'>{item.name}</h3>
            <p className='text-gray-500'>${item.price}</p>
          </div>
        ))} */}
        {
            bestSeller.map((item, index) => (
                <ProductItem key={index} id={item._id} name={item.name} image={item.image} price={item.price} />
            ))
        }

      </div>
    </div>
  );
}

export default BestSeller;
