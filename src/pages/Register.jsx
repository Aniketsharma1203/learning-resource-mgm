import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { MdOutlineStar } from "react-icons/md";
import { auth, db } from '../firebase/Firebase';
import { setDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') {
            setName(value);
        } else if (name === 'password') {
            setPassword(value);
        } else if (name === 'role') {
            setRole(value);
        } else {
            setEmail(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (user) {
                await setDoc(doc(db, `${role}`, user.uid), {
                    courses: [],
                    email: user.email,
                    name: name,
                    role: role,
                    password: password,
                });
            }
            setName("");
            setPassword("");
            setEmail("");
            setRole("");
            toast.success('Account Created Succesfully', {});
            navigate('/login');
        } catch (error) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    };

    return (
        <div className='w-screen h-screen bg-gradient-to-r from-gray-300 via-gray-100 to-gray-200 flex justify-center items-center'>
            <div className='w-[60%] bg-white shadow-lg h-[70%] rounded-lg border p-8'>
                <h3 className='text-center font-semibold text-3xl mb-5 text-gray-800'>Create Your Account</h3>
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col md:flex-row justify-between'>
                        <div className='w-full md:w-[48%]'>
                            <label htmlFor="name" className='block text-lg mb-2 opacity-90 text-gray-600'>Your Name <MdOutlineStar size={8} color='red' /></label>
                            <input type="text" name='name' value={name} placeholder='Enter your name' onChange={handleChange} className='border rounded-lg h-12 w-full px-4 bg-gray-100 text-gray-700 font-medium focus:border-gray-400 focus:ring-2 focus:ring-gray-300 transition-all' />
                        </div>
                        <div className='w-full md:w-[48%] mt-6 md:mt-0'>
                            <label htmlFor="password" className='block text-lg mb-2 opacity-90 text-gray-600'>Your Password <MdOutlineStar size={8} color='red' /></label>
                            <input type="password" name='password' value={password} placeholder='Enter your password' onChange={handleChange} className='border rounded-lg h-12 w-full px-4 bg-gray-100 text-gray-700 font-medium focus:border-gray-400 focus:ring-2 focus:ring-gray-300 transition-all' />
                        </div>
                    </div>

                    <div className='flex flex-col md:flex-row justify-between mt-6'>
                        <div className='w-full md:w-[48%]'>
                            <label htmlFor="email" className='block text-lg mb-2 opacity-90 text-gray-600'>Your Email <MdOutlineStar size={8} color='red' /></label>
                            <input type="email" name='email' value={email} placeholder='Enter your email' onChange={handleChange} className='border rounded-lg h-12 w-full px-4 bg-gray-100 text-gray-700 font-medium focus:border-gray-400 focus:ring-2 focus:ring-gray-300 transition-all' />
                        </div>
                        <div className='w-full md:w-[48%] mt-6 md:mt-0'>
                            <label htmlFor="role" className='block text-lg mb-2 opacity-90 text-gray-600'>Your Profession <MdOutlineStar size={8} color='red' /></label>
                            <select name="role" value={role} onChange={handleChange} className='border rounded-lg h-12 w-full px-4 bg-gray-100 text-gray-700 font-medium focus:border-gray-400 focus:ring-2 focus:ring-gray-300 transition-all'>
                                <option value="" disabled>Select your profession</option>
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    <p className='text-center mt-8 text-gray-600'>Already have an account? <a href="/login" className='text-blue-500 hover:text-blue-700 underline'>Click here</a></p>

                    <div className='flex items-center justify-center mt-10'>
                        <button type="submit" className='bg-gradient-to-r from-green-400 to-green-500 hover:bg-green-600 text-white py-3 px-8 font-semibold border rounded-lg shadow-md hover:shadow-lg transition-all'>
                            Register Now
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
