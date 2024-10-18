import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UseContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/Firebase';
import { toast } from 'react-toastify';
import { ImCross } from 'react-icons/im';

const Announcements = () => {
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { container } = useContext(UserContext);
  const [alreadyAnnouncements, setAnnouncements] = useState([]);

  const getAnnouncements = async () => {
    const adminRef = doc(db, 'admin', container[0].id);
    try {
      const adminShot = await getDoc(adminRef);
      if (adminShot.exists) {
        const data = adminShot.data();
        const announcements = data.announcements || [];
        setAnnouncements(announcements);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getAnnouncements();
  }, []);

  const addAnnouncement = async () => {
    const adminRef = doc(db, 'admin', container[0].id);
    try {
      const adminShot = await getDoc(adminRef);
      if (adminShot.exists) {
        const data = adminShot.data();
        const announcements = data.announcements || [];
        const newAnnouncements = { Heading: heading, Description: description };
        const updatedAnnouncements = [...announcements, newAnnouncements];

        await updateDoc(adminRef, {
          announcements: updatedAnnouncements,
        });
        toast.success('Announcement added.');
        setAnnouncements(updatedAnnouncements);

        setHeading('');
        setDescription('');
        setIsCreating(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteAnnouncement = async (id) => {
    const adminRef = doc(db, 'admin', container[0].id);
    try {
      const updatedAnnouncements = alreadyAnnouncements.filter((_, index) => index !== id);
      await updateDoc(adminRef, {
        announcements: updatedAnnouncements,
      });
      setAnnouncements(updatedAnnouncements);
      toast.success('Announcement deleted.');
    } catch (error) {
      console.log(error.message);
    }
  };

  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');

  const currentTime = `${hours}:${minutes}`;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-white shadow p-4">
          <div>
            <h1 className="text-xl font-bold">Make An Announcement</h1>
          </div>
        </header>

        <div className="flex justify-between items-center bg-white shadow p-4 mt-2">
          <button
            onClick={() => setIsCreating(!isCreating)} // Toggle form visibility
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            {isCreating ? 'Cancel' : 'Create Announcement'}
          </button>
        </div>

        {isCreating && (
          <div className="bg-white p-6 rounded-lg shadow-lg mx-4 my-4">
            <div className="mb-4">
              <label htmlFor="heading" className="block text-lg font-medium text-gray-700 mb-2">
                Heading:
              </label>
              <input
                type="text"
                id="heading"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                placeholder="Enter the announcement heading"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
                Description:
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                placeholder="Enter the announcement description"
                rows="4"
              ></textarea>
            </div>

            <div className="flex justify-center">
              <button
                onClick={addAnnouncement}
                className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
              >
                Submit Announcement
              </button>
            </div>
          </div>
        )}

        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Course Announcements</h2>
          <div className="space-y-4">
            {alreadyAnnouncements.length ? (
              alreadyAnnouncements.map((data, id) => (
                <div
                  key={id}
                  className="bg-white shadow-lg p-4 rounded-lg flex items-center space-x-4 hover:bg-gray-50 transition relative"
                >
                  <img
                    src={`https://i.pravatar.cc/40?img=${id + 1}`}
                    alt="avatar"
                    className="rounded-full w-12 h-12"
                  />
                  <div className="">
                    <h3 className="font-semibold text-lg text-blue-600">{data.Heading}</h3>
                    <p className="text-gray-600">{data.Description}</p>
                    <p className="text-sm text-gray-400 mt-2">{formattedDate} at {currentTime}</p>
                  </div>

                  {/* Delete Button */}
                  <div
                    className="absolute right-4 top-4 p-2 bg-red-500 text-white rounded-full cursor-pointer hover:bg-red-600 transition transform hover:scale-110"
                    onClick={() => deleteAnnouncement(id)}
                    title="Delete Announcement"
                  >
                    <ImCross className="w-4 h-4" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No announcements available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
