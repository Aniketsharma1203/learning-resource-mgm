import React, { useContext, useState, useEffect } from 'react';
import { db } from '../firebase/Firebase';
import { UserContext } from '../context/UseContext';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const StudentCourse = () => {
    const { studentEnrolledCourses } = useContext(UserContext);

    const [courseUids, setCourseUids] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch all UIDs of teachers
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllUids();
    }, []);

    // Fetch courses after courseUids are set
    useEffect(() => {
        if (courseUids.length > 0) {
            getAllCourses();
        }
    }, [courseUids]);

    if (loading) {
        return <p className="text-center text-gray-700">Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* All Courses Section */}
                <div className="lg:col-span-2">
                    <h3 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">All Courses</h3>
                    {courses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
                            {courses.map((course, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                    onClick={() => { navigate('/studentcoursecontainer', { state: { key: course } }) }}
                                >
                                    <img
                                        src={course.img}
                                        alt="course img"
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                    <h4 className="text-xl font-semibold text-gray-800 mb-2">{course.name}</h4>
                                    <p className="text-gray-600 line-clamp-3">{course.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center">No courses available</p>
                    )}
                </div>

                {/* Enrolled Courses Section */}
                <div className="bg-white rounded-lg shadow-lg p-8 h-fit">
                    <h3 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">Enrolled Courses</h3>
                    {studentEnrolledCourses.length > 0 ? (
                        <div className="space-y-6">
                            {studentEnrolledCourses.map((course, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-100 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                    onClick={() => { navigate('/studentcoursecontainer', { state: { key: course } }) }}
                                >
                                    <img
                                        src={course.img}
                                        alt="course img"
                                        className="w-full h-36 object-cover rounded-lg mb-4"
                                    />
                                    <h4 className="text-xl font-semibold text-gray-800 mb-2">{course.name}</h4>
                                    <p className="text-gray-600">{course.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">You are not enrolled in any courses yet.</p>
                    )}
                </div>
                
            </div>
        </div>
    );
};

export default StudentCourse;
