import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase/Firebase';
import { toast } from 'react-toastify';
import { db } from '../firebase/Firebase';
import { setDoc, doc } from 'firebase/firestore';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignInWithGoogle = () => {

    const navigate = useNavigate();

    const googleLogin = () => {
        const provider = new GoogleAuthProvider();
        try {
            signInWithPopup(auth, provider).then(async (result) => {
              
                if (result.user) {
                    toast.success('User logged in successfully');
                    await setDoc(doc(db, "student", result.user.uid), {
                        email: result.user.email,
                        name: result.user.displayName,
                        role: "student",
                    });
                    navigate('/student');
                }

            })
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
            <div className='hover:cursor-pointer hover:scale-105 hover:duration-300'>
                <img src={require('../pics/sign-in-google.png')} alt="signin" width={200} onClick={googleLogin} />
            </div>
        </div>
    )
}

export default SignInWithGoogle
