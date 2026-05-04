import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Button from '../components/ui/Button'

const Login = () => {
  const [mode, setMode] = useState('signup')
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const submitHandler = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (mode === 'signup') {
        const response = await axios.post(`${backendUrl}/api/v1/user/register`, { name, email, password })
        if (response.data?.success) {
          toast.success(response.data.message || 'Registered successfully')
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message || 'Failed to register')
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/v1/user/login`, { email, password })
        if (response.data?.success) {
          toast.success(response.data.message || 'Logged in successfully')
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message || 'Invalid credentials')
        }
      }
    } catch (error) {
      console.error('Error during form submission:', error)
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (token) navigate('/')
  }, [token, navigate])

  const handleGoogleSignIn = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) return toast.error('Google client id not configured')

    if (!window.google) {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCallback,
        })
        window.google.accounts.id.prompt()
      }
      document.head.appendChild(script)
      return
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCallback,
      })
      window.google.accounts.id.prompt()
    } catch (error) {
      console.error('Google SDK error', error)
      toast.error('Google sign-in failed')
    }
  }

  const handleGoogleCallback = async (response) => {
    try {
      setIsSubmitting(true)
      const res = await axios.post(`${backendUrl}/api/v1/user/oauth`, { provider: 'google', idToken: response.credential })
      if (res.data.success) {
        setToken(res.data.token)
        localStorage.setItem('token', res.data.token)
      } else {
        toast.error(res.data.message || 'Google sign-in failed')
      }
    } catch (error) {
      console.error('Google sign-in error', error)
      toast.error('Google sign-in failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFacebookSignIn = async () => {
    const appId = import.meta.env.VITE_FACEBOOK_APP_ID
    if (!appId) return toast.error('Facebook app id not configured')

    if (!window.FB) {
      const script = document.createElement('script')
      script.src = 'https://connect.facebook.net/en_US/sdk.js'
      script.async = true
      script.onload = () => {
        window.FB.init({
          appId,
          cookie: true,
          xfbml: false,
          version: 'v16.0',
        })
        fbLogin()
      }
      document.head.appendChild(script)
      return
    }

    fbLogin()
  }

  const fbLogin = () => {
    window.FB.login(
      async (response) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken
          try {
            setIsSubmitting(true)
            const res = await axios.post(`${backendUrl}/api/v1/user/oauth`, { provider: 'facebook', accessToken })
            if (res.data.success) {
              setToken(res.data.token)
              localStorage.setItem('token', res.data.token)
            } else {
              toast.error(res.data.message || 'Facebook sign-in failed')
            }
          } catch (error) {
            console.error('Facebook sign-in error', error)
            toast.error('Facebook sign-in failed')
          } finally {
            setIsSubmitting(false)
          }
        } else {
          toast.error('Facebook login cancelled')
        }
      },
      { scope: 'email' }
    )
  }

  return (
    <div className='min-h-[70vh] flex items-center justify-center px-4 py-10'>
      <div className='w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-6 shadow-lg sm:p-8'>
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-2xl font-semibold text-slate-900'>{mode === 'signup' ? 'Create account' : 'Welcome back'}</h1>
            <p className='mt-1 text-sm text-slate-500'>Sign {mode === 'signup' ? 'up to get started' : 'in to continue to your account'}</p>
          </div>
          <div className='flex gap-2'>
            <button type='button' onClick={() => setMode('login')} className={`rounded-2xl px-4 py-2 text-sm transition ${mode === 'login' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              Log In
            </button>
            <button type='button' onClick={() => setMode('signup')} className={`rounded-2xl px-4 py-2 text-sm transition ${mode === 'signup' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              Sign Up
            </button>
          </div>
        </div>

        <form onSubmit={submitHandler} className='space-y-4'>
          {mode === 'signup' && (
            <label className='block text-sm font-medium text-slate-700'>
              <span className='mb-2 block'>Full name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type='text'
                className='w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
                placeholder='John Doe'
                required
              />
            </label>
          )}

          <label className='block text-sm font-medium text-slate-700'>
            <span className='mb-2 block'>Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type='email'
              className='w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
              placeholder='you@example.com'
              required
            />
          </label>

          <label className='block text-sm font-medium text-slate-700'>
            <span className='mb-2 block'>Password</span>
            <div className='relative'>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                className='w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
                placeholder='Enter password'
                required
              />
              <button
                type='button'
                onClick={() => setShowPassword((current) => !current)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 hover:text-slate-700'
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <div className='flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between'>
            <button type='button' onClick={() => toast.info('Forgot password flow not implemented')} className='text-slate-600 hover:text-slate-900'>Forgot password?</button>
            <p>
              {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button type='button' onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} className='text-slate-900 underline-offset-4 hover:underline'>
                {mode === 'signup' ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </div>

          <Button type='submit' disabled={isSubmitting} className='w-full'>
            {isSubmitting ? (
              <span className='flex items-center justify-center gap-2'>
                <svg className='h-4 w-4 animate-spin' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
                </svg>
                Processing
              </span>
            ) : mode === 'signup' ? 'Create account' : 'Sign in'}
          </Button>

          <div className='text-center text-sm text-slate-500'>
            <p>Or continue with</p>
            <div className='mt-3 flex gap-3 justify-center'>
              <button type='button' onClick={handleGoogleSignIn} className='inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50'>
                <img src='https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg' alt='Google logo' className='h-4 w-4' />
                Google
              </button>
              <button type='button' onClick={handleFacebookSignIn} className='inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50'>
                <img src='https://www.facebook.com/images/fb_icon_325x325.png' alt='Facebook logo' className='h-4 w-4 rounded-sm' />
                Facebook
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login