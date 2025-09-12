import React from 'react'
import MaxWidthWrapper from './MaxWidthWrapper'
import { User } from 'lucide-react'

const Navbar = () => {
  return (
    <>
    <MaxWidthWrapper className='py-2'>
        <h1 className='text-xl font-semibold'>Spark</h1>
        <User className='size-20' />
    </MaxWidthWrapper>
    </>
  )
}

export default Navbar