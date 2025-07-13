import React, { useEffect } from 'react'
import { useState } from 'react'
import style from './Notheink.module.css'
import img404 from './error.svg'
import { Link } from 'react-router-dom'


export default function Notheink() {
    const [cont, setcont] = useState(0)
    useEffect(() => {
        document.title = "Not Found 404";


    }, [])
    return <>
        <div className="h-screen flex flex-col items-center justify-center">
            <img src={img404} alt="صفحة غير موجودة" className="max-w-full max-h-full" />
            <h3 className='text-2xl mt-5 font-semibold text-emerald-400 dark:text-white'>This path is not available</h3>
            <Link to='/'>
                <button className= 'cursor-pointer mt-7 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 flex items-center justify-center'> Back to Home</button>
            </Link>
        </div>
    </>

}
