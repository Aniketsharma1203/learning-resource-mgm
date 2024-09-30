import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UseContext';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase/Firebase';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Dashboard = () => {
    const { container } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const date = new Date();
    const formattedDate = date.toLocaleDateString();
    const role = container[0]?.role?.toUpperCase() || 'USER';
    const [courses, setCourses] = useState([]); 

    const newCourse = async () => {
        setLoading(true);
        const uid = container[0]?.id;
        if (!uid) return;

        const docRef = doc(db, "teacher", uid);

        try {
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                setCourses(data.courses || []); 
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error getting document:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        newCourse();
    }, [container]);

    return (
        <>
            {
                loading ? (
                    <div className="flex justify-center items-center h-screen">
                        <p className="text-lg font-bold">Loading...</p>
                    </div>
                ) : (
                    <div className="p-8 bg-gray-50 min-h-screen">
                        <div className="container mx-auto">
                            {/* Main Dashboard Area */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                                {/* Left Side (Courses Overview) */}
                                <div className="md:col-span-2">
                                    <div className="mb-6">
                                        <h1 className="font-bold text-3xl text-gray-800">Dashboard</h1>
                                        <p className="text-gray-600">{formattedDate}</p>
                                    </div>

                                    {/* New Courses Section */}
                                    <div className="mb-10">
                                        <h3 className="font-semibold text-2xl text-gray-700">New Courses</h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                                            {
                                                courses.length > 0 ? (
                                                    courses.slice(0, 3).map((course, index) => (
                                                        <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
                                                            <img src={require("../pics/Web.jfif")} alt="courses" className="rounded-t-md mb-4 w-full h-40 object-cover" />
                                                            <p className="font-semibold text-xl text-gray-800">{course.name}</p>
                                                            <p className="text-sm text-gray-600">{course.value} lessons</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-600 col-span-3">No Courses Available.</p>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side (Profile & Calendar) */}
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <div className="flex items-center mb-6">
                                        <img src={require('../pics/Teacher.png')} alt="teacher" className="w-16 h-16 rounded-full object-cover" />
                                        <div className="ml-4">
                                            <p className="font-semibold text-lg text-gray-800">{container[0]?.name}</p>
                                            <p className="text-sm text-gray-500">{role}</p>
                                        </div>
                                    </div>

                                    {/* Calendar */}
                                    <div className="mb-6">
                                        <Calendar className="w-full rounded-lg shadow-md" />
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-xl text-gray-700 mb-4">All Courses</h4>
                                        <ul className="space-y-4">
                                            {
                                                courses.length > 0 ? (
                                                    courses.map((course, index) => (
                                                        <li key={index} className="bg-orange-100 p-4 rounded-lg flex items-start space-x-4">
                                                            <img src={require("../pics/Web.jfif")} alt="course" className="w-12 h-12 object-cover rounded-md" />
                                                            <div>
                                                                <p className="font-semibold text-lg text-gray-800">{course.name}</p>
                                                                <p className="text-sm text-gray-600">{course.value} lessons</p>
                                                            </div>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-600">No Courses Available.</p>
                                                )
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default Dashboard;
