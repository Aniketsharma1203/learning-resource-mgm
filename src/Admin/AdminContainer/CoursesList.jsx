import React, { useContext, useState, useEffect } from 'react';
import { db } from '../../firebase/Firebase';
import { FaChalkboardTeacher, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { RiArrowGoBackLine } from "react-icons/ri";
import TeachersStudents from '../TeachersStudents';
import Announcements from '../Announcements';
import { MdDashboard } from "react-icons/md";
import { GiBookshelf } from "react-icons/gi";
import { FcAbout } from "react-icons/fc";
import { IoLogOut } from "react-icons/io5";
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/Firebase';
import { toast } from 'react-toastify';

import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const CoursesList = () => {
  const [courseUids, setCourseUids] = useState([]);
  const [courses, setCourses] = useState([]);
  const [state, isActive] = useState("Dashboard");
  const navigate = useNavigate();

  const getAllUids = async () => {
    try {
      const teacherUidRef = collection(db, 'teacher');
      const teacherSnapshot = await getDocs(teacherUidRef);
      const uids = teacherSnapshot.docs.map((doc) => doc.id);
      setCourseUids(uids); // Update state with UIDs
    } catch (error) {
      console.error('Error fetching course UIDs: ', error);
    }
    getAllCourses();
  };

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

  // Fetch courses for each UID
  const getAllCourses = async () => {
    try {
      let coursesList = [];
      for (const uid of courseUids) {
        const docRef = doc(db, 'teacher', uid);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          // Append courses for each teacher to the list
          coursesList = [...coursesList, ...data.courses]; // Assuming data.courses is an array
        } else {
          console.log('No such document!');
        }
      }
      setCourses(coursesList);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    getAllUids();
  }, [])

  useEffect(() => {
    if (courseUids.length > 0) {
      getAllCourses();
    }
  }, [courseUids])

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
          {state === "Dashboard" && (
            <div>
              <h1 className="text-3xl font-semibold mb-8">Courses List</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                {courses.map((course, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-auto"
                  >
                    <img
                      src={course.img}
                      alt={course.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-2xl font-semibold text-gray-800">{course.name}</h3>
                    <p className="text-gray-600 mt-2 ">
                      <strong>Teacher:</strong> {course.Author}
                    </p>
                    <p className="text-gray-600 mt-2">
                      <strong>Price:</strong> {course.price}
                    </p>
                    <p className="text-gray-600 mt-2">
                      <strong>Description:</strong> {course.desc}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          )}
          {state === 'Courses' && <TeachersStudents />}
          {state === 'About' && <Announcements />}
        </div>


        <button className='bg-red-400 font-semibold text-2xl flex flex-col justify-center items-center gap-1' onClick={() => navigate('/admin')}>Go Back <span> <RiArrowGoBackLine /></span></button>


      </div>
    </div>
  )
}

export default CoursesList
