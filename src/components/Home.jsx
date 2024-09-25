import React from 'react'
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar'

const Home = () => {
    const Navigate = useNavigate();
    return (

        <div>
            <NavBar />
            <div className='bg-gradient-to-r from-purple-400 to-pink-600 '>

                <div className='relative h-[863px]' >

                    <div className='absolute top-48 left-60 gap-10 text-white flex flex-col '>
                        <span className='text-7xl '>Elevate Your <br></br> Coaching Journey <br></br> Online <br></br></span>
                        <div className='text-[18px] '>
                            Doctorials Academy offers a holistic education. With top-notch faculty,<br></br>exam focused preparation, and an affordable approach,
                            we go beyond classrooms to<br></br> nurture your success. Join us for a rewarding journey towards a thriving career.
                        </div>
                    </div>

                    <div >
                        <img src='https://doctorialsacademy.com/wp-content/uploads/2024/01/Untitled-design-16-794x1024.png' alt='girdl' width={669} className='absolute right-0'></img>
                    </div>

                    <div className='absolute text-white bottom-48 left-60 flex gap-10'>
                        <button className='w-28 h-10 rounded-md bg-gradient-to-r from-purple-300 to-blue-400 ' onClick={() => { Navigate('/login'); }}>LogIn</button>
                        <button className='w-28 h-10 rounded-md bg-gradient-to-r from-purple-300 to-blue-400 ' onClick={() => { Navigate('/register'); }}>Register</button>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Home
