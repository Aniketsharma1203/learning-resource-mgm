import React from 'react'

const NavBar = () => {
    return (
        <div>
            <div className='m-5'>
                <div className='flex justify-around items-center font-serif'>
                    <img src="https://doctorialsacademy.com/wp-content/uploads/2024/02/DA-Logo-1024x340.png" alt='logo' width={150} />
                    <div className='flex gap-20'>
                        <p className='shadow-slate-300 shadow-sm p-2 hover:cursor-pointer hover:bg-slate-300'>Home</p>
                        <p className='shadow-slate-300 shadow-sm p-2 hover:cursor-pointer hover:bg-slate-300'>About</p>
                        <p className='shadow-slate-300 shadow-sm p-2 hover:cursor-pointer hover:bg-slate-300'>Contact</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavBar;