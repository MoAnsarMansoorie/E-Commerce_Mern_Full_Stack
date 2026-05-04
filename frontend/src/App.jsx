
import { lazy, Suspense, useMemo } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchModal from './components/SearchModal'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Collection = lazy(() => import('./pages/Collection'))
const Contact = lazy(() => import('./pages/Contact'))
const Product = lazy(() => import('./pages/Product'))
const Cart = lazy(() => import('./pages/Cart'))
const Login = lazy(() => import('./pages/Login'))
const PlaceOrder = lazy(() => import('./pages/PlaceOrder'))
const Orders = lazy(() => import('./pages/Orders'))
const Verify = lazy(() => import('./pages/Verify'))

const SuspenseFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center text-sm text-slate-500">
    Loading page content...
  </div>
)

function App() {
  const ProtectedRoute = ({ children }) => {
    const isAuthenticated = Boolean(localStorage.getItem('token'))
    return isAuthenticated ? children : <Navigate to="/login" replace />
  }

  const routes = useMemo(() => [
    { path: '/', element: <Home /> },
    { path: '/about', element: <About /> },
    { path: '/collection', element: <Collection /> },
    { path: '/contact', element: <Contact /> },
    { path: '/product/:productId', element: <Product /> },
    { path: '/login', element: <Login /> },
    { path: '/cart', element: <ProtectedRoute><Cart /></ProtectedRoute> },
    { path: '/place-order', element: <ProtectedRoute><PlaceOrder /></ProtectedRoute> },
    { path: '/orders', element: <ProtectedRoute><Orders /></ProtectedRoute> },
    { path: '/verify', element: <ProtectedRoute><Verify /></ProtectedRoute> },
  ], [])

  return (
    <div className='min-h-screen flex flex-col justify-between px-4 sm:px-8 md:px-16 lg:px-24 w-full max-w-[1200px] mx-auto'>
      <ToastContainer position='top-right' autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <Navbar />
      <SearchModal />
      <main id='main-content' className='flex-1'>
        <Suspense fallback={<SuspenseFallback />}>
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            <Route path='*' element={<div className='py-20 text-center text-slate-500'>404: Page not found</div>} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default App
