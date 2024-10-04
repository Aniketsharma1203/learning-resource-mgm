import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UseContext';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/Firebase';
import SignInWithGoogle from './SignInWithGoogle';

const LogIn = () => {
    const { setcontainer } = useContext(UserContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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

        const usersRef = collection(db, 'admin');
        const userQuery = query(usersRef, where('email', '==', gmail));
        const userSnapshot = await getDocs(userQuery);
        if (userSnapshot.size > 0) {
            results = userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        }

        if (Object.keys(results).length === 0) {
            const ordersRef = collection(db, 'teacher');
            const ordersQuery = query(ordersRef, where('email', '==', gmail));
            const ordersSnapshot = await getDocs(ordersQuery);
            if (ordersSnapshot.size > 0) {
                results = ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            }
        }

        if (Object.keys(results).length === 0) {
            const productsRef = collection(db, 'student');
            const productsQuery = query(productsRef, where('email', '==', gmail));
            const productsSnapshot = await getDocs(productsQuery);
            if (productsSnapshot.size > 0) {
                results = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            }
        }

        navigate(`/${results[0].role}`);

        if (results) {
            setcontainer(results);
        }

        return results;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('User logged in successfully');

            const results = await getDataByUID(auth.currentUser.email);
        } catch (error) {
            toast.error(error.message, {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
            });
        }
    };

    return (
        <div className="flex w-full h-screen bg-gradient-to-r from-indigo-500 to-purple-500 justify-center items-center">
            <div className="flex flex-col md:flex-row w-11/12 lg:w-10/12 shadow-lg rounded-3xl overflow-hidden bg-white">
                {/* Left Section */}
                <div className="relative w-full md:w-[60%] flex flex-col items-center justify-center py-12 px-6 bg-gray-50">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800">Login to Your Account</h1>
                    <p className="text-lg md:text-xl mt-4 mb-8 opacity-80">Login using Social Networks</p>

                    <div className="w-full flex justify-center">
                        <SignInWithGoogle />
                    </div>

                    <div className="inline-flex items-center justify-center mt-8 w-full">
                        <div className="w-full h-[1px] bg-gray-300"></div>
                        <span className="absolute bg-gray-50 text-gray-400 px-2">OR</span>
                    </div>

                    <form className="flex flex-col gap-6 mt-6 items-center w-full" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={handleChange}
                            className="w-[90%] md:w-[400px] bg-white p-4 rounded-full text-sm md:text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-[90%] md:w-[400px] bg-white p-4 rounded-full text-sm md:text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                        <button
                            type="submit"
                            className="bg-purple-600 text-white font-bold w-48 p-3 rounded-full shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105 focus:outline-none"
                        >
                            Sign In
                        </button>
                    </form>
                </div>

                {/* Right Section */}
                <div className="w-full  md:w-[40%] h-[90vh] bg-gradient-to-br from-pink-400 to-red-500 flex flex-col justify-center items-center text-white p-6 md:p-12">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">New Here?</h1>
                    <p className="text-lg md:text-2xl text-center mb-6">
                        Sign up and discover a world of opportunities!
                    </p>
                    <button
                        className="w-40 md:w-52 bg-white text-pink-600 font-bold p-3 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all focus:outline-none"
                        onClick={() => navigate('/register')}
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogIn;
