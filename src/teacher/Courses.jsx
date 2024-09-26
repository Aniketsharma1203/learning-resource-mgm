import React, { useState } from 'react'
import { IoMdAddCircle } from "react-icons/io";
import { useContext } from 'react';
import { UserContext } from '../context/UseContext';
import { db } from '../firebase/Firebase';
import { setDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


const Courses = () => {

  const { container } = useContext(UserContext);
  const [name, setName] = useState("");
  const [value, setValue] = useState(null);

  console.log(container[0].id);

  const addCourse = async () => {
    const teacher = doc(db, "teacher", container[0].id);
    try {
      // First, get the current courses data from Firestore
      const teacherSnapshot = await getDoc(teacher);

      if (teacherSnapshot.exists()) {
        const teacherData = teacherSnapshot.data();
        const currentCourses = teacherData.courses || {}; // Get current courses or default to an empty object

        // Add the new course to the existing courses object
        const newCourse = { "name": name, "value": value }; // Example: Adding a course "New Course" with value 10

        let updatedCourses;

        if (currentCourses.length > 0) {
          updatedCourses = [...currentCourses, newCourse]; // Merge new course into current courses
        }
        else {
          updatedCourses = [newCourse];
        }
        // Update Firestore with the merged courses object
        await updateDoc(teacher, {
          courses: updatedCourses
        });

        console.log('Course successfully added!');
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.log('Error adding course:', error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setName("");
    setValue("");
    addCourse();
  };

  return (
    <>
      <div className="p-11 flex flex-col">

        <div className='w-[70%]'>
          <div>
            <h3 className='font-semibold text-2xl animate-pulse'>Courses</h3>
          </div>

          <div className='mt-8 bg-red-500 w-64 flex justify-center p-2 rounded-xl cursor-pointer' >


            <Popup trigger={<h2 className='font-semibold text-3xl'>Add New Course  <IoMdAddCircle /></h2>} position="right center"
              contentStyle={{
                width: '300px',
                padding: '20px',
                backgroundColor: '#f1f1f1',
                textAlign: 'center',
              }}>
              <div className=''>
                <form action="" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="name">Enter Course Name :</label>
                    <input type="text" value={name} onChange={(e) => { setName(e.target.value) }} />
                  </div>
                  <div>
                    <label htmlFor="name">Enter Value :</label>
                    <input type="number" value={value} onChange={(e) => { setValue(e.target.value) }} />
                  </div>
                  <button className='bg-green-300 mt-3 p-2 rounded-xl'>Submit</button>
                </form>
              </div>
            </Popup>



          </div>
        </div>

        <hr class="border-gray-800 dark:border-white my-6" />

        <div className='w-[30%]'>

        </div>



      </div >
    </>
  )
}

export default Courses
