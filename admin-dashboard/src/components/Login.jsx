import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Login = ({setToken}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.post(`${backendUrl}/api/v1/user/admin`, {
                email,
                password
            })
            console.log("Login successful:", response.data);
            if(response.data.token) {
                setToken(response.data.token);
                toast.success("Login successful");
            } else {
                toast.error(response.data.message || "Login failed");
            }

            
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during login");
            
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center w-full'>
            <div className='bg-white shadow-md px-8 py-6 max-w-md'>

                <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>

                <form onSubmit={onSubmitHandler} >

                    <div className='mb-3 min-w-72'>
                        <p className='font-medium text-sm text-gray-700 mb-2'>Email Adddress:</p>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="email" placeholder="Enter your email" required />
                    </div>

                    <div className='mb-3 min-w-72'>
                        <p className='font-medium text-sm text-gray-700 mb-2'>Password:</p>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="password" placeholder="Enter your password" required />
                    </div>

                    <button type='submit' className='bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors duration-200 w-full'>Login</button>

                </form>

            </div>
        </div>
    );
}

export default Login;
