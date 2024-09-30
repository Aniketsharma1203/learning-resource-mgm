import React, { useState } from 'react';
import { MdDashboard } from "react-icons/md";
import { GiBookshelf } from "react-icons/gi";
import { FcAbout } from "react-icons/fc";
import { IoLogOut } from "react-icons/io5";
import Dashboard from '../teacher/Dashboard';
import Courses from '../teacher/Courses';
import About from '../teacher/About';
import { auth } from '../firebase/Firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const Teacher = () => {

  const [state, isActive] = useState("Dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate("/");
      toast.success('User logged out successfully');
    }).catch((error) => {

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

    });
  }


  return (
    <div className='p-10 bg-slate-400 overflow-hidden h-screen w-screen flex justify-center items-center'>
      <div className='w-[90vw] h-[70vh] flex bg-white border rounded-lg'>

        <div className='w-[20%] flex flex-col gap-20 items-center p-10'>
          <img src="https://www.aronwebsolutions.com/public/uploads/Aron_Logo-2.svg" alt="aron" className='p-4' />

          <div className='flex items-center gap-2 text-xl hover:cursor-pointer hover:bg-green-300 p-4 rounded-lg' onClick={() => { isActive("Dashboard") }}>
            <MdDashboard />
            Dashboard
          </div>

          <div className='flex items-center gap-2 text-xl hover:cursor-pointer hover:bg-green-300 p-4 rounded-lg' onClick={() => { isActive("Courses") }}>
            <GiBookshelf />
            Courses
          </div>

          <div className='flex items-center gap-2 text-xl hover:cursor-pointer hover:bg-green-300 p-4 rounded-lg' onClick={() => { isActive("About") }}>
            <FcAbout />
            About
          </div>

          <div className='flex items-center gap-2 text-xl hover:cursor-pointer hover:bg-green-300 p-4 rounded-lg' onClick={handleLogout}>
            <IoLogOut />
            LogOut
          </div>

        </div>

        <div className='w-[80%] bg-slate-200 overflow-scroll'>
          {
            (state === 'Dashboard') && (
              <div>
                <Dashboard />
              </div>
            )
          }
          {
            (state === 'Courses') && (
              <div>
                <Courses />
              </div>
            )
          }
          {
            (state === 'About') && (
              <div>
                <About />
              </div>
            )
          }

        </div>

      </div>
    </div>
  )
}

export default Teacher;
