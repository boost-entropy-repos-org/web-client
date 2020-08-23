import React from 'react'
import {  IconRefresh} from '../icons'
export default function Loading() {
    return (
        <div className=' h-64 text-3xl text-gray-700 flex flex-col items-center justify-center text-center w-full '>
            <IconRefresh size='32' styling='anim-rotate'/>
            <small>Loading</small>
        </div>
    )
}