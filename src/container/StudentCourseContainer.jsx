import React from 'react';
import { useLocation } from 'react-router-dom';

const StudentCourseContainer = () => {
    const courses = useLocation();
    const data = courses.state.key;

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            {/* Course Details Section */}
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
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
                                {/* Check for image, video, or other file types */}
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
                </div>
            </div>
        </div>
    );
}

export default StudentCourseContainer;
