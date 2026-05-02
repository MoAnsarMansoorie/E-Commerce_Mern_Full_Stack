import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets.js';

const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2'>

      <div className='flex flex-col gap-6 pt-6 pl-[20%] text-[15px]'>

        <NavLink to="/add" className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1">
          <img className='w-5 h-5' src={assets.add_icon} alt="Logo" />
          <p className='hidden md:block'>Add Items</p>
        </NavLink>

        <NavLink to="/list" className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1">
          <img className='w-5 h-5' src={assets.order_icon} alt="Logo" />
          <p className='hidden md:block'>List Items</p>
        </NavLink>

        <NavLink to="/orders" className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1">
          <img className='w-5 h-5' src={assets.order_icon} alt="Logo" />
          <p className='hidden md:block'>Orders</p>
        </NavLink>

        <NavLink to="/whatsapp" className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1">
          <svg className='w-5 h-5' fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04.98-1.04 2.447s.26 2.846.3 3.046c.039.2 1.499 2.547 3.639 3.569.507.264.901.42 1.208.54.511.209 1.247.181 1.812.11.553-.074 1.759-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-3.196 0-5.432 2.236-5.432 5.366 0 1.057.263 2.083.766 3.001L3.635 19.8l3.657-1.08.028.044c.858.393 1.823.115 2.486-.743 1.042-1.318 1.263-3.074.574-4.725-.381-.971-1.196-1.765-2.142-2.175-.946-.41-2.013-.524-3.087-.32-.573.11-1.123.35-1.627.703-.504.353-.93.847-1.251 1.428z" />
          </svg>
          <p className='hidden md:block'>WhatsApp</p>
        </NavLink>

      </div>
    </div>
  );
}

export default Sidebar;
