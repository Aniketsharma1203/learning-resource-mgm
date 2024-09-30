import React, { useContext, useState, useEffect } from 'react';
import { db } from '../firebase/Firebase';
import { UserContext } from '../context/UseContext';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const StudentCourse = () => {
    const { container } = useContext(UserContext);
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
        return <p>Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h3 className="text-2xl font-semibold mb-6 text-gray-700">All Courses:</h3>
            {courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {courses.map((course, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-200 cursor-pointer"
                            onClick={() => { navigate('/studentcoursecontainer',{state : {key: course}}) }}
                        >
                            <img
                                src={course.img}
                                alt="course img"
                                className="w-full h-40 object-cover rounded-lg mb-4"
                            />
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">{course.name}</h4>
                            <p className="text-gray-600">{course.description}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">No courses available</p>
            )}
        </div>
    );
};

export default StudentCourse;
