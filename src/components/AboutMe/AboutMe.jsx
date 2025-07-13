import React, { useEffect } from 'react'
import { useState } from 'react'
import style from './AboutMe.module.css'

export default function AboutMe() {
    const [cont, setcont] = useState(0)
    useEffect(() => {


    }, [])
    return <>
        <div>AboutMe</div>
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore rem, ratione blanditiis reiciendis mollitia libero at, omnis minus doloremque saepe quos magni similique maxime consectetur optio, tempora hic sapiente soluta!</div>
    </>

}
