import React from 'react'
import { useAuth } from '../../context/authContext'

const Navbar = () => {
    const {user, logout} = useAuth()
    return (
        <div className='flex items-center text-white justify-between h-16 bg-teal-600 px-5'>
            <p >Welcome {user.name}</p>
            <button onClick={logout} className='px-4 py-1 bg-teal-700 hover:bg-teal-800'>Logout</button>
        </div>
    )
}

export default Navbar

