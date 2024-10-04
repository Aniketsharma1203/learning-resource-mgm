import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UseContext';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/Firebase';

const StudentHome = () => {
    const { container } = useContext(UserContext);
    const { studentEnrolledCourses, setEnrolledCourses } = useContext(UserContext);
    const [announcementContainer, setAnnouncementsContainer] = useState([]);
    const [uids, setUids] = useState([]);
    const navigate = useNavigate();

    const getUids = async () => {
        try {
            const AdminUidRef = collection(db, 'admin');
            const adminSnap = await getDocs(AdminUidRef);
            const uid = adminSnap.docs.map((doc) => doc.id);
            setUids(uid);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getUids();
    }, []);

    const getAnnouncements = async () => {
        const adminRef = doc(db, 'admin', uids[0]);
        try {
            const adminShot = await getDoc(adminRef);
            if (adminShot.exists) {
                const data = adminShot.data();
                const announcements = data.announcements || [];
                setAnnouncementsContainer(announcements);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        if (uids.length > 0) {
            getAnnouncements();
        }
    }, [uids]);

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            try {
                const studentDocRef = doc(db, 'student', container[0].id);
                const studentDocSnapshot = await getDoc(studentDocRef);
                if (studentDocSnapshot.exists()) {
                    const studentData = studentDocSnapshot.data();
                    const enrolledCourses = studentData.EnrolledCourses || [];
                    setEnrolledCourses(enrolledCourses);
                } else {
                    console.log('Student document not found.');
                }
            } catch (error) {
                console.error('Error fetching enrolled courses:', error.message);
            }
        };
        fetchEnrolledCourses();
    }, [container]);

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-6 flex justify-between">

            {/* Enrolled Courses Section */}
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mr-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Enrolled Courses</h3>
                {studentEnrolledCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {studentEnrolledCourses.map((course, index) => (
                            <div
                                key={index}
                                className="bg-gray-100 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                                onClick={() => { navigate('/studentcoursecontainer', { state: { key: course } }); }}
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
                    <p className="text-gray-600 text-center">You are not enrolled in any courses yet.</p>
                )}
            </div>

            {/* Announcements Section */}
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-xs w-1/3">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Announcements</h3>
                {announcementContainer.length > 0 ? (
                    <div className="space-y-4">
                        {announcementContainer.map((data, id) => (
                            <div key={id} className="bg-blue-50 p-4 rounded-lg shadow hover:bg-blue-100 transition">
                                <h4 className="text-lg font-semibold text-blue-600">{data.Heading}</h4>
                                <p className="text-gray-600">{data.Description}</p>
                                <p className="text-sm text-gray-400 mt-2">Thursday, 23 June, 2019 at 9:23 PM</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-center">No announcements available.</p>
                )}
            </div>
        </div>
    );
};

export default StudentHome;
