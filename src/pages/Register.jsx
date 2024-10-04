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
            toast.success('Account Created Successfully', {});
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
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-300 via-purple-200 to-indigo-300'>
            <div className='w-[80%] max-w-2xl bg-white/70 backdrop-blur-md shadow-xl rounded-xl p-8'>
                <h3 className='text-center font-semibold text-3xl mb-8 text-gray-900'>
                    Create Your Account
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='relative'>
                            <label htmlFor="name" className='block text-lg text-gray-700 mb-2'>
                                Your Name <MdOutlineStar size={8} className="inline-block text-red-500" />
                            </label>
                            <input
                                type="text"
                                name='name'
                                value={name}
                                placeholder='Enter your name'
                                onChange={handleChange}
                                className='w-full h-12 px-4 text-gray-900 bg-white/70 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all'
                            />
                        </div>
                        <div className='relative'>
                            <label htmlFor="password" className='block text-lg text-gray-700 mb-2'>
                                Your Password <MdOutlineStar size={8} className="inline-block text-red-500" />
                            </label>
                            <input
                                type="password"
                                name='password'
                                value={password}
                                placeholder='Enter your password'
                                onChange={handleChange}
                                className='w-full h-12 px-4 text-gray-900 bg-white/70 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all'
                            />
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                        <div className='relative'>
                            <label htmlFor="email" className='block text-lg text-gray-700 mb-2'>
                                Your Email <MdOutlineStar size={8} className="inline-block text-red-500" />
                            </label>
                            <input
                                type="email"
                                name='email'
                                value={email}
                                placeholder='Enter your email'
                                onChange={handleChange}
                                className='w-full h-12 px-4 text-gray-900 bg-white/70 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all'
                            />
                        </div>
                        <div className='relative'>
                            <label htmlFor="role" className='block text-lg text-gray-700 mb-2'>
                                Your Profession <MdOutlineStar size={8} className="inline-block text-red-500" />
                            </label>
                            <select
                                name="role"
                                value={role}
                                onChange={handleChange}
                                className='w-full h-12 px-4 text-gray-900 bg-white/70 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all'>
                                <option value="" disabled>Select your profession</option>
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    <p className='text-center mt-8 text-gray-700'>
                        Already have an account? <a href="/login" className='text-indigo-500 hover:text-indigo-700 underline'>Click here</a>
                    </p>

                    <div className='flex items-center justify-center mt-10'>
                        <button
                            type="submit"
                            className='py-3 px-8 font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 hover:scale-105'>
                            Register Now
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
