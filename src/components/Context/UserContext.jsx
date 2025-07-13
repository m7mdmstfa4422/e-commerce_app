import { createContext, useEffect, useState } from "react";

export let UserContext = createContext(0)

export default function UserContextProvider(props) {
    const [UserLogin, setUserLogin] = useState(null)

    useEffect(() => {
        if (localStorage.getItem('usreToken') !== null) {
            setUserLogin(localStorage.getItem('usreToken'))
        }
    }, [])

    return <>
        <UserContext.Provider value={{ UserLogin, setUserLogin }}>
            {props.children}
        </UserContext.Provider>
    </>
}