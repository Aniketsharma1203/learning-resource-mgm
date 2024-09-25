import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebase/Firebase';
import SignInWithGoogle from './SignInWithGoogle';

const LogIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setEmail(value);
        } else {
            setPassword(value);
        }
    };

    const getDataByUID = async (gmail) => {
        let results = {};

        // Query users collection
        const usersRef = collection(db, "admin");
        const userQuery = query(usersRef, where("email", "==", gmail)); // Corrected to use "email"
        const userSnapshot = await getDocs(userQuery);
        if (userSnapshot.size > 0) {
            results = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }

        // Query orders collection
        if (Object.keys(results).length === 0) {
            const ordersRef = collection(db, "teacher");
            const ordersQuery = query(ordersRef, where("email", "==", gmail)); // Corrected to use "email"
            const ordersSnapshot = await getDocs(ordersQuery);
            if (ordersSnapshot.size > 0) {
                results = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            }
        }

        // Query products collection
        if (Object.keys(results).length === 0) {
            const productsRef = collection(db, "student");
            const productsQuery = query(productsRef, where("email", "==", gmail)); // Corrected to use "email"
            const productsSnapshot = await getDocs(productsQuery);
            if (productsSnapshot.size > 0) {
                results = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            }
        }
    
        navigate(`/${results[0].role}`,{state: results});
        return results;

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('User logged in successfully');

            // Await the data retrieval
            const results = await getDataByUID(auth.currentUser.email);
          

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
        <div>
            <div className='flex w-screen'>
                <div className='relative w-[70%] flex flex-col items-center justify-center'>
                    <h1 className='text-6xl tracking-wide'>Login to Your Account</h1>
                    <p className='text-xl mt-6 opacity-80'>Login using Social Networks</p>

                    <div className='mt-4'>
                    <SignInWithGoogle />
                    </div>

                    <div className="inline-flex items-center">
                        <hr className="w-64 h-1 my-8 bg-gray-200 border-0 rounded dark:bg-gray-700" />
                        <div className="absolute px-4 -translate-x-1/2 bg-white left-1/2 dark:bg-gray-900">
                            <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
                                <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
                            </svg>
                        </div>
                    </div>

                    <form className='flex flex-col gap-10 mt-5 items-center' onSubmit={handleSubmit}>
                        <input type="email" name="email" placeholder='Email' value={email} onChange={handleChange} className='w-[400px] bg-slate-300 p-4 rounded-full font-medium' />
                        <input type="password" name="password" value={password} onChange={handleChange} placeholder='Password' className='w-[400px] bg-slate-300 p-4 rounded-full font-medium' />
                        <button type="submit" className='bg-green-300 w-48 p-2 rounded-full'>Sign In</button>
                    </form>

                    
                </div>

                <div className='w-[30%] h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex justify-center'>
                    <div className='flex flex-col justify-center items-center text-white gap-10'>
                        <h1 className='text-8xl'>New Here?</h1>
                        <p className='leading-loose text-3xl'>Sign up and discover a great <br /> amount of new opportunities!</p>
                        <button className='w-52 font-medium bg-white text-black p-2 rounded-full' onClick={() => navigate('/register')}>Sign Up</button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default LogIn;