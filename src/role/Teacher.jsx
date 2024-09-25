import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MdDashboard } from "react-icons/md";
import { GiBookshelf } from "react-icons/gi";
import { FcAbout } from "react-icons/fc";
import { IoLogOut } from "react-icons/io5";
import Dashboard from '../teacher/Dashboard';
import Courses from '../teacher/Courses';
import About from '../teacher/About';

const Teacher = () => {

  const navigate = useLocation();
  console.log(navigate.state);

  const [state, isActive] = useState("Dashboard");
  console.log(state);


  return (
    <div className='p-10 bg-slate-400 overflow-hidden h-screen w-screen flex justify-center items-center'>
      <div className='w-[90vw] h-[90vh] flex bg-white border rounded-lg'>

        <div className='w-[20%] flex flex-col justify-around items-center  px-2'>
          <img src="https://www.aronwebsolutions.com/public/uploads/Aron_Logo-2.svg" alt="aron" className='p-4' />

          <div className='flex items-center gap-2 text-xl ' onClick={() => { isActive("Dashboard") }}>
            <MdDashboard />
            Dashboard
          </div>

          <div className='flex items-center gap-2 text-xl' onClick={() => { isActive("Courses") }}>
            <GiBookshelf />
            Courses
          </div>

          <div className='flex items-center gap-2 text-xl' onClick={() => { isActive("About") }}>
            <FcAbout />
            About
          </div>

          <div className='flex items-center gap-2 text-xl'>
            <IoLogOut />
            LogOut
          </div>

        </div>

        <div className='w-[80%] bg-slate-200'>
          {
            (state === 'Dashboard')&&(
              <div>
                <Dashboard />
              </div>
            )
          }
          {
            (state === 'Courses')&&(
              <div>
                <Courses />
              </div>
            )
          }
          {
            (state === 'About')&&(
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
