import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
    const { products, search } = useContext(ShopContext);
    const [latestProducts, setLatestProducts ] = useState([]);

    useEffect(() => {
        let lp = products.slice();
        if (search && search.trim().length > 0) {
            lp = lp.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
        }
        setLatestProducts(lp.slice(0, 10));
    },[products, search])

    console.log(products) 

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={"Latest"} text2={"Collection"} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum nisi doloribus deserunt voluptatibus. 
        </p>
      </div>

      {/* Rendering products */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {
            latestProducts.map((item, index) => (
                <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image} />
            ))
        }
      </div>
    </div>
  );
}

export default LatestCollection;
