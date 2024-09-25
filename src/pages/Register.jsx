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
                    courses:[],
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
            toast.success('Account Created Succesfully', {
            });
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
        <div className='w-screen h-screen bg-slate-400 flex justify-center items-center'>

            <div className='w-[60%] bg-white h-[50%] rounded-lg border p-5'>

                <h3 className='text-center font-medium text-2xl m-1'>Create Account</h3>
                <form onSubmit={handleSubmit}>
                    <div className='flex items-center justify-around mt-10'>
                        <div>
                            <label htmlFor="name" className='flex opacity-90'>your name <MdOutlineStar size={7} color='red' /></label>
                            <input type="text" name='name' value={name} placeholder='Name' onChange={handleChange} className='border rounded-lg h-10 w-[400px] p-2 bg-gray-300 text-black font-medium border-gray-300' />
                        </div>

                        <div>
                            <label htmlFor="password" className='flex opacity-90'>your password <MdOutlineStar size={7} color='red' /></label>
                            <input type="password" name='password' value={password} placeholder='Password' onChange={handleChange} className='border rounded-lg h-10 w-[400px] p-2 bg-gray-300 text-black font-medium border-gray-300' />
                        </div>
                    </div>

                    <div className='flex items-center justify-around mt-10'>
                        <div>
                            <label htmlFor="email" className='flex opacity-90'>your email <MdOutlineStar size={7} color='red' /></label>
                            <input type="email" name='email' value={email} placeholder='email' onChange={handleChange} className='border rounded-lg h-10 w-[400px] p-2 bg-gray-300 text-black font-medium border-gray-300' />
                        </div>

                        <div>
                            <label htmlFor="role" className='flex opacity-90'>your profession <MdOutlineStar size={7} color='red' /></label>
                            <select name="role" className='border rounded-lg h-10 w-[400px] p-2 bg-gray-300 text-black font-medium border-gray-300' value={role} onChange={handleChange}>
                                <option value="" disabled>Select your profession</option>
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    <p className='text-center mt-10'>Already have an account? <a href="/login" className='text-blue-400 underline'>Click here</a></p>

                    <div className='flex items-center justify-center mt-10'>
                        <button type="submit" className='bg-green-300 p-4 font-medium border rounded-lg'>Register Now</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;