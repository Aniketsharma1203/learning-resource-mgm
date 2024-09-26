import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UseContext';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase/Firebase';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Dashboard = () => {
    const { container } = useContext(UserContext);
    const [loading, isLoading] = useState(false);
    const date = new Date();
    const formattedDate = date.toLocaleDateString();
    const role = container[0]?.role?.toUpperCase() || 'USER'; // Default role if undefined
    const [courses, setCourses] = useState([]); // courses is now an object

   
    const newCourse = async () => {
        isLoading(true);
        const uid = container[0]?.id; // Ensure uid is defined
        if (!uid) return; // Stop if uid is undefined

        const docRef = doc(db, "teacher", uid);

        try {
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                setCourses(data.courses || {}); // Ensure courses is an object
                isLoading(false);
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error getting document:", error);
        }
    };

    useEffect(() => {
        newCourse();
    }, [container],[courses]); // Add container as a dependency

    return (
        <>
            {
                loading ? (
                    <p>Loading....</p>
                ) : (
                    <div>
                        <div className="p-8 bg-gray-200 flex w-[100%]">
                            <div className='flex flex-col w-[70%]'>
                                <div>
                                    <h1 className='font-semibold text-xl animate-fadeIn'>Dashboard</h1>
                                    <p className='text-sm text-gray-600'>{formattedDate}</p>
                                </div>

                                <div className='mt-8'>
                                    <h3 className='font-semibold text-xl tracking-wide'>New Courses</h3>
                                </div>

                                <div className='flex justify-around mt-4 gap-10 '>
                                    {
                                        courses.length > 0 ? (
                                            courses.map((course,index) => (
                                                <div id={index} className='bg-orange-200 p-4 flex flex-col border rounded-lg'>
                                                    <img src={require("../pics/Web.jfif")} alt="courses"  />
                                                    <p className='font-semibold text-2xl'>{course.name}</p>
                                                    <p className='text-[13px] font-semibold '>{course.value}   lessons</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p >No, Courses Available.</p>
                                        )
                                    }
                                </div>
                            </div>

                            <div className='w-[30%] flex flex-col items-end justify-center gap-2'>
                                <div className='flex'>
                                    <img src={require('../pics/Teacher.png')} alt="teacher" width={90} className='h-14' />
                                    <div className='font-semibold flex flex-col'>
                                        <p>{container[0]?.name}</p>
                                        <p className='text-sm text-gray-600 text-[11px]'>{role}</p>
                                    </div>
                                </div>

                                <div className='w-[270px]'>
                                    <Calendar />
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
