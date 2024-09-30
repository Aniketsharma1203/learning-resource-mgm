import React, { useContext } from 'react'
import { UserContext } from '../context/UseContext'

const StudentHome = () => {
    const {container} = useContext(UserContext);

    return (
        <div>
            <div className="bg-white shadow-lg rounded-lg p-6 mt-8 mx-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Student Summary</h3>
                <div className="flex flex-col space-y-2">
                    <p className="text-gray-600"><span className="font-bold">Student ID:</span> {container[0].id}</p>
                    <p className="text-gray-600"><span className="font-bold">Student Name:</span> {container[0].name}</p>
                    <p className="text-gray-600"><span className="font-bold">Student Email:</span> {container[0].email}</p>
                </div>
            </div>
        </div>
    )
}

export default StudentHome;
