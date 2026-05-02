import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext'; // Adjust the import path as necessary
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from 'react-toastify';

const Product = () => {
  const { productId } = useParams();  // Here you can fetch product details using the productId
  const { products, currency, addToCart, navigate, token } = useContext(ShopContext); // Assuming you have a ShopContext that provides products
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const handleBuyNow = async () => {
    if (!size) {
      toast.error('Please select a size before purchasing.');
      return;
    }

    if (!token) {
      toast.info('Please login to continue to checkout.');
      navigate('/login');
      return;
    }

    try {
      // Add item(s) to cart on backend. addToCart adds one item per call.
      const calls = [];
      for (let i = 0; i < quantity; i++) calls.push(addToCart(productData._id, size));
      await Promise.all(calls);

      // Navigate to protected checkout page
      navigate('/place-order');
    } catch (error) {
      console.error('Buy now failed', error);
      toast.error('Could not proceed to checkout. Please try again.');
    }
  }

  const fetchProductData = async () => {

    products.map((item) => {
      if (item._id == productId) {
        setProductData(item);
        setImage(item.image[0]); // Assuming the image is an array and you want the first image
        return null; // Exit the map early once the product is found
      }
    })

  }

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity duration-500 ease-in opacity-100'>
      {/* ---------------------Product data------------------ */}
      <div className='flex flex-col lg:flex-row gap-8 lg:gap-12 items-start'>

        {/* ------------------Product Image--------------------- */}
        <div className='lg:flex-1 w-full flex gap-6'>
          {/* thumbnails */}
          <div className='hidden lg:flex flex-col gap-3 w-20'>
            {productData.image.map((item, index) => (
              <button
                key={index}
                onClick={() => setImage(item)}
                className={`rounded-md overflow-hidden border ${image === item ? 'border-orange-400 ring-2 ring-orange-100' : 'border-gray-200'} focus:outline-none`}
                aria-label={`View image ${index + 1}`}
              >
                <img src={item} alt={`thumb-${index}`} className='w-full h-20 object-cover' />
              </button>
            ))}
          </div>

          {/* main image */}
          <div className='flex-1 bg-white rounded-lg shadow-sm p-4 flex items-center justify-center'>
            <img src={image} alt={productData.name} className='w-full h-auto max-h-[520px] object-contain' />
          </div>
        </div>

        {/* ------------------Product details--------------------- */}
        <div className='lg:flex-1 w-full'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <h1 className='text-2xl font-semibold mt-2'>{productData.name}</h1>
              <div className='flex items-center gap-2 my-2 text-sm text-gray-600'>
                <div className='flex items-center gap-1'>
                  <img src={assets.star_icon} alt="" className="w-4" />
                  <img src={assets.star_icon} alt="" className="w-4" />
                  <img src={assets.star_icon} alt="" className="w-4" />
                  <img src={assets.star_icon} alt="" className="w-4" />
                  <img src={assets.star_dull_icon} alt="" className="w-4" />
                </div>
                <p className='pl-2'>122 reviews</p>
              </div>
            </div>

            <button
              onClick={() => setWishlisted((s) => !s)}
              className={`p-2 rounded-md border ${wishlisted ? 'text-red-600 border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 21s-7-4.35-9-7.5A5.5 5.5 0 0112 6.5a5.5 5.5 0 019 7c-2 3.15-9 7.5-9 7.5z" />
              </svg>
            </button>
          </div>

          <p className='mt-3 font-medium text-2xl'>{currency}{productData.price}</p>
          <p className='mt-3 text-gray-500'>{productData.shortDescription || productData.description.slice(0, 140) + '...'}</p>

          <div className='mt-6 flex flex-col gap-5'>
            <div>
              <p className='mb-2 text-sm font-medium'>Select Size</p>
              <div className='flex flex-wrap gap-2'>
                {productData.sizes.map((item, index) => (
                  <button
                    onClick={() => setSize(item)}
                    key={index}
                    className={`px-4 py-2 rounded-full border ${item === size ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-50 border-gray-200'} text-sm`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <div className='flex items-center border rounded-md overflow-hidden'>
                <button aria-label='decrease' onClick={() => setQuantity(Math.max(1, quantity - 1))} className='px-3 py-2 bg-gray-50'>-</button>
                <div className='px-4'>{quantity}</div>
                <button aria-label='increase' onClick={() => setQuantity(quantity + 1)} className='px-3 py-2 bg-gray-50'>+</button>
              </div>

              <button onClick={() => addToCart(productData._id, size, quantity)} className='bg-black text-white px-6 py-2 rounded-md text-sm hover:opacity-95'>Add to cart</button>
              <button className='px-4 py-2 border rounded-md text-sm'>Buy now</button>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 text-sm text-gray-500'>
              <div className='flex items-center gap-2'><span className='font-medium text-gray-700'>•</span> 100% original</div>
              <div className='flex items-center gap-2'><span className='font-medium text-gray-700'>•</span> Cash on delivery</div>
              <div className='flex items-center gap-2'><span className='font-medium text-gray-700'>•</span> Easy returns within 7 days</div>
            </div>
          </div>

          <div className='mt-8'>
            <div className='flex gap-2 border-b'>
              <button onClick={() => setActiveTab('description')} className={`px-4 py-2 ${activeTab === 'description' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-600'}`}>Description</button>
              <button onClick={() => setActiveTab('reviews')} className={`px-4 py-2 ${activeTab === 'reviews' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-600'}`}>Reviews (122)</button>
            </div>

            <div className='mt-4 text-sm text-gray-700'>
              {activeTab === 'description' ? (
                <div className='space-y-3'>
                  <p>{productData.description}</p>
                  <ul className='list-disc pl-5 text-gray-600'>
                    <li>Material: {productData.material || 'N/A'}</li>
                    <li>Fit: {productData.fit || 'Regular'}</li>
                    <li>Care: {productData.care || 'Machine wash'}</li>
                  </ul>
                </div>
              ) : (
                <div className='space-y-3'>
                  <p className='text-gray-600'>Average rating 4.2 • 122 reviews</p>
                  <div className='border rounded p-3 bg-gray-50'>
                    <p className='font-medium'>Jane D.</p>
                    <p className='text-gray-600 text-sm'>"Great quality and fast delivery."</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ---------------Description and review section-------------------- */}
      <div className='mt-12'></div>

      {/* ------------Display related products------------ */}
      {/* <div className='mt-20'>
        <h1 className='text-2xl font-medium'>Related Products</h1>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-6'>
          {products.slice(0, 8).map((item) => (
            <div key={item._id} className='border p-4 rounded-lg hover:shadow-lg transition-shadow duration-300'>
              <img src={item.image[0]} alt={item.name} className='w-full h-auto mb-4' />
              <h2 className='text-lg font-semibold'>{item.name}</h2>
              <p className='text-gray-500'>{currency}{item.price}</p>
            </div>
          ))}
        </div>
      </div>  Thios is AI generated code */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />


    </div>
  ) : (
    <div className='opacity-0'>
      <h1>Loading...</h1>
      <p>Please wait while we fetch the product details.</p>
    </div>
  )
}

export default Product