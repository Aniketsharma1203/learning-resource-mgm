import React, { useContext, useState } from 'react';
import { CgProfile } from "react-icons/cg";
import { ImHome } from "react-icons/im";
import { GiBookshelf, GiGraduateCap } from "react-icons/gi";
import { PiSignOutBold } from "react-icons/pi";
import { UserContext } from '../context/UseContext';
import StudentHome from '../student/StudentHome';
import StudentCourse from '../student/StudentCourse';
import StudentAcademicInfo from '../student/StudentAcademicInfo';
import { auth } from '../firebase/Firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Student = () => {
  const { container } = useContext(UserContext);
  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const [currentState, setCurrentState] = useState("Home");
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
    <div>
      <div className="min-h-screen flex">

        <div className="w-[20%] bg-gray-900 text-white p-6 space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <CgProfile className="text-6xl text-pink-400" />
            <p className="text-lg font-semibold">{container[0].name}</p>
          </div>

          <nav className="flex flex-col space-y-6 text-gray-300">
            <div className="flex items-center space-x-4 hover:bg-gray-800 p-2 rounded cursor-pointer" onClick={() => { setCurrentState("Home") }}>
              <ImHome className="text-xl" />
              <p className="text-base">Home</p>
            </div>
            <div className="flex items-center space-x-4 hover:bg-gray-800 p-2 rounded cursor-pointer" onClick={() => { setCurrentState("Course Details") }}>
              <GiBookshelf className="text-xl" />
              <p className="text-base">Course Details</p>
            </div>
            <div className="flex items-center space-x-4 hover:bg-gray-800 p-2 rounded cursor-pointer" onClick={() => { setCurrentState("Academic Information") }}>
              <GiGraduateCap className="text-xl" />
              <p className="text-base">Academic Information</p>
            </div>
            <div className="flex items-center space-x-4 hover:bg-red-600 p-2 rounded cursor-pointer" onClick={handleLogout}>
              <PiSignOutBold className="text-xl text-red-400" />
              <p className="text-base">Sign Out</p>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="w-[80%] bg-gray-100">
          {/* Navbar */}
          <div className="bg-gray-100 flex items-center justify-between shadow-md p-6">
            {/* Logo and Dashboard Title */}
            <div className="flex items-center space-x-4">
              <img src="https://doctorialsacademy.com/wp-content/uploads/2024/02/DA-Logo-1024x340.png" alt='logo' width={100} className="object-contain" />
              <p className="text-3xl font-semibold text-gray-700">Student Dashboard</p>
            </div>

            {/* Date and Profile Section */}
            <div className="flex items-center space-x-6">
              {/* Date */}
              <p className="text-gray-600 flex items-center space-x-2">
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-6 8h6m-6 4h4m-9 8h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                {formattedDate}
              </p>

              {/* Profile Icon */}
              <div className="rounded-full bg-pink-200 p-1">
                <CgProfile className="text-3xl text-gray-800" />
              </div>
            </div>
          </div>

          {
            currentState === "Home" && (
              <StudentHome />
            )
          }
          {
            currentState === "Course Details" && (
              <StudentCourse />
            )
          }
          {
            currentState === "Academic Information" && (
              <StudentAcademicInfo />
            )
          }


        </div>
      </div>
    </div>
  );
};

export default Student;
