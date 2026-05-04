import React, { useState, useContext } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { ShopContext } from '../context/ShopContext.jsx'
import { useNavigate } from 'react-router-dom'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { token, backendUrl, navigate } = useContext(ShopContext)
  const router = useNavigate()

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!token) {
      setError('Please login to send a message.')
      return
    }

    try {
      const res = await fetch(`${backendUrl}/api/v1/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401) {
          setError(data.message || 'Please login to continue.')
          // optionally redirect to login
          // router('/login')
        } else {
          setError(data.message || 'Failed to send message. Please try again later.')
        }
        return
      }

      setSuccess(data.message || 'Thanks — your message has been sent!')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      console.error(err)
      setError('Network error. Please try again later.')
    }
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-8">
      <div className='text-center pt-10 border-t'>
        <Title text1={"CONTACT"} text2={"US"} />
        <p className='mt-3 text-gray-600 max-w-2xl mx-auto'>Have questions? We're here to help. Send us a message or reach out through the contact details below.</p>
      </div>

      <div className='my-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-20'>
        <form onSubmit={handleSubmit} className='space-y-4 bg-white p-6 rounded-lg shadow-sm'>
          {error && <div className='text-red-600 text-sm'>{error}</div>}
          {success && <div className='text-green-600 text-sm'>{success}</div>}
          <input name='name' value={form.name} onChange={handleChange} required placeholder='Full name' className='w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200' />
          <input name='email' value={form.email} onChange={handleChange} required type='email' placeholder='Email address' className='w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200' />

          <input name='subject' value={form.subject} onChange={handleChange} placeholder='Subject' className='w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200' />

          <textarea name='message' value={form.message} onChange={handleChange} required rows={6} placeholder='How can we help?' className='w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200' />

          <div className='flex items-center justify-between'>
            <button type='submit' className='bg-black text-white px-6 py-2 rounded-md'>Send Message</button>
            <p className='text-sm text-gray-500'>We typically reply within 24 hours.</p>
          </div>
        </form>

        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-2 bg-gray-50 p-6 rounded-lg'>
            <h4 className='font-semibold text-lg'>Our Store</h4>
            <p className='text-gray-600'>201031 Noida<br />Noida, U.P.</p>
            <p className='text-gray-600'>Phone: +91 9999 999999<br />Email: quickkart@gmail.com</p>
          </div>

          <div className='flex flex-col gap-2 bg-gray-50 p-6 rounded-lg'>
            <h4 className='font-semibold text-lg'>Careers</h4>
            <p className='text-gray-600'>Interested in joining our team? Send your CV to careers@quickkart.com or explore openings.</p>
            <button className='mt-2 w-max border border-black px-4 py-2 rounded hover:bg-black hover:text-white transition'>Explore Jobs</button>
          </div>


        </div>
      </div>

      <div className='w-full rounded-lg overflow-hidden border'>
        <div className='w-full'>
          <div className='p-4 flex w-full gap-8'>
            <div className='w-1/2'>
              <p className='text-gray-700'>We're right here in Noida — drop by our store or send a message and we'll respond within 24 hours. We love helping customers find the right products.</p>
            </div>

            <div className='w-1/2'>
              <img src={assets.contact_img} alt='Store' className='w-full object-cover h-56 md:h-48' />
            </div>
          </div>
        </div>
      </div>

      <div className='mb-12'>
        <div className='h-44 bg-gray-100 rounded flex items-center justify-center text-gray-500'>
          Map placeholder (replace with embed or map component)
        </div>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default Contact