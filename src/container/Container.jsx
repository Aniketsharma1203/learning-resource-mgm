import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UseContext';
import { db, storage } from '../firebase/Firebase'; // Import storage from Firebase config
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Import storage methods

const CoursePage = () => {
    const { currentCourse } = useContext(UserContext);
    const [courseContent, setContent] = useState({ selectedFile: null, previewURL: null });
    const [courseContentsList, setCourseContentsList] = useState(currentCourse.CourseContent || []); // If no content, default to an empty array
    const { container } = useContext(UserContext);
    const [uploading, setUploading] = useState(false);

    const onFileChange = (event) => {
        const file = event.target.files[0];
        try {
            setContent({ selectedFile: file, previewURL: URL.createObjectURL(file) });
        } catch (error) {
            console.log(error.message);
        }

    };

    // Upload file to Firebase Storage
    const uploadFileToStorage = async () => {
        if (!courseContent.selectedFile) return null;

        const file = courseContent.selectedFile;
        const fileRef = ref(storage, `course_contents/${file.name}`); // Reference to storage path
        const uploadTask = uploadBytesResumable(fileRef, file); // Upload task

        setUploading(true); // Set uploading state
        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Optional: Monitor progress (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                },
                (error) => {
                    console.error("Error during upload:", error);
                    setUploading(false);
                    reject(error);
                },
                async () => {
                    // On successful upload, get the download URL
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    setUploading(false);
                    resolve(downloadURL); // Resolve promise with the download URL
                }
            );
        });
    };

    useEffect(() => {
        console.log("Course content updated:", courseContent);
        console.log("Course contents list updated:", courseContentsList);
        console.log("Uploading state:", uploading);
    }, [courseContent, courseContentsList, uploading]);

    const addContent = async () => {
        const teacherRef = doc(db, "teacher", container[0].id);
        try {
            const teacherSnapshot = await getDoc(teacherRef);
            if (teacherSnapshot.exists()) {
                // Get download URL after file upload
                const downloadURL = await uploadFileToStorage();
                if (!downloadURL) return; // Exit if no download URL

                const allCourses = teacherSnapshot.data().courses;
                const updatedCourses = allCourses.map(course => {
                    if (course.name === currentCourse.name) {
                        return {
                            ...course,
                            CourseContent: course.CourseContent
                                ? [...course.CourseContent, downloadURL]
                                : [downloadURL] // Create array if CourseContent doesn't exist
                        };
                    }
                    return course;
                });

                await updateDoc(teacherRef, { courses: updatedCourses });
                // Update local state to trigger re-render
                setCourseContentsList(prev => [...prev, downloadURL]);
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
                            {content.includes('.jpg') || content.includes('.png') || content.includes('.jpeg') ? (
                                <a href={content} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex justify-center items-center text-2xl">
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
                                <p className="text-gray-400 text-sm">{courseContentsList.length} Lessons</p> {/* Updated to handle empty content */}
                            </div>
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
                                accept="image/*,video/*,.pdf,.docx"
                            />
                            <button
                                onClick={onFileUpload}
                                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
                                disabled={uploading}
                            >
                                {uploading ? "Uploading..." : "Upload!"}
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
                        <p className="font-semibold text-lg mb-4">Lessons: {currentCourse.value}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePage;
