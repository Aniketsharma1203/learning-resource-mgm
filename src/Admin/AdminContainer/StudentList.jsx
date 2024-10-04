import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/Firebase';
import { MdDashboard } from "react-icons/md";
import { GiBookshelf } from "react-icons/gi";
import { FcAbout } from "react-icons/fc";
import { IoLogOut } from "react-icons/io5";
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth } from '../../firebase/Firebase';
import TeachersStudents from '../TeachersStudents';
import Announcements from '../Announcements';
import { FaChalkboardTeacher, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { RiArrowGoBackLine } from "react-icons/ri";

const StudentList = () => {
    const [studentUids, setUids] = useState([]);
    const [studentInfo, setInfo] = useState([]);
    const [expandedStudent, setexpandedStudent] = useState(null); // State to manage expanded teacher details
    const [expandedCourses, setExpandedCourses] = useState(null); // State to manage expanded courses
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

    const getAllUids = async () => {
        try {
            const uidRef = collection(db, "student");
            const teacherSnapshot = await getDocs(uidRef);
            const uids = teacherSnapshot.docs.map((doc) => doc.id);
            setUids(uids);
        } catch (error) {
            console.log(error.message);
        }
    };

    console.log(studentInfo);

    const getAllnames = async () => {
        try {
            const teacherData = await Promise.all(
                studentUids.map(async (uid) => {
                    const teacherRef = doc(db, "student", uid);
                    const teachersnapshot = await getDoc(teacherRef);
                    if (teachersnapshot.exists()) {
                        return teachersnapshot.data();
                    } else {
                        console.log('No such document!');
                        return null;
                    }
                })
            );
            setInfo(teacherData.filter(data => data !== null));
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getAllUids();
    }, []);

    useEffect(() => {
        if (studentUids.length > 0) {
            getAllnames();
        }
    }, [studentUids]);

    // Function to toggle the expansion of a teacher card
    const toggleExpand = (index) => {
        setexpandedStudent(index);
    };

    // Function to toggle the expansion of courses within a teacher's card
    const toggleCourses = (index) => {
        setExpandedCourses(expandedCourses === index ? null : index);
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
                    {state === "Dashboard" && (
                        <div>
                            <h1 className="text-3xl font-semibold mb-8">Students List</h1>
                            <div className="grid grid-cols-3 gap-6">
                                {studentInfo.map((teacher, index) => (
                                    <div
                                        key={index}
                                        className="bg-white p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
                                        onClick={() => toggleExpand(index)}
                                    >
                                        <FaChalkboardTeacher className="text-4xl mb-4 text-blue-600" />
                                        <h3 className="text-xl font-medium">{teacher.name}</h3>

                                        {expandedStudent === index && (
                                            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                                <p><strong>Email:</strong> {teacher.email}</p>
                                                <p><strong>Role:</strong> {teacher.role}</p>

                                                <div
                                                    className="flex items-center justify-between mt-4 cursor-pointer"
                                                    onClick={() => toggleCourses(index)}
                                                >
                                                    <strong>Courses</strong>
                                                    {expandedCourses === index ? (
                                                        <FaChevronUp size={12} />
                                                    ) : (
                                                        <FaChevronDown size={12} />
                                                    )}
                                                </div>

                                                {expandedCourses === index && (
                                                    <div className="mt-2 p-2 bg-white rounded-lg shadow-inner">
                                                        {teacher.EnrolledCourses
                                                            && teacher.EnrolledCourses
                                                                .length > 0 ? (
                                                            <ul className="list-disc list-inside">
                                                                {teacher.EnrolledCourses.map((course, courseIndex) => (
                                                                    <li key={courseIndex} className="text-gray-700">
                                                                        {course.name}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-gray-500">No courses available</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
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
    );
}

export default StudentList
