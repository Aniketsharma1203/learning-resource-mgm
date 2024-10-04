import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import LogIn from './pages/LogIn';
import Register from './pages/Register';
import { ToastContainer } from 'react-toastify';
import Teacher from './role/Teacher';
import Student from './role/Student';
import Admin from './role/Admin';
import Dashboard from './teacher/Dashboard';
import Courses from './teacher/Courses';
import About from './teacher/About';
import Container from './container/Container';
import StudentHome from './student/StudentHome';
import StudentCourseContainer from './container/StudentCourseContainer';
import TeachersList from './Admin/AdminContainer/TeachersList';
import StudentList from './Admin/AdminContainer/StudentList';
import CoursesList from './Admin/AdminContainer/CoursesList';

function App() {
  return (
    < >
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/register' element={<Register />} />
        <Route path='/teacher' element={<Teacher />} />
        <Route path='/student' element={<Student />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='courses' element={<Courses />} />
        <Route path='/about' element={<About />} />
        <Route path='/container' element={<Container />} />
        <Route path='/studenthome' element={<StudentHome />} />
        <Route path='/studentcoursecontainer' element={<StudentCourseContainer />} />
        <Route path='/teacherList' element={<TeachersList />} />
        <Route path='/studentList' element={< StudentList />} />
        <Route path='/courseList' element={< CoursesList />} />
      </Routes>
    </>
  );
}

export default App;
