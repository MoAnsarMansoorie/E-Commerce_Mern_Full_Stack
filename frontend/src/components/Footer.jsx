import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';

const Footer = () => {
  const [email, setEmail] = useState('')

  const subscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    toast.success('Subscribed successfully');
    setEmail('')
  }

  return (
    <footer className='relative w-screen left-1/2 -translate-x-1/2 bg-gray-900 text-white mt-4'>
      <div className='w-full max-w-[1200px] mx-auto px-4 sm:px-8'>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">

          {/* Brand + description + socials */}
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-3'>
              <img src={assets.logo} alt="Logo" className="w-12 bg-white rounded-full p-1" />
              <div>
                <h3 className='text-lg font-semibold'>Clothing Store</h3>
                <p className='text-sm text-white/90'>Quality garments made with care.</p>
              </div>
            </div>

            <p className='text-sm text-white/80'>We craft modern, sustainable clothing for everyday wear. Join our community for updates and exclusive offers.</p>

            <div className='flex items-center gap-3 mt-2'>
              <a href='#' aria-label='Twitter' className='w-8 h-8 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center transition'>
                <svg className='w-4 h-4 text-white' viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path d='M19 7.5c.01.14.01.28.01.42 0 4.29-3.27 9.24-9.24 9.24A9.18 9.18 0 0 1 3 16.8a6.52 6.52 0 0 0 .76.04 6.52 6.52 0 0 0 4.04-1.39 3.26 3.26 0 0 1-3.04-2.26c.5.08 1 .06 1.47-.02A3.26 3.26 0 0 1 9.4 9.24c.95-1.02 2.6-1.1 3.77-.22a6.55 6.55 0 0 0 2.07-.8 3.25 3.25 0 0 1-1.43 1.79 6.5 6.5 0 0 0 1.88-.52 6.98 6.98 0 0 1-1.62 1.67z'/></svg>
              </a>
              <a href='#' aria-label='Instagram' className='w-8 h-8 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center transition'>
                <svg className='w-4 h-4 text-white' viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path d='M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 1.5a3 3 0 1 0 .001 6.001A3 3 0 0 0 12 9z'/></svg>
              </a>
              <a href='#' aria-label='Facebook' className='w-8 h-8 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center transition'>
                <svg className='w-4 h-4 text-white' viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path d='M13 3h3v3h-3v2h3v3h-3v9h-3v-9H7V9h3V6a3 3 0 0 1 3-3z'/></svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className='text-lg font-semibold mb-4'>Company</p>
            <ul className='flex flex-col gap-2 text-white/90'>
              <NavLink to='/' className='hover:underline'>Home</NavLink>
              <NavLink to='/collection' className='hover:underline'>Collection</NavLink>
              <NavLink to='/about' className='hover:underline'>About</NavLink>
              <NavLink to='/contact' className='hover:underline'>Contact</NavLink>
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <p className='text-lg font-semibold mb-4'>Get in touch</p>
            <p className='text-white/90 mb-3'>+91-987-654-3210</p>
            <p className='text-white/90 mb-3'>contact@clothing.com</p>

            <form onSubmit={subscribe} className='mt-4 flex gap-2'>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Your email' className='flex-1 px-3 py-2 rounded-md bg-white/10 placeholder-white/70 text-white outline-none focus:ring-2 focus:ring-white/30' />
              <button className='px-4 py-2 rounded-md bg-white text-slate-800 font-semibold hover:bg-white/90 transition' type='submit'>Subscribe</button>
            </form>
          </div>

        </div>

        <div className='mt-6 border-t border-white/20 pt-4'>
          <p className='text-center text-sm text-white/90 py-2'>
            &copy; {new Date().getFullYear()} Clothing Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

