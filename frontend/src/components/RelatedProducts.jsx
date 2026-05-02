import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
// This component fetches and displays related products based on category and subCategory

const RelatedProducts = ({category, subCategory}) => {

    // This component will fetch and display related products based on category and subCategory
    const {products, search} = useContext(ShopContext);
    const [related, setRelated] = useState([]);

    useEffect(() => {
        if(products.length > 0) {
            let productsCopy = products.slice();

            // Filter products based on category and subCategory
            productsCopy = productsCopy.filter((item => item.category === category))
            productsCopy = productsCopy.filter((item => item.subCategory === subCategory))

            if (search && search.trim().length > 0) {
                productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
            }

            setRelated(productsCopy.slice(0, 5))
        }
    },[products, search, category, subCategory])

  return (
    <div className="my-24">
      <div className='text-center text-3xl py-2'>
        <Title text1={"Related"} text2={"Products"} />
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {related.map((item, index) => (
          <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image} />
        ))}
      </div>
    </div>
  );
}

export default RelatedProducts;
