import React, { useEffect } from 'react'
import { useState } from 'react'
import styles from './Sppiner.module.css'

export default function Sppiner() {
  const [cont, setcont] = useState(0)
  useEffect(() => {


  }, [])
  return <>
    <div className='fixed inset-0  bg-[#ffffffcc] dark:bg-neutral-900 flex justify-center items-center z-40 backdrop-blur-sm'>
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
        {/* <span className={styles.loadingText}>Loading...</span> */}
      </div>
    </div>

  </>

}
