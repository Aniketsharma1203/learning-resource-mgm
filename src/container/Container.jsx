import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UseContext';
import { db } from '../firebase/Firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const CoursePage = () => {
    const { currentCourse } = useContext(UserContext);
    const [courseContent, setContent] = useState({ selectedFile: null, previewURL: null });
    const [courseContentsList, setCourseContentsList] = useState(currentCourse.CourseContent || []);
    const { container } = useContext(UserContext);

    const onFileChange = (event) => {
        const file = event.target.files[0];
        const previewURL = URL.createObjectURL(file);
        setContent({ selectedFile: file, previewURL: previewURL });
    };


    const addContent = async () => {
        const teacherRef = doc(db, "teacher", container[0].id);
        try {
            const teacherSnapshot = await getDoc(teacherRef);
            if (teacherSnapshot.exists()) {
                const allCourses = teacherSnapshot.data().courses;
                const updatedCourses = allCourses.map(course => {
                    if (course.name === currentCourse.name) {
                        return {
                            ...course,
                            CourseContent: course.CourseContent
                                ? [...course.CourseContent, courseContent.previewURL]
                                : [courseContent.previewURL]
                        };
                    }
                    return course;
                });
                await updateDoc(teacherRef, { courses: updatedCourses });
                // Update local state to trigger re-render
                setCourseContentsList(prev => [...prev, courseContent.previewURL]);
                console.log("Course content updated successfully.");
            } else {
                console.log("Teacher document not found.");
            }
        } catch (error) {
            console.log('Error updating course content:', error.message);
        }
    };

    const onFileUpload = () => {
        addContent();
        setContent({ selectedFile: null, previewURL: null });
    };

    const renderCourseContentList = () => {
        if (courseContentsList && courseContentsList.length > 0) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {courseContentsList.map((content, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg overflow-hidden p-4">
                            {content.endsWith('.jpg') || content.endsWith('.png') || content.endsWith('.jpeg') ? (
                                <img src={content} alt={`Course Content ${index}`} className="w-full h-48 object-cover" />
                            ) : content.endsWith('.mp4') ? (
                                <video controls className="w-full h-48 object-cover">
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
            );
        } else {
            return <p className="text-gray-500 mt-4">No course content available.</p>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            {/* Breadcrumb Navigation */}
            <div className="text-gray-400 mb-4 text-sm">
                <a href="#" className="hover:underline">Store</a> / <a href="#" className="hover:underline">Course</a> / {currentCourse.name}
            </div>

            {/* Main Layout */}
            <div className="flex flex-col md:flex-row justify-between">
                {/* Left Column - Syllabus */}
                <div className="w-full md:w-2/3">
                    {/* Course Title */}
                    <h1 className="text-4xl font-bold mb-4">{currentCourse.name}</h1>
                    <p className="text-gray-300 mb-8">{currentCourse.desc}</p>

                    {/* Syllabus */}
                    <h2 className="text-2xl font-semibold mb-4">Syllabus</h2>
                    <div className="bg-gray-800 rounded-lg shadow p-4">
                        <div className="mb-4">
                            <div className="bg-gray-700 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold">{currentCourse.name}</h3>
                                <p className="text-gray-400 text-sm">{currentCourse.CourseContent.length} Lessons</p>
                            </div>
                            {/* Lesson List */}
                            <ul className="mt-4 text-sm space-y-2">
                                <li className="flex items-center justify-between">
                                    <div className="flex items-center">

                                    </div>

                                </li>
                                <li className="flex items-center justify-between">
                                    <div className="flex items-center">

                                    </div>

                                </li>
                                <li className="flex items-center justify-between">
                                    <div className="flex items-center">

                                    </div>

                                </li>
                                {/* Add more lessons similarly */}
                            </ul>
                        </div>
                    </div>

                    {/* Course Content Upload */}
                    <div className="mt-6">
                        <p className="text-xl mb-4 font-semibold">Upload Course Content:</p>
                        <div className="flex flex-col items-start space-y-4">
                            <input
                                type="file"
                                onChange={onFileChange}
                                className="border p-2 rounded-lg"
                            />
                            <button
                                onClick={onFileUpload}
                                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
                            >
                                Upload!
                            </button>
                        </div>
                        {renderCourseContentList()}
                    </div>
                </div>

                {/* Right Column - Course Details */}
                <div className="w-full md:w-1/3 md:pl-8 mt-8 md:mt-0">
                    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                        <img
                            src={currentCourse.img} // Assuming currentCourse.img contains the image URL
                            alt={currentCourse.name}
                            className="w-full rounded-lg mb-4"
                        />
                        <p className="font-semibold text-lg mb-2">Price: ${currentCourse.price}</p>
                        <p className="font-semibold text-lg mb-4">Value: {currentCourse.value}</p>
                        <button className="bg-orange-600 text-white py-2 px-4 rounded-lg w-full hover:bg-orange-700">
                            ENROLL FOR FREE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePage;
