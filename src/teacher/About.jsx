import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context/UseContext';
import { toast } from 'react-toastify';
import { db } from '../firebase/Firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const About = () => {
  const { container, setcontainer } = useContext(UserContext);


  useEffect(() => {
    const fetchData = async () => {
      const teacherDocRef = doc(db, 'teacher', container[0].id);
      const teacherDocSnapshot = await getDoc(teacherDocRef);

      if (teacherDocSnapshot.exists()) {
        const teacherData = teacherDocSnapshot.data();
        setcontainer([{ ...container[0], PendingRequests: teacherData.PendingRequests }]);
      }
    };

    fetchData();
  }, [container]);


  // Confirm Pending Request
  const confirmPending = async () => {
    const pendingRequests = container[0].PendingRequests; // Access directly from container
    if (!pendingRequests || pendingRequests.length === 0) return;

    try {
      const studentDocRef = doc(db, 'student', pendingRequests[0].requestedBy);
      const studentDocSnapshot = await getDoc(studentDocRef);

      if (studentDocSnapshot.exists()) {
        const updatedCourses = [pendingRequests[0]]; // Enroll the first pending course
        await updateDoc(studentDocRef, { EnrolledCourses: updatedCourses });
        toast.success('Request for enrollment accepted!');

        // Update Firestore and remove the confirmed request
        removePending();
      } else {
        console.log('Student document not found.');
      }
    } catch (error) {
      console.error('Error enrolling course:', error.message);
    }
  };

  // Remove Pending Request (either on confirm or decline)
  const removePending = async () => {
    try {
      const teacherDocRef = doc(db, 'teacher', container[0].id);
      const updatedPendingRequests = pendingRequests.slice(1); // Remove the first pending request (accepted or declined)

      // Update Firestore
      await updateDoc(teacherDocRef, { PendingRequests: updatedPendingRequests });

      // Persist in context
      const updatedContainer = { ...container[0], PendingRequests: updatedPendingRequests };
      setcontainer([updatedContainer]);

      toast.success('Pending request updated successfully!');
    } catch (error) {
      console.error('Error removing pending request:', error.message);
    }
  };



  const pendingRequests = container[0]?.PendingRequests || []; // Always get latest data from container

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Pending Courses</h2>

        {pendingRequests.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6">
            {/* Course Image and Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start">
              {/* Course Image */}
              <img
                src={pendingRequests[0].img}
                alt="course"
                className="w-full md:w-1/3 h-48 object-cover rounded-lg mb-4 md:mb-0 md:mr-6"
              />

              {/* Course Info */}
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  Course Name: <span className="font-medium">{pendingRequests[0].name}</span>
                </p>
                <p className="text-gray-700 mb-4">
                  Requested By: <span className="font-medium">{pendingRequests[0].requestedBy}</span>
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row md:space-x-4 mt-6">
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition w-full md:w-auto mb-3 md:mb-0"
                onClick={confirmPending}
              >
                Confirm
              </button>
              <button
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition w-full md:w-auto"
                onClick={removePending}
              >
                Decline
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-center">No pending requests at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default About;
