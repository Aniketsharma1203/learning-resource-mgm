import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigation } from 'react-router-dom';
import { UserContext } from '../context/UseContext';
import { db } from '../firebase/Firebase';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const StudentCourseContainer = () => {
    const { container } = useContext(UserContext);  // Student's details
    const courses = useLocation();
    const data = courses.state.key;
    const { studentEnrolledCourses, setEnrolledCourses } = useContext(UserContext);  // For enrolled courses from Firestore
    const [isEnrolled, setIsEnrolled] = useState(false);  // Check if the student is already enrolled
    const [isPending, setIsPending] = useState(false);  // Check if the enrollment is pending
    const [loading, setLoading] = useState(true);  // Loading state
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the student's enrolled courses and pending requests from Firestore
        const fetchStudentData = async () => {
            try {
                const studentDocRef = doc(db, "student", container[0].id);
                const studentDocSnapshot = await getDoc(studentDocRef);

                if (studentDocSnapshot.exists()) {
                    const studentData = studentDocSnapshot.data();
                    const enrolledCourses = studentData.EnrolledCourses || [];
                    const pendingCourses = studentData.PendingRequests || [];

                    setEnrolledCourses(enrolledCourses);

                    // Check if the current course is enrolled or pending approval
                    const alreadyEnrolled = enrolledCourses.some(course => course.name === data.name);
                    const pendingRequest = pendingCourses.some(course => course.name === data.name);

                    setIsEnrolled(alreadyEnrolled);
                    setIsPending(pendingRequest);
                } else {
                    console.log('Student document not found.');
                }
            } catch (error) {
                console.error('Error fetching student data:', error.message);
            } finally {
                setLoading(false);  // Data fetched
            }
        };

        fetchStudentData();
    }, [container, data.name, setEnrolledCourses]);

    const enrolledCourse = async () => {
        if (isPending || isEnrolled) {
            return;  // Prevent enrolling if the student is already pending or enrolled
        }

        const teacherDocRef = doc(db, "teacher", data.Author);

        try {
            const teacherDocSnapshot = await getDoc(teacherDocRef);

            if (teacherDocSnapshot.exists()) {
                const teacherData = teacherDocSnapshot.data();
                const teacherPendingRequests = teacherData.PendingRequests || [];

                // Create the new enrollment request
                const newRequest = {
                    name: data.name,
                    value: data.value,
                    desc: data.desc,
                    img: data.img,
                    price: data.price,
                    CourseContent: data.CourseContent,
                    requestedBy: container[0].id
                };

                // Update the teacher's pending requests
                const updatedRequests = [...teacherPendingRequests, newRequest];
                await updateDoc(teacherDocRef, { PendingRequests: updatedRequests });

                // Update local state to reflect the pending status
                setIsPending(true);
                toast.success('Request For Enrolled Sent');
            } else {
                console.log('Teacher document not found.');
            }
        } catch (error) {
            console.error('Error sending enrollment request:', error.message);
        }
    };

    const deenrollCourse = async () => {
        const studentDocRef = doc(db, "student", container[0].id);
        try {
            const studentDocSnapshot = await getDoc(studentDocRef);

            if (studentDocSnapshot.exists()) {
                const studentData = studentDocSnapshot.data();
                const enrolledCourses = studentData.EnrolledCourses || [];

                const updatedCourses = enrolledCourses.filter(course => course.name !== data.name);
                await updateDoc(studentDocRef, { EnrolledCourses: updatedCourses });

                // Update local state in context
                setEnrolledCourses(updatedCourses);
                setIsEnrolled(false);
                setIsPending(false);  // In case the user wants to enroll again

                toast.success('Course De-enrolled Successfully');
            } else {
                console.log('Student document not found.');
            }
        } catch (error) {
            console.error('Error de-enrolling course:', error.message);
        }
        navigate('/student');
    };

    // Check for teacher approval (polling or real-time listener can be used here)
    useEffect(() => {
        const checkApproval = async () => {
            if (isPending) {
                const studentDocRef = doc(db, "student", container[0].id);
                const studentDocSnapshot = await getDoc(studentDocRef);

                if (studentDocSnapshot.exists()) {
                    const studentData = studentDocSnapshot.data();
                    const enrolledCourses = studentData.EnrolledCourses || [];

                    // If the course is found in enrolled courses, it means it was accepted
                    const acceptedCourse = enrolledCourses.some(course => course.name === data.name);
                    if (acceptedCourse) {
                        setIsEnrolled(true);
                        setIsPending(false);
                        toast.success('Enrollment Accepted');
                    }
                }
            }
        };

        const interval = setInterval(checkApproval, 5000);  // Poll every 5 seconds
        return () => clearInterval(interval);  // Clean up on unmount
    }, [isPending, container, data.name]);

    if (loading) {
        return <div>Loading...</div>;  // Display loading state while fetching data
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            {/* Course Details Section */}
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden relative">
                <img
                    src={data.img}
                    alt={data.name}
                    className="w-full h-64 object-cover"
                />
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{data.name}</h2>
                    <p className="text-gray-700 text-base mb-4">{data.desc}</p>

                    {/* Price and Lessons Info */}
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-lg font-semibold text-green-600">${data.price}</p>
                        <p className="text-gray-600">{data.value} Lessons</p>
                    </div>

                    {/* Course Content */}
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Course Content</h3>

                    {/* Grid for course content (images, videos, files) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {data.CourseContent.map((content, index) => (
                            <div key={index} className="bg-gray-800 rounded-lg overflow-hidden p-4">
                                {content.endsWith('.jpg') || content.endsWith('.png') || content.endsWith('.jpeg') ? (
                                    <a href={content} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        View File
                                    </a>
                                ) : content.includes('.mp4') ? (
                                    <video controls className="w-full h-48 object-cover" src={content} typeof="video/mp4">
                                        <source src={content} type="video/mp4" />
                                    </video>
                                ) : (
                                    <a href={content} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        View File
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Enroll/De-enroll Button */}
            <div className="mt-6 text-center">
                {isPending ? (
                    <button className="bg-yellow-500 text-white py-2 px-6 rounded-lg" disabled>
                        Waiting for Acceptance
                    </button>
                ) : isEnrolled ? (
                    <button className="bg-gray-400 text-white py-2 px-6 rounded-lg" onClick={deenrollCourse}>
                        Wants to UnEnroll?
                    </button>
                ) : (
                    <button className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700" onClick={enrolledCourse}>
                        Want to Enroll? Click Here
                    </button>
                )}
            </div>
        </div>
    );
};

export default StudentCourseContainer;
