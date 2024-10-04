import React, { useState } from 'react';
import { MdDashboard } from "react-icons/md";
import { GiBookshelf } from "react-icons/gi";
import { FcAbout } from "react-icons/fc";
import { IoLogOut } from "react-icons/io5";
import { auth } from '../firebase/Firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminDashboard from '../Admin/AdminDashboard';
import TeachersStudents from '../Admin/TeachersStudents';
import Announcements from '../Admin/Announcements';

const Admin = () => {
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
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="w-[90vw] h-[80vh] flex bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Sidebar */}
        <div className="w-[20%] bg-gray-800 text-white flex flex-col items-center p-6 space-y-10">
          {/* Logo */}
          <img
            src="https://www.aronwebsolutions.com/public/uploads/Aron_Logo-2.svg"
            alt="Logo"
            className="w-72 mb-6 bg-white p-4"
          />

          {/* Sidebar Links */}
          <div
            className={`flex items-center gap-2 text-lg p-4 w-full hover:bg-gray-700 rounded-lg cursor-pointer ${state === 'Dashboard' && 'bg-gray-700'}`}
            onClick={() => isActive("Dashboard")}
          >
            <MdDashboard className="text-2xl" />
            <span>Dashboard</span>
          </div>

          <div
            className={`flex items-center gap-2 text-lg p-4 w-full hover:bg-gray-700 rounded-lg cursor-pointer ${state === 'Courses' && 'bg-gray-700'}`}
            onClick={() => isActive("Courses")}
          >
            <GiBookshelf className="text-2xl" />
            <span>Teachers & Students</span>
          </div>

          <div
            className={`flex items-center gap-2 text-lg p-4 w-full hover:bg-gray-700 rounded-lg cursor-pointer ${state === 'About' && 'bg-gray-700'}`}
            onClick={() => isActive("About")}
          >
            <FcAbout className="text-2xl" />
            <span>Announcements</span>
          </div>

          <div
            className="flex items-center gap-2 text-lg p-4 w-full hover:bg-red-500 rounded-lg cursor-pointer"
            onClick={handleLogout}
          >
            <IoLogOut className="text-2xl" />
            <span>Log Out</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-[80%] bg-gray-100 p-8 overflow-y-auto">
          {state === 'Dashboard' && <AdminDashboard />}
          {state === 'Courses' && <TeachersStudents />}
          {state === 'About' && <Announcements />}
        </div>
      </div>
    </div>
  );
}

export default Admin
