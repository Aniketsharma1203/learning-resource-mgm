import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export default function UserContextProvider({children}) {
  const[container,setcontainer] = useState([]);
  const[currentCourse, setCourse] = useState(null);
  return (

      <UserContext.Provider value={{container,setcontainer,currentCourse, setCourse}}>
   {children}
      </UserContext.Provider>

  );
}