import React from 'react';
import { FaChalkboardTeacher } from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {

  const cardStyle = {
    display: 'inline-block',
    width: '300px',
    margin: '20px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: '0.3s',
    backgroundColor: '#ffffff',
    textAlign: 'center',
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '40vh',
    backgroundColor: '#f4f4f9',
  };

  const hoverEffect = {
    ...cardStyle,
    ':hover': {
      boxShadow: '0 12px 16px rgba(0, 0, 0, 0.2)',
    },
  };

  const iconStyle = {
    fontSize: '48px',
    color: '#3c3c3c',
  };

  const navigate = useNavigate();

  // Wrap the navigate call in a function
  const handleNavigateToTeachers = () => {
    navigate('/teacherList');
  };

  const handleNavigateToStudents = () => {
    navigate('/studentList');
  };

  const handleNavigateToCourses = () => {
    navigate('/courseList');
  };

  return (
    <div>
      <div style={containerStyle}>
        <div
          style={hoverEffect}
          className='hover:cursor-pointer'
          onClick={handleNavigateToTeachers} // Call the function on click
        >
          <FaChalkboardTeacher style={iconStyle} />
          <h3 className='text-xl font-medium'>Teachers</h3>
          <p>Click here to see list of Teachers</p>
        </div>

        <div style={hoverEffect} className='hover:cursor-pointer' onClick={handleNavigateToStudents}>
          <ImBooks style={iconStyle} />
          <h3 className='text-xl font-medium'>Students</h3>
          <p>Click here to see list of Students.</p>
        </div>

        <div style={hoverEffect} className='hover:cursor-pointer' onClick={handleNavigateToCourses}>
          <PiChalkboardTeacherFill style={iconStyle} />
          <h3 className='text-xl font-medium'>Courses</h3>
          <p>Click here to see list of Courses.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
