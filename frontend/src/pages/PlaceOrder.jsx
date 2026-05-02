import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext)
  const [method, setMethod] = useState("cod")
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const initPay = (order) => {
    if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
      toast.error("Missing Razorpay key. Add VITE_RAZORPAY_KEY_ID to frontend/.env.")
      return
    }

    if (!window.Razorpay) {
      toast.error("Razorpay checkout script not loaded.")
      return
    }

    const razorpayOrderId = order?.id || order?.order_id
    const razorpayAmount = order?.amount || order?.amount_due || order?.total_amount
    const razorpayCurrency = order?.currency?.toUpperCase() || "INR"

    if (!order || !razorpayOrderId || !razorpayAmount || !razorpayCurrency) {
      console.error("Invalid Razorpay order returned from backend", order)
      toast.error("Could not initialize Razorpay checkout. Please try again.")
      return
    }

    console.log("Razorpay backend order:", order)
    console.log("Razorpay frontend key:", import.meta.env.VITE_RAZORPAY_KEY_ID)

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      order_id: razorpayOrderId,
      name: "Order Payment",
      description: "Order Razorpay Payment",
      amount: razorpayAmount,
      currency: razorpayCurrency,
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email || "",
        contact: formData.phone || ""
      },
      notes: {
        order_receipt: order.receipt || ""
      },
      theme: {
        color: "#F37021"
      },
      handler: async (response) => {
        console.log("Razorpay response", response)
        try {
          const { data } = await axios.post(`${backendUrl}/api/v1/order/verifyrazorpay`, response, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          if (data.success) {
            toast.success("Payment successful. Redirecting to orders...")
            navigate("/orders")
            setCartItems({})
          } else {
            toast.error(data.message || "Payment verification failed.")
          }
        } catch (error) {
          console.error("Error placing order with Razorpay:", error);
          toast.error(error.response?.data?.message || error.message || "Payment verification failed.")
        }
      },
      modal: {
        ondismiss: () => {
          toast.info("Razorpay checkout closed. Payment not completed.")
        }
      }
    }
    console.log("Razorpay checkout options", options)

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', (response) => {
      console.error('Razorpay payment failed object:', response)
      const err = response.error || {}
      const message = err.description || err.reason || err.code || 'Razorpay payment failed. Please try again.'
      toast.error(message)
    })
    rzp.open()
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (submitting) return;
    // Basic client-side validation
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.street || !formData.city || !formData.zipcode) {
      toast.error('Please complete the required delivery fields.');
      return;
    }
    // Ensure cart has items
    let totalItems = 0;
    for (const k in cartItems) {
      for (const s in cartItems[k]) totalItems += cartItems[k][s] || 0;
    }
    if (totalItems === 0) {
      toast.error('Your cart is empty. Add items before placing an order.');
      return;
    }
    setSubmitting(true);
    try {
      let orderItems = []

      for (const items in cartItems) {
        for (const size in cartItems[items]) {
          if (cartItems[items][size] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = cartItems[items][size];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      const subtotal = getCartAmount();
      const totalAmount = subtotal + delivery_fee;

      let orderData = {
        address: formData,
        items: orderItems,
        amount: totalAmount,
        subtotal,
        delivery_fee
      }

      switch (method) {

        // API calls for cod
        case "cod":
          try {
            // Optionally show a loading indicator here
            const response = await axios.post(
              `${backendUrl}/api/v1/order/placeorder`,
              orderData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log("Order response:", response.data);
            if (response.data.success) {
              toast.success("Order placed successfully!");
              setCartItems({});
              navigate("/");
            } else {
              toast.error(response.data.message || "Failed to place order. Please try again.");
            }
          } catch (error) {
            console.error("Order placement error:", error);
            toast.error(
              error.response?.data?.message ||
              error.message ||
              "Failed to place order. Please try again."
            );
          }
          break;
        
        case "stripe":

          try {
            const responseStripe = await axios.post(
              `${backendUrl}/api/v1/order/stripe`,
              orderData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            if (responseStripe.data.success) {
              setCartItems({});
              const { session_url } = responseStripe.data
              window.location.replace(session_url)
            } else {
              toast.error(responseStripe.data.message)
            }
            
          } catch (error) {
            console.error("Order placement stripe error:", error);
            toast.error(
              error.response?.data?.message ||
              error.message ||
              "Failed to place order. Please try again."
            );
          }

          break;
        
        case "razorpay":
          try {
            const responseRazorpay = await axios.post(
              `${backendUrl}/api/v1/order/razorpay`,
              orderData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if(responseRazorpay.data.success){
              initPay(responseRazorpay.data.order)
            }
            
          } catch (error) {
            console.error("Order placement razorpay error:", error);
            toast.error(
              error.response?.data?.message ||
              error.message ||
              "Failed to place order. Please try again."
            );
          }

          
          break;
        
        default:
          break;  
      }
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setSubmitting(false);
    }

  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col lg:flex-row justify-between gap-8 pt-6 sm:pt-14 min-h-[80vh] border-t'>

      {/* --------------LEFT SIDE---------------- */}
      <div className='flex-1 lg:max-w-[560px]'>

        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <div>
            <label className='text-sm text-gray-600'>First name</label>
            <input name='firstName' value={formData.firstName} onChange={onChangeHandler} className='border border-gray-300 rounded py-2 px-3 w-full mt-1' type='text' placeholder='John' />
          </div>

          <div>
            <label className='text-sm text-gray-600'>Last name</label>
            <input name='lastName' value={formData.lastName} onChange={onChangeHandler} className='border border-gray-300 rounded py-2 px-3 w-full mt-1' type='text' placeholder='Doe' />
          </div>

          <div className='sm:col-span-2'>
            <label className='text-sm text-gray-600'>Email</label>
            <input name='email' value={formData.email} onChange={onChangeHandler} className='border border-gray-300 rounded py-2 px-3 w-full mt-1' type='email' placeholder='you@example.com' />
          </div>

          <div className='sm:col-span-2'>
            <label className='text-sm text-gray-600'>Street address</label>
            <input name='street' value={formData.street} onChange={onChangeHandler} className='border border-gray-300 rounded py-2 px-3 w-full mt-1' type='text' placeholder='123 Main St' />
          </div>

          <div>
            <label className='text-sm text-gray-600'>City</label>
            <input name='city' value={formData.city} onChange={onChangeHandler} className='border border-gray-300 rounded py-2 px-3 w-full mt-1' type='text' placeholder='City' />
          </div>

          <div>
            <label className='text-sm text-gray-600'>State</label>
            <input name='state' value={formData.state} onChange={onChangeHandler} className='border border-gray-300 rounded py-2 px-3 w-full mt-1' type='text' placeholder='State' />
          </div>

          <div>
            <label className='text-sm text-gray-600'>Zip code</label>
            <input name='zipcode' value={formData.zipcode} onChange={onChangeHandler} className='border border-gray-300 rounded py-2 px-3 w-full mt-1' type='text' placeholder='Postal code' />
          </div>

          <div>
            <label className='text-sm text-gray-600'>Country</label>
            <input name='country' value={formData.country} onChange={onChangeHandler} className='border border-gray-300 rounded py-2 px-3 w-full mt-1' type='text' placeholder='Country' />
          </div>

          <div className='sm:col-span-2'>
            <label className='text-sm text-gray-600'>Phone number</label>
            <input name='phone' value={formData.phone} onChange={onChangeHandler} className='border border-gray-300 rounded py-2 px-3 w-full mt-1' type='tel' placeholder='+1 555 555 5555' />
          </div>
        </div>

        <p className='text-sm text-gray-500 mt-3'>We will use this information to deliver your items. By placing an order you agree to our terms.</p>

      </div>

      {/* ------------------Right Side---------------- */}
      <aside className='w-full lg:w-[420px]'>
        <div className='bg-white rounded-md shadow-sm p-5 sticky top-20'>
          <div className='mb-4'>
            <h3 className='text-lg font-semibold'>Order summary</h3>
            <p className='text-sm text-gray-500'>Review items and payment before placing your order.</p>
          </div>

          <div className='mb-4'>
            <CartTotal />
          </div>

          <div className='mb-4'>
            <Title text1={"PAYMENT"} text2={"METHOD"} />
            <div className='mt-3 grid grid-cols-1 gap-3'>
              <button type='button' onClick={() => setMethod('stripe')} className={`flex items-center justify-between p-3 border rounded-md ${method === 'stripe' ? 'border-orange-400 ring-1 ring-orange-100' : ''}`}>
                <div className='flex items-center gap-3'>
                  <img src={assets.stripe_logo} alt='stripe' className='h-6' />
                  <span className='text-sm'>Stripe</span>
                </div>
                {method === 'stripe' && <span className='text-sm text-orange-500'>Selected</span>}
              </button>

              <button type='button' onClick={() => setMethod('razorpay')} className={`flex items-center justify-between p-3 border rounded-md ${method === 'razorpay' ? 'border-orange-400 ring-1 ring-orange-100' : ''}`}>
                <div className='flex items-center gap-3'>
                  <img src={assets.razorpay_logo} alt='razorpay' className='h-6' />
                  <span className='text-sm'>Razorpay</span>
                </div>
                {method === 'razorpay' && <span className='text-sm text-orange-500'>Selected</span>}
              </button>

              <button type='button' onClick={() => setMethod('cod')} className={`flex items-center justify-between p-3 border rounded-md ${method === 'cod' ? 'border-orange-400 ring-1 ring-orange-100' : ''}`}>
                <div className='flex items-center gap-3'>
                  <img src={assets.cod_icon} alt='cod' className='h-6' />
                  <span className='text-sm'>Cash on Delivery</span>
                </div>
                {method === 'cod' && <span className='text-sm text-orange-500'>Selected</span>}
              </button>
            </div>
          </div>

          <div className='mt-4'>
            <button disabled={submitting} type='submit' className={`w-full py-3 rounded-md text-white ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black'}`}>{submitting ? 'Placing order...' : 'Place Order'}</button>
          </div>

          <p className='text-xs text-gray-500 mt-3'>Secure payments. We never store your card details.</p>
        </div>
      </aside>
    </form>
  )
}

export default PlaceOrder