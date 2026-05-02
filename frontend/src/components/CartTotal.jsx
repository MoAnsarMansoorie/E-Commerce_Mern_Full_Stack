import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = () => {
    // This component will display the total price of the items in the cart
    const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  const subtotal = getCartAmount();
  const total = subtotal + delivery_fee;

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={"CART"} text2={"TOTAL"} />
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm sm:text-base'>
        <div className='flex justify-between'>
            <p>SubTotal</p>
            <p>{currency} {subtotal}.00</p>
        </div>
        <hr />
        <div className='flex justify-between'>
            <p>Delivery Fee</p>
            <p>{currency} {delivery_fee}.00</p>
        </div>
        <hr />
        <div className='flex justify-between'>
            <p className='font-bold'>Total</p>
            <p className='font-bold'>{currency} {subtotal === 0 ? 0 : total}.00</p>
        </div>
      </div>
    </div>
  );
}

export default CartTotal;
