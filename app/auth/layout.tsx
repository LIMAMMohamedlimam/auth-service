import React from 'react'

const layout = ({children} : {children : React.ReactNode}) => {
  return (
    <div className='h-full flex items-center justify-center text-white
    bg-radial from-sky-400  to-blue-800'>
        {children}
    </div>
  )
}

export default layout