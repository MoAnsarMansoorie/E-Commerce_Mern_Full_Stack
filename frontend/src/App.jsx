
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Collection from './pages/Collection'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import SearchModal from './components/SearchModal'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'
import { Navigate } from 'react-router-dom'

function App() {
  const ProtectedRoute = ({ children}) => {
    const isAuthenticated = localStorage.getItem('token'); // Example authentication check
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  }

  return (
    // Mobile-first responsive container
    <div className='min-h-screen flex flex-col justify-between px-4 sm:px-8 md:px-16 lg:px-24 w-full max-w-[1200px] mx-auto'>
      <ToastContainer />
      <Navbar /> 
      <SearchModal />
      {/* <SearchBar /> */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        
        <Route path='/login' element={<Login />} />
        
        
        
        <Route path='*' element={<div>404 Not Found</div>} />

        {/* <Route path='/cart' element={<Cart />} /> */}
        {/* <Route path='/place-order' element={<PlaceOrder />} /> */}
        {/* <Route path='/orders' element={<Orders />} /> */}
        {/* <Route path='/verify' element={<Verify />} /> */}

        <Route
          path='/cart'
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path='/place-order'
          element={
            <ProtectedRoute>
              <PlaceOrder />
            </ProtectedRoute>
          }
        />

        <Route
          path='/orders'
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path='/verify'
          element={
            <ProtectedRoute>
              <Verify />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
