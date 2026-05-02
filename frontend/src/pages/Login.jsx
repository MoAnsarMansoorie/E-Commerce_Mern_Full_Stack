import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const [mode, setMode] = useState('signup') // 'signup' | 'login'
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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

  // Social sign-in handlers
  const handleGoogleSignIn = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return toast.error('Google client id not configured');

    // Load script if not loaded
    if (!window.google) {
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.defer = true;
      s.onload = () => {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCallback
        });
        window.google.accounts.id.prompt();
      };
      document.head.appendChild(s);
      return;
    }

    // If already loaded, prompt
    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCallback
      });
      window.google.accounts.id.prompt();
    } catch (error) {
      console.error('Google SDK error', error);
      toast.error('Google sign-in failed');
    }
  }

  const handleGoogleCallback = async (response) => {
    // response.credential is the id_token
    try {
      setIsSubmitting(true)
      const res = await axios.post(`${backendUrl}/api/v1/user/oauth`, { provider: 'google', idToken: response.credential });
      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
      } else {
        toast.error(res.data.message || 'Google sign-in failed');
      }
    } catch (error) {
      console.error('Google sign-in error', error);
      toast.error('Google sign-in failed');
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFacebookSignIn = async () => {
    const appId = import.meta.env.VITE_FACEBOOK_APP_ID;
    if (!appId) return toast.error('Facebook app id not configured');

    // Load FB SDK if not already
    if (!window.FB) {
      const s = document.createElement('script');
      s.src = 'https://connect.facebook.net/en_US/sdk.js';
      s.async = true;
      s.onload = () => {
        window.FB.init({
          appId: appId,
          cookie: true,
          xfbml: false,
          version: 'v16.0'
        });
        fbLogin();
      };
      document.head.appendChild(s);
      return;
    }

    fbLogin();
  }

  const fbLogin = () => {
    window.FB.login(async (response) => {
      if (response.authResponse) {
        const accessToken = response.authResponse.accessToken;
        try {
          setIsSubmitting(true)
          const res = await axios.post(`${backendUrl}/api/v1/user/oauth`, { provider: 'facebook', accessToken });
          if (res.data.success) {
            setToken(res.data.token);
            localStorage.setItem('token', res.data.token);
          } else {
            toast.error(res.data.message || 'Facebook sign-in failed');
          }
        } catch (error) {
          console.error('Facebook sign-in error', error);
          toast.error('Facebook sign-in failed');
        } finally {
          setIsSubmitting(false)
        }
      } else {
        toast.error('Facebook login cancelled');
      }
    }, { scope: 'email' });
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 sm:p-8">
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h1 className='text-xl sm:text-2xl font-semibold text-gray-800'>{mode === 'signup' ? 'Create account' : 'Welcome back'}</h1>
            <p className='text-xs text-gray-500 mt-1'>Sign {mode === 'signup' ? 'up to get started' : 'in to continue to your account'}</p>
          </div>

          <div className='flex gap-2 items-center'>
            <button
              onClick={() => setMode('login')}
              className={`px-3 py-1 rounded-md text-sm ${mode === 'login' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Log In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`px-3 py-1 rounded-md text-sm ${mode === 'signup' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Sign Up
            </button>
          </div>
        </div>

        <form onSubmit={submitHandler} className='flex flex-col gap-3'>
          {mode === 'signup' && (
            <label className='flex flex-col text-sm text-gray-700'>
              <span className='mb-1'>Full name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} type='text' className='w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300' placeholder='John Doe' required />
            </label>
          )}

          <label className='flex flex-col text-sm text-gray-700'>
            <span className='mb-1'>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' className='w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300' placeholder='you@example.com' required />
          </label>

          <label className='flex flex-col text-sm text-gray-700 relative'>
            <span className='mb-1'>Password</span>
            <div className='flex items-center gap-2'>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} className='w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300' placeholder='Enter password' required />
              <button type='button' onClick={() => setShowPassword(p => !p)} className='text-sm text-gray-600 px-2'>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <div className='flex items-center justify-between text-xs text-gray-500'>
            <button type='button' className='text-sm text-blue-600 hover:underline' onClick={() => toast.info('Forgot password flow not implemented')}>Forgot password?</button>
            <p>
              {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
              <button type='button' onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} className='text-blue-600 hover:underline ml-1'>
                {mode === 'signup' ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </div>

          <button disabled={isSubmitting} className={`w-full mt-2 py-2 rounded-md text-white font-medium ${isSubmitting ? 'bg-gray-400' : 'bg-gradient-to-r from-gray-900 to-black'}`}>
            {isSubmitting ? <span className='flex items-center justify-center gap-2'><svg className='w-4 h-4 animate-spin' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'><circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle><path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'></path></svg> Processing</span> : (mode === 'signup' ? 'Create account' : 'Sign in')}
          </button>

          <div className='mt-3 text-center text-sm text-gray-500'>
            Or continue with
            <div className='flex gap-3 justify-center mt-3'>
              <button type='button' onClick={() => handleGoogleSignIn()} className='px-3 py-2 rounded-md bg-white border text-sm shadow-sm flex items-center gap-2'>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className='w-4' />
                Google
              </button>
              <button type='button' onClick={() => handleFacebookSignIn()} className='px-3 py-2 rounded-md bg-white border text-sm shadow-sm flex items-center gap-2'>
                <img src="https://www.facebook.com/images/fb_icon_325x325.png" alt="Facebook" className='w-4 rounded-sm' />
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