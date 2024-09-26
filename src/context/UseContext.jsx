import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export default function UserContextProvider({children}) {
  const[container,setcontainer] = useState([]);
  return (

      <UserContext.Provider value={{container,setcontainer}}>
   {children}
      </UserContext.Provider>

  );
}