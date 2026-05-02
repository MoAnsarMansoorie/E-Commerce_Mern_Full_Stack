import React from 'react'
import Title from '../components/Title'
import {assets} from '../assets/assets.js';
import NewsletterBox from '../components/NewsletterBox'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
      <header className='text-center pt-8 border-t pb-6'>
        <Title text1={"ABOUT"} text2={"US"} />
        <p className='mt-3 text-gray-600 max-w-2xl mx-auto'>We create thoughtful products that make everyday life easier — built with quality, care and long-term value in mind.</p>
      </header>

      <section className='my-12 flex flex-col-reverse md:flex-row items-center gap-10'>
        <div className='md:w-1/2 text-gray-700 space-y-4'>
          <h3 className='text-xl font-semibold'>Our Story</h3>
          <p>We started with a simple idea: build well-made essentials that customers love and keep coming back to. Every product is designed with durability, comfort and style.</p>
          <p>From sourcing materials to packaging, we focus on responsible choices so you get great value today and for years to come.</p>
          <div className='flex items-center gap-4 mt-4'>
            <Link to="/collection" className='bg-black text-white px-5 py-2 rounded-md text-sm'>Shop Collection</Link>
            <Link to="/contact" className='text-gray-600 underline text-sm'>Contact Us</Link>
          </div>
        </div>

        <div className='md:w-1/2 flex justify-center'>
          <img className='w-full md:max-w-[480px] rounded-lg shadow-lg' src={assets.about_img} alt="About us" />
        </div>
      </section>

      <section className='py-8'>
        <Title text1={"WHY"} text2={"CHOOSE US"} />
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6'>
          <div className='flex flex-col items-start gap-3 p-6 border rounded'>
            <img src={assets.quality_icon} alt="Quality" className='w-10' />
            <h4 className='font-semibold'>Quality First</h4>
            <p className='text-gray-600 text-sm'>Products carefully inspected and tested for durability.</p>
          </div>

          <div className='flex flex-col items-start gap-3 p-6 border rounded'>
            <img src={assets.support_img} alt="Support" className='w-10' />
            <h4 className='font-semibold'>Fast Support</h4>
            <p className='text-gray-600 text-sm'>Friendly customer service ready to help you 7 days a week.</p>
          </div>

          <div className='flex flex-col items-start gap-3 p-6 border rounded'>
            <img src={assets.exchange_icon} alt="Returns" className='w-10' />
            <h4 className='font-semibold'>Easy Returns</h4>
            <p className='text-gray-600 text-sm'>Hassle-free returns and exchanges within 30 days.</p>
          </div>
        </div>
      </section>

      <section className='py-8'>
        <div className='flex justify-between items-center bg-gray-50 p-6 rounded'>
          <div>
            <p className='text-2xl font-bold'>10k+</p>
            <p className='text-sm text-gray-600'>Happy customers</p>
          </div>
          <div>
            <p className='text-2xl font-bold'>4.9</p>
            <p className='text-sm text-gray-600'>Average rating</p>
          </div>
          <div>
            <p className='text-2xl font-bold'>2k+</p>
            <p className='text-sm text-gray-600'>Orders delivered</p>
          </div>
        </div>
      </section>

      <NewsletterBox />
    </div>
  )
}

export default About