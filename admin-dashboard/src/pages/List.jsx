import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl } from '../App'; // Import the backend URL from App.jsx
import { toast } from 'react-toastify';
import { currency } from '../App';

const List = ({token}) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/product/list`)
      console.log(response.data)
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
      
    } catch (error) {
      console.error("Error fetching list:", error);
      toast.error(error.message)
      
    }

  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(`${backendUrl}/api/v1/product/remove/${id}`, {id}, {
        headers: { token }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList(); // Refresh the list after deletion
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchList();
  },[])

  return (
    <>
      <p>All Products List</p>

      <div className='flex flex-col gap-2'>

        {/* All Products Heading */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] gap-4 py-1 px-2 bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* All Products List Data */}
        {
          list.map((item, index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-5 px-2 py-1 border text-sm' key={index} >
              <img src={item.image[0]} alt={item.name} className='w-12' />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <p onClick={() => removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-lg'>X</p>
            </div>
          ))
        }
      </div>
    </>
  );
}

export default List;
