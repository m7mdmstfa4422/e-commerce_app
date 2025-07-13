import React, { useEffect } from 'react'
import { useState } from 'react'
import style from './Products.module.css'
import RecentProducts from '../RecentProducts/RecentProducts'

export default function Products() {
    const [cont, setcont] = useState(0)
    useEffect(() => {
        document.title = "Prodacts";


    }, [])
    return <>
        <RecentProducts />
    </>

}
