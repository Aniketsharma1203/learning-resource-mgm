import React, { useState, useEffect } from 'react';
import { IoMdAddCircle } from "react-icons/io";
import { useContext } from 'react';
import { UserContext } from '../context/UseContext';
import { db } from '../firebase/Firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
  const { currentCourse, setCourse } = useContext(UserContext);
  const Navigate = useNavigate();

  const { container } = useContext(UserContext);
  const [name, setName] = useState("");
  const [value, setValue] = useState(null);
  const [courses, setCourses] = useState([]);
  const [description, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(null);
  const [price, setPrice] = useState(null);

  console.log(container[0].id);

  const courseContainer = (course) => {
    setCourse(course);
    Navigate('/container');
  };
  console.log(currentCourse, "curent");
  const addCourse = async () => {
    const teacher = doc(db, "teacher", container[0].id);
    try {
      setLoading(true);
      // First, get the current courses data from Firestore
      const teacherSnapshot = await getDoc(teacher);

      if (teacherSnapshot.exists()) {
        const teacherData = teacherSnapshot.data();
        const currentCourses = teacherData.courses || [];

        // Add the new course to the existing courses array
        const newCourse = { "name": name, "value": value, "desc": description, "img": img, "price": price, "Enrolled": [], "CourseContent": [] };

        const updatedCourses = [...currentCourses, newCourse];

        // Update Firestore with the merged courses array
        await updateDoc(teacher, {
          courses: updatedCourses
        });

        // Update local state with the new courses
        setCourses(updatedCourses);

        console.log('Course successfully added!');
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.log('Error adding course:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addCourse();
    setName("");
    setValue("");
  };

  const fetchCourses = async () => {
    const teacher = doc(db, "teacher", container[0].id);
    try {
      const teacherSnapshot = await getDoc(teacher);
      if (teacherSnapshot.exists()) {
        const teacherData = teacherSnapshot.data();
        setCourses(teacherData.courses || []);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.log('Error fetching courses:', error.message);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [container]);

  return (
    <>
      <div className="p-11 flex flex-col bg-gray-50 min-h-screen">
        <div className='w-[70%] mx-auto'>
          <div>
            <h3 className='font-semibold text-2xl text-gray-800'>Courses</h3>
          </div>

          {/* Add Course Popup */}
          <div className='mt-8 bg-green-500 w-64 flex justify-center p-2 rounded-xl cursor-pointer'>
            <Popup
              trigger={<h2 className='font-semibold text-3xl text-white flex items-center'>
                Add New Course <IoMdAddCircle className='ml-2' />
              </h2>}
              position="right center"
              contentStyle={{
                width: '300px',
                padding: '20px',
                backgroundColor: '#f1f1f1',
                textAlign: 'center',
              }}
            >
              <div>
                <form onSubmit={handleSubmit}>
                  <div className='mb-4'>
                    <label htmlFor="name" className="block font-semibold text-gray-700 mb-2">Enter Course Name:</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className='mb-4'>
                    <label htmlFor="value" className="block font-semibold text-gray-700 mb-2">Enter Value (lessons):</label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className='mb-4'>
                    <label htmlFor="desc" className="block font-semibold text-gray-700 mb-2">Enter Desc* :</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDesc(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className='mb-4'>
                    <label htmlFor="img" className="block font-semibold text-gray-700 mb-2">Enter Img(url):</label>
                    <input
                      type="text"
                      value={img}
                      onChange={(e) => setImg(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className='mb-4'>
                    <label htmlFor="price" className="block font-semibold text-gray-700 mb-2">Enter Course Price:</label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <button className='bg-green-500 text-white mt-3 p-2 rounded-xl w-full'>Submit</button>
                </form>
              </div>
            </Popup>
          </div>

          {/* Divider */}
          <hr className="border-gray-800 my-6" />

          {/* Display Courses */}
          <div className='w-full'>
            <h3 className='font-semibold text-xl text-gray-800 mb-4'>Available Courses</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {
                courses.length > 0 ? (
                  courses.map((course, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all" onClick={() => { courseContainer(course) }}>
                      <img
                        src={course.img}
                        alt="course"
                        className="rounded-t-md mb-4 w-full h-40 object-cover"
                      />
                      <h4 className="font-bold text-lg text-gray-800 mb-2">{course.name}</h4>
                      <p className="text-gray-600 text-sm">{course.value} lessons</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No courses available.</p>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Courses;
