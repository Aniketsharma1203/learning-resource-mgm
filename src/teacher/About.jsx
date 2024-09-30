import React, { useContext } from 'react';
import { UserContext } from '../context/UseContext';
import { CgProfile } from "react-icons/cg";

const About = () => {
  const { container } = useContext(UserContext);

  return (
    <div className='flex justify-center items-center'>
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-5xl mx-auto flex items-start space-x-8 justify-center">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-white">
          <CgProfile className="text-8xl mb-4 text-gray-400" /> {/* Profile Icon */}
          <h2 className="mt-2 text-2xl font-semibold">{container[0]?.name}</h2> {/* Name */}
        </div>

        {/* About Section */}
        <div className="about-text text-gray-300 space-y-4 max-w-xl leading-relaxed">
          <p>
            {container[0]?.name} is a highly experienced full-stack MERN developer currently working at Aron Web Solutions.
            With expertise in MongoDB, Express, React, and Node.js, they have been involved in developing robust and scalable web applications for various industries.
          </p>
          <p>
            At Aron Web Solutions, they specialize in building end-to-end solutions, leveraging modern JavaScript frameworks
            and libraries to create seamless user experiences and efficient backend systems. Their passion for coding is matched
            by their dedication to teaching, making them an excellent mentor for aspiring developers.
          </p>
          <p>
            In addition to their professional work, they are an enthusiastic educator, offering deep insights into the MERN stack.
            Their hands-on approach to teaching allows students to not only grasp theoretical knowledge but also build practical
            applications that solve real-world problems.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
