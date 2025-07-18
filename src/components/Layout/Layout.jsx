import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from '../Nav/Nav'
export default function Layout() {
    return <>
        {/* <Nav/> */}
        <div className="overflow-auto ">
            <Nav />
        </div>

        <div className=" container mx-auto">
            <Outlet />
        </div>
    </>
}
