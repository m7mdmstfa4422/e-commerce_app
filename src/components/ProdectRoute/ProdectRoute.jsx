import React, { useEffect } from 'react'
import { useState } from 'react'
import style from './ProdectRoute.module.css'
import { Navigate } from 'react-router-dom'

export default function ProdectRoute(props) {
    const [cont, setcont] = useState(0)

    if (localStorage.getItem('usreToken') !== null) {
        return props.children
    } else {
        return <Navigate to={'/login'} />
    }
}
