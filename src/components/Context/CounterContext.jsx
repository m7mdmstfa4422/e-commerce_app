import { createContext } from 'react'
import { useState } from 'react'

export let CounterContext = createContext(0)

export default function CounterContextProvider(props) {
    const [Counter, setCounter] = useState(0)
    const [User, setUser] = useState(' ahmed ')

    return <CounterContext.Provider value={{ Counter, setCounter, User, useState }}>
        {props.children}
    </CounterContext.Provider>
}
