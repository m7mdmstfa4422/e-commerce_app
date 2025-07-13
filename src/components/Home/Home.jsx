import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import style from './Home.module.css'
import { CounterContext } from '../Context/CounterContext'
import RecentProducts from '../RecentProducts/RecentProducts'
import CategorySlider from '../CategorySlider/CategorySlider'

export default function Home() {

    

    useEffect(() => {
                document.title = "Home";

    }, [])
    return <>
        <div className='container mx-auto py-5 '>

            <CategorySlider />
            <RecentProducts />

        </div >


    </>

}
