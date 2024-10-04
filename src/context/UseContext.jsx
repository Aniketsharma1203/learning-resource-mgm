import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export default function UserContextProvider({children}) {
  const[container,setcontainer] = useState([]); //Stores loggedin person info
  const[currentCourse, setCourse] = useState(null); //Stores Current Course of container
  const[studentEnrolledCourses, setEnrolledCourses] = useState([]);
  return (

      <UserContext.Provider value={{container,setcontainer,currentCourse, setCourse,studentEnrolledCourses, setEnrolledCourses}}>
   {children}
      </UserContext.Provider>

  );
}