import React from 'react';

const NewsletterBox = () => {
    const onSubmitHandler = (e) => {
        e.preventDefault();
    }


  return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-gray-800'>Subscribe Now & get 20% discount.</p>
      <p className='mt-3 text-gray-400'>Subscribe to our newsletter and get the latest updates of our product anytime and everywhere.</p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
        <input className='w-full sm:flex-1 outline-none' type='email' placeholder='Enter your email' required />
        <button type='submit' className='bg-black text-white text-xs px-10 py-4'>Subscribe Now</button>
      </form>
    </div>
  );
}

export default NewsletterBox;
